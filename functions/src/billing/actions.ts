// functions/src/billing/actions.ts
import { onCall, HttpsError } from "firebase-functions/v2/https";
import { defineSecret } from "firebase-functions/params";
import { logger } from "firebase-functions/v2";
import * as admin from "firebase-admin";
import { FieldValue } from "firebase-admin/firestore";
import { SolapiClient } from "./solapi-client";
import { renderMessage } from "./templates";
import type {
  BillingClientDoc,
  BillingInvoiceDoc,
  BillingSettingsDoc,
} from "./types";

const solapiApiKey = defineSecret("SOLAPI_API_KEY");
const solapiApiSecret = defineSecret("SOLAPI_API_SECRET");

const REGION = "asia-northeast3";
const SOLAPI_SECRETS = [solapiApiKey, solapiApiSecret];

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
 * Callable: 수동 입금 확인
 */
export const confirmPayment = onCall(
  { region: REGION, secrets: SOLAPI_SECRETS },
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

    const invoiceRef = db.doc(`billing-clients/${clientId}/invoices/${invoiceId}`);
    const invoiceSnap = await invoiceRef.get();

    if (!invoiceSnap.exists) {
      throw new HttpsError("not-found", "청구서를 찾을 수 없습니다.");
    }

    const invoice = invoiceSnap.data() as BillingInvoiceDoc;

    if (invoice.status === "paid" || invoice.status === "waived") {
      throw new HttpsError(
        "failed-precondition",
        `이미 ${invoice.status} 상태입니다.`
      );
    }

    const confirmedBy = request.auth?.uid ?? "unknown";

    await invoiceRef.update({
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
  { region: REGION, secrets: SOLAPI_SECRETS },
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

    const invoiceRef = db.doc(`billing-clients/${clientId}/invoices/${invoiceId}`);
    const invoiceSnap = await invoiceRef.get();

    if (!invoiceSnap.exists) {
      throw new HttpsError("not-found", "청구서를 찾을 수 없습니다.");
    }

    const invoice = invoiceSnap.data() as BillingInvoiceDoc;

    if (invoice.status === "paid") {
      throw new HttpsError("failed-precondition", "이미 납부 완료 상태입니다.");
    }

    await invoiceRef.update({
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
  { region: REGION, secrets: SOLAPI_SECRETS },
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
  { region: REGION, secrets: SOLAPI_SECRETS },
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
