// functions/src/billing/actions.ts
import { onCall, HttpsError } from "firebase-functions/v2/https";
import { defineSecret } from "firebase-functions/params";
import { logger } from "firebase-functions/v2";
import * as admin from "firebase-admin";
import { FieldValue } from "firebase-admin/firestore";
import { SolapiClient } from "./solapi-client";
import { PaypleClient } from "./payple-client";
import { PopbillClient } from "./popbill-client";
import { renderMessage } from "./templates";
import type {
  BillingClientDoc,
  BillingInvoiceDoc,
  BillingSettingsDoc,
} from "./types";

const solapiApiKey = defineSecret("SOLAPI_API_KEY");
const solapiApiSecret = defineSecret("SOLAPI_API_SECRET");
const paypleClientId = defineSecret("PAYPLE_CLIENT_ID");
const paypleClientSecret = defineSecret("PAYPLE_CLIENT_SECRET");
const popbillLinkId = defineSecret("POPBILL_LINK_ID");
const popbillSecretKey = defineSecret("POPBILL_SECRET_KEY");

const REGION = "asia-northeast3";
const ALL_SECRETS = [
  solapiApiKey,
  solapiApiSecret,
  paypleClientId,
  paypleClientSecret,
  popbillLinkId,
  popbillSecretKey,
];

function requireAdmin(request: { auth?: { token: Record<string, unknown> } }): void {
  if (!request.auth) {
    throw new HttpsError("unauthenticated", "인증이 필요합니다.");
  }
  if (request.auth.token.admin !== true) {
    throw new HttpsError("permission-denied", "관리자 권한이 필요합니다.");
  }
}

async function loadSettings(): Promise<BillingSettingsDoc> {
  const db = admin.firestore();
  const snap = await db.doc("billing-settings/default").get();
  if (!snap.exists) {
    throw new HttpsError("not-found", "billing-settings/default 문서가 없습니다.");
  }
  return snap.data() as BillingSettingsDoc;
}

async function logNotification(params: {
  clientId: string;
  clientName: string;
  projectId: string | null;
  type: string;
  channel: "sms" | "alimtalk";
  recipientPhone: string;
  message: string;
  status: "sent" | "failed";
  errorMessage: string | null;
}): Promise<void> {
  const db = admin.firestore();
  await db.collection("billing-notification-logs").add({
    ...params,
    sentAt: FieldValue.serverTimestamp(),
  });
}

/**
 * Callable: 고객 CMS 빌링키 등록 URL 생성 → SMS 발송
 */
export const registerCmsBilling = onCall(
  { region: REGION, secrets: ALL_SECRETS },
  async (request) => {
    requireAdmin(request);

    const { clientId } = request.data as { clientId?: string };
    if (!clientId) {
      throw new HttpsError("invalid-argument", "clientId가 필요합니다.");
    }

    const db = admin.firestore();
    const [clientSnap, settings] = await Promise.all([
      db.doc(`billing-clients/${clientId}`).get(),
      loadSettings(),
    ]);

    if (!clientSnap.exists) {
      throw new HttpsError("not-found", "고객 정보를 찾을 수 없습니다.");
    }
    const clientData = clientSnap.data() as BillingClientDoc;

    const payple = new PaypleClient(
      paypleClientId.value(),
      paypleClientSecret.value(),
      settings.paypleIsSandbox
    );

    const orderId = `cms_${clientId}_${Date.now()}`;
    const returnUrl = `https://us-central1-khakisketch.cloudfunctions.net/paypleWebhook`;

    const regResult = await payple.registerCmsBillingUrl({
      orderId,
      buyerName: clientData.contactName,
      buyerEmail: clientData.email,
      buyerPhone: clientData.phone,
      returnUrl,
    });

    if (!regResult.success || !regResult.authUrl) {
      logger.error("registerCmsBilling: payple register failed", {
        clientId,
        error: regResult.errorMessage,
      });
      throw new HttpsError(
        "internal",
        regResult.errorMessage ?? "빌링키 등록 URL 생성 실패"
      );
    }

    // 고객에게 SMS로 인증 URL 발송
    const solapi = new SolapiClient(
      solapiApiKey.value(),
      solapiApiSecret.value()
    );
    const msg = `[카키스케치] ${clientData.contactName}님, CMS 자동이체 등록 링크입니다. 아래 링크에서 본인인증 후 계좌를 등록해주세요.\n${regResult.authUrl}\n문의: ${settings.contactPhone}`;
    const smsResult = await solapi.sendMessage({
      to: clientData.phone,
      from: settings.solapiSendPhone,
      text: msg,
    });

    await logNotification({
      clientId,
      clientName: clientData.companyName,
      projectId: null,
      type: "manual",
      channel: "sms",
      recipientPhone: clientData.phone,
      message: msg,
      status: smsResult.success ? "sent" : "failed",
      errorMessage: smsResult.error ?? null,
    });

    logger.info("registerCmsBilling: done", { clientId, authUrl: regResult.authUrl });
    return { success: true, authUrl: regResult.authUrl };
  }
);

/**
 * Callable: 수동 입금 확인
 */
export const confirmPayment = onCall(
  { region: REGION, secrets: ALL_SECRETS },
  async (request) => {
    requireAdmin(request);

    const { invoiceId, clientId } = request.data as {
      invoiceId?: string;
      clientId?: string;
    };
    if (!invoiceId || !clientId) {
      throw new HttpsError(
        "invalid-argument",
        "invoiceId와 clientId가 필요합니다."
      );
    }

    const db = admin.firestore();

    // invoiceId를 docId로 찾기 (collectionGroup)
    const invoicesSnap = await db
      .collectionGroup("invoices")
      .where(admin.firestore.FieldPath.documentId(), "==", invoiceId)
      .limit(1)
      .get();

    if (invoicesSnap.empty) {
      throw new HttpsError("not-found", "청구서를 찾을 수 없습니다.");
    }

    const invoiceDoc = invoicesSnap.docs[0];
    const invoice = invoiceDoc.data() as BillingInvoiceDoc;

    if (invoice.status === "paid" || invoice.status === "waived") {
      throw new HttpsError(
        "failed-precondition",
        `이미 ${invoice.status} 상태입니다.`
      );
    }

    const confirmedBy = request.auth?.uid ?? "unknown";

    await invoiceDoc.ref.update({
      status: "paid",
      paidAt: FieldValue.serverTimestamp(),
      confirmedBy,
      updatedAt: FieldValue.serverTimestamp(),
    });

    logger.info("confirmPayment: done", { invoiceId, clientId, confirmedBy });
    return { success: true };
  }
);

/**
 * Callable: 청구 면제 처리
 */
export const waiveInvoice = onCall(
  { region: REGION, secrets: ALL_SECRETS },
  async (request) => {
    requireAdmin(request);

    const { invoiceId, clientId } = request.data as {
      invoiceId?: string;
      clientId?: string;
    };
    if (!invoiceId || !clientId) {
      throw new HttpsError(
        "invalid-argument",
        "invoiceId와 clientId가 필요합니다."
      );
    }

    const db = admin.firestore();

    const invoicesSnap = await db
      .collectionGroup("invoices")
      .where(admin.firestore.FieldPath.documentId(), "==", invoiceId)
      .limit(1)
      .get();

    if (invoicesSnap.empty) {
      throw new HttpsError("not-found", "청구서를 찾을 수 없습니다.");
    }

    const invoiceDoc = invoicesSnap.docs[0];
    const invoice = invoiceDoc.data() as BillingInvoiceDoc;

    if (invoice.status === "paid") {
      throw new HttpsError("failed-precondition", "이미 납부 완료 상태입니다.");
    }

    await invoiceDoc.ref.update({
      status: "waived",
      confirmedBy: request.auth?.uid ?? "unknown",
      updatedAt: FieldValue.serverTimestamp(),
    });

    logger.info("waiveInvoice: done", { invoiceId, clientId });
    return { success: true };
  }
);

/**
 * Callable: 수동 알림 SMS/알림톡 발송
 */
export const sendManualNotice = onCall(
  { region: REGION, secrets: ALL_SECRETS },
  async (request) => {
    requireAdmin(request);

    const { clientId, message } = request.data as {
      clientId?: string;
      message?: string;
    };
    if (!clientId || !message) {
      throw new HttpsError(
        "invalid-argument",
        "clientId와 message가 필요합니다."
      );
    }

    const db = admin.firestore();
    const [clientSnap, settings] = await Promise.all([
      db.doc(`billing-clients/${clientId}`).get(),
      loadSettings(),
    ]);

    if (!clientSnap.exists) {
      throw new HttpsError("not-found", "고객 정보를 찾을 수 없습니다.");
    }
    const clientData = clientSnap.data() as BillingClientDoc;

    const solapi = new SolapiClient(
      solapiApiKey.value(),
      solapiApiSecret.value()
    );

    const smsResult = await solapi.sendMessage({
      to: clientData.phone,
      from: settings.solapiSendPhone,
      text: message,
      type: settings.useAlimtalk ? "ATA" : undefined,
    });

    await logNotification({
      clientId,
      clientName: clientData.companyName,
      projectId: null,
      type: "manual",
      channel: settings.useAlimtalk ? "alimtalk" : "sms",
      recipientPhone: clientData.phone,
      message,
      status: smsResult.success ? "sent" : "failed",
      errorMessage: smsResult.error ?? null,
    });

    if (!smsResult.success) {
      throw new HttpsError("internal", smsResult.error ?? "SMS 발송 실패");
    }

    logger.info("sendManualNotice: done", { clientId });
    return { success: true, messageId: smsResult.messageId };
  }
);

/**
 * Callable: 프로젝트 해지 처리 (terminating 전환 + SMS)
 */
export const terminateProject = onCall(
  { region: REGION, secrets: ALL_SECRETS },
  async (request) => {
    requireAdmin(request);

    const { clientId, projectId, terminationDate, reason } = request.data as {
      clientId?: string;
      projectId?: string;
      terminationDate?: string;
      reason?: string;
    };
    if (!clientId || !projectId || !terminationDate) {
      throw new HttpsError(
        "invalid-argument",
        "clientId, projectId, terminationDate가 필요합니다."
      );
    }

    const db = admin.firestore();
    const [clientSnap, projectSnap, settings] = await Promise.all([
      db.doc(`billing-clients/${clientId}`).get(),
      db.doc(`billing-clients/${clientId}/projects/${projectId}`).get(),
      loadSettings(),
    ]);

    if (!clientSnap.exists) {
      throw new HttpsError("not-found", "고객 정보를 찾을 수 없습니다.");
    }
    if (!projectSnap.exists) {
      throw new HttpsError("not-found", "프로젝트를 찾을 수 없습니다.");
    }

    const clientData = clientSnap.data() as BillingClientDoc;

    await projectSnap.ref.update({
      status: "terminating",
      terminationDate,
      terminationReason: reason ?? null,
      updatedAt: FieldValue.serverTimestamp(),
    });

    // 해지 접수 SMS
    const solapi = new SolapiClient(
      solapiApiKey.value(),
      solapiApiSecret.value()
    );
    const projectData = projectSnap.data();
    const msg = renderMessage("termination_scheduled", {
      contactName: clientData.contactName,
      projectName: projectData?.name ?? projectId,
      totalAmount: "",
      billingDate: "",
      month: "",
      bankInfo: "",
      taxEmail: clientData.taxEmail,
      contactPhone: settings.contactPhone,
      terminationDate,
    });

    const smsResult = await solapi.sendMessage({
      to: clientData.phone,
      from: settings.solapiSendPhone,
      text: msg,
      type: settings.useAlimtalk ? "ATA" : undefined,
    });

    await logNotification({
      clientId,
      clientName: clientData.companyName,
      projectId,
      type: "termination_scheduled",
      channel: settings.useAlimtalk ? "alimtalk" : "sms",
      recipientPhone: clientData.phone,
      message: msg,
      status: smsResult.success ? "sent" : "failed",
      errorMessage: smsResult.error ?? null,
    });

    logger.info("terminateProject: done", {
      clientId,
      projectId,
      terminationDate,
    });
    return { success: true };
  }
);

/**
 * Callable: 세금계산서 수동 발행
 */
export const issueTaxInvoice = onCall(
  { region: REGION, secrets: ALL_SECRETS },
  async (request) => {
    requireAdmin(request);

    const { invoiceId, clientId } = request.data as {
      invoiceId?: string;
      clientId?: string;
    };
    if (!invoiceId || !clientId) {
      throw new HttpsError(
        "invalid-argument",
        "invoiceId와 clientId가 필요합니다."
      );
    }

    const db = admin.firestore();

    const invoicesSnap = await db
      .collectionGroup("invoices")
      .where(admin.firestore.FieldPath.documentId(), "==", invoiceId)
      .limit(1)
      .get();

    if (invoicesSnap.empty) {
      throw new HttpsError("not-found", "청구서를 찾을 수 없습니다.");
    }

    const invoiceDoc = invoicesSnap.docs[0];
    const invoice = invoiceDoc.data() as BillingInvoiceDoc;

    if (invoice.status !== "paid") {
      throw new HttpsError(
        "failed-precondition",
        "납부 완료 상태의 청구서만 세금계산서를 발행할 수 있습니다."
      );
    }

    const clientRef = invoiceDoc.ref.parent.parent;
    if (!clientRef) {
      throw new HttpsError("internal", "클라이언트 참조를 찾을 수 없습니다.");
    }

    const [clientSnap, settings] = await Promise.all([
      clientRef.get(),
      loadSettings(),
    ]);

    if (!clientSnap.exists) {
      throw new HttpsError("not-found", "고객 정보를 찾을 수 없습니다.");
    }
    const clientData = clientSnap.data() as BillingClientDoc;

    const popbill = new PopbillClient(
      popbillLinkId.value(),
      popbillSecretKey.value(),
      settings.popbillIsSandbox
    );

    const today = new Date()
      .toLocaleDateString("sv-SE", { timeZone: "Asia/Seoul" })
      .replace(/-/g, "");
    const yearMonthLabel = invoice.yearMonth.replace("-", "년 ") + "월";

    const issueResult = await popbill.registIssue({
      mgtKey: invoiceDoc.id,
      writeDate: today,
      issuer: {
        corpNum: settings.supplierRegNo,
        corpName: settings.supplierName,
        ceoName: settings.supplierCeo,
        addr: "",
        bizType: settings.supplierType,
        bizClass: settings.supplierCategory,
        contactName: settings.supplierName,
        email: "",
      },
      receiver: {
        corpNum: clientData.businessRegNo,
        corpName: clientData.companyName,
        ceoName: clientData.contactName,
        addr: "",
        bizType: clientData.companyType,
        bizClass: clientData.companyCategory,
        contactName: clientData.contactName,
        email: clientData.taxEmail,
      },
      supplyCostTotal: invoice.amount,
      taxTotal: invoice.taxAmount,
      totalAmount: invoice.totalAmount,
      remark1: invoice.projectName,
      items: [
        {
          serialNum: 1,
          purchaseDT: today,
          itemName: `${invoice.projectName} SW 운영관리 서비스 (${yearMonthLabel})`,
          spec: "",
          qty: 1,
          unitCost: invoice.amount,
          supplyCost: invoice.amount,
          tax: invoice.taxAmount,
          remark: invoice.projectName,
        },
      ],
    });

    if (!issueResult.success) {
      logger.error("issueTaxInvoice: popbill failed", {
        invoiceId,
        error: issueResult.errorMessage,
      });
      throw new HttpsError(
        "internal",
        issueResult.errorMessage ?? "세금계산서 발행 실패"
      );
    }

    await invoiceDoc.ref.update({
      taxInvoiceId: issueResult.taxInvoiceId ?? invoiceDoc.id,
      updatedAt: FieldValue.serverTimestamp(),
    });

    logger.info("issueTaxInvoice: done", {
      invoiceId,
      taxInvoiceId: issueResult.taxInvoiceId,
    });
    return { success: true, taxInvoiceId: issueResult.taxInvoiceId };
  }
);
