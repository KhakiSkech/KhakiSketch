// functions/src/billing/scheduler.ts
import { onSchedule } from "firebase-functions/v2/scheduler";
import { defineSecret } from "firebase-functions/params";
import { logger } from "firebase-functions/v2";
import * as admin from "firebase-admin";
import { FieldValue } from "firebase-admin/firestore";
import { SolapiClient } from "./solapi-client";
import { PaypleClient } from "./payple-client";
import { PopbillClient } from "./popbill-client";
import { renderMessage, formatAmount } from "./templates";
import type {
  BillingClientDoc,
  BillingProjectDoc,
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
const SECRETS = [
  solapiApiKey,
  solapiApiSecret,
  paypleClientId,
  paypleClientSecret,
  popbillLinkId,
  popbillSecretKey,
];

// Seoul 현재 날짜를 YYYY-MM-DD 반환
function getSeoulDateString(): string {
  return new Date().toLocaleDateString("sv-SE", { timeZone: "Asia/Seoul" });
}

// KST 기준 Date 객체 반환 (UTC+9 오프셋 적용)
function getSeoulDate(): Date {
  const now = new Date();
  const kstOffset = 9 * 60 * 60 * 1000;
  return new Date(now.getTime() + kstOffset);
}

// Seoul 현재 일(day) 반환
function getSeoulDay(): number {
  return getSeoulDate().getUTCDate();
}

// Seoul 기준 YYYY-MM yearMonth 반환
function getSeoulYearMonth(): string {
  const kst = getSeoulDate();
  const year = kst.getUTCFullYear();
  const month = String(kst.getUTCMonth() + 1).padStart(2, "0");
  return `${year}-${month}`;
}

// N일 후 Seoul 기준 day 반환
function getSeoulDayAfter(days: number): number {
  const kst = getSeoulDate();
  kst.setUTCDate(kst.getUTCDate() + days);
  return kst.getUTCDate();
}

// 두 날짜 사이의 일수 차이 (Seoul 기준)
function daysBetween(from: Date, to: string): number {
  const toDate = new Date(to + "T00:00:00+09:00");
  const diffMs = toDate.getTime() - from.getTime();
  return Math.floor(diffMs / (1000 * 60 * 60 * 24));
}

async function loadSettings(): Promise<BillingSettingsDoc> {
  const db = admin.firestore();
  const snap = await db.doc("billing-settings/default").get();
  if (!snap.exists) {
    throw new Error("billing-settings/default not found");
  }
  return snap.data() as BillingSettingsDoc;
}

async function logNotification(
  params: {
    clientId: string;
    clientName: string;
    projectId: string | null;
    type: string;
    channel: "sms" | "alimtalk";
    recipientPhone: string;
    message: string;
    status: "sent" | "failed";
    errorMessage: string | null;
  }
): Promise<void> {
  const db = admin.firestore();
  await db.collection("billing-notification-logs").add({
    ...params,
    sentAt: FieldValue.serverTimestamp(),
  });
}

async function sendSms(
  solapi: SolapiClient,
  from: string,
  to: string,
  text: string,
  useAlimtalk: boolean
): Promise<{ success: boolean; error?: string }> {
  const type = useAlimtalk ? "ATA" : undefined;
  const result = await solapi.sendMessage({ to, from, text, type });
  return result;
}

async function issueTaxInvoiceForInvoice(
  popbill: PopbillClient,
  solapi: SolapiClient,
  settings: BillingSettingsDoc,
  invoiceRef: FirebaseFirestore.DocumentReference,
  invoice: BillingInvoiceDoc,
  clientData: BillingClientDoc
): Promise<void> {
  const today = getSeoulDateString().replace(/-/g, "");
  const yearMonthLabel = invoice.yearMonth.replace("-", "년 ") + "월";
  const itemName = `${invoice.projectName} SW 운영관리 서비스 (${yearMonthLabel})`;

  // 사업자 → 세금계산서, 개인 → 현금영수증
  const isIndividual = clientData.clientType === "individual";

  let issueResult: { success: boolean; taxInvoiceId?: string; cashBillId?: string; errorMessage?: string };

  if (isIndividual) {
    // 개인 고객: 현금영수증 발행
    const cbResult = await popbill.issueCashBill({
      mgtKey: invoiceRef.id,
      tradeDate: today,
      supplyCost: invoice.amount,
      tax: invoice.taxAmount,
      totalAmount: invoice.totalAmount,
      identityNum: clientData.phone.replace(/-/g, ""),
      itemName,
      customerName: clientData.contactName,
      customerEmail: clientData.taxEmail || clientData.email,
      corpNum: settings.supplierRegNo,
    });
    issueResult = {
      success: cbResult.success,
      taxInvoiceId: cbResult.cashBillId,
      errorMessage: cbResult.errorMessage,
    };
  } else {
    // 사업자 고객: 세금계산서 발행
    const tiResult = await popbill.registIssue({
      mgtKey: invoiceRef.id,
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
          itemName,
          spec: "",
          qty: 1,
          unitCost: invoice.amount,
          supplyCost: invoice.amount,
          tax: invoice.taxAmount,
          remark: invoice.projectName,
        },
      ],
    });
    issueResult = {
      success: tiResult.success,
      taxInvoiceId: tiResult.taxInvoiceId,
      errorMessage: tiResult.errorMessage,
    };
  }

  if (issueResult.success) {
    await invoiceRef.update({
      taxInvoiceId: issueResult.taxInvoiceId ?? invoiceRef.id,
      updatedAt: FieldValue.serverTimestamp(),
    });
  } else {
    const docType = isIndividual ? "현금영수증" : "세금계산서";
    logger.error(`${docType} issue failed`, {
      invoiceId: invoiceRef.id,
      error: issueResult.errorMessage,
    });
    // 관리자 SMS 알림
    const adminMsg = `[KSI] ${docType} 발행 실패: ${invoice.projectName} ${invoice.yearMonth} - ${issueResult.errorMessage ?? "오류"}. 수동 발행 필요.`;
    await solapi.sendMessage({
      to: settings.solapiSendPhone,
      from: settings.solapiSendPhone,
      text: adminMsg,
    });
  }
}

// Step 1: 오늘 결제일인 active 프로젝트의 invoice 생성
async function generateInvoices(settings: BillingSettingsDoc): Promise<void> {
  const db = admin.firestore();
  const todayDay = getSeoulDay();
  const yearMonth = getSeoulYearMonth();

  const projectsSnap = await db
    .collectionGroup("projects")
    .where("status", "==", "active")
    .where("billingDay", "==", todayDay)
    .get();

  if (projectsSnap.empty) {
    logger.info("generateInvoices: no projects due today", { todayDay });
    return;
  }

  const BATCH_LIMIT = 500;
  let batch = db.batch();
  let batchCount = 0;
  let count = 0;

  for (const projectDoc of projectsSnap.docs) {
    const project = projectDoc.data() as BillingProjectDoc;
    // parent path: billing-clients/{clientId}/projects/{projectId}
    const clientRef = projectDoc.ref.parent.parent;
    if (!clientRef) continue;

    const clientId = clientRef.id;
    const projectId = projectDoc.id;
    const invoiceId = `${projectId}_${yearMonth}`;
    const invoiceRef = db.doc(
      `billing-clients/${clientId}/invoices/${invoiceId}`
    );

    const amount = project.monthlyFee;
    const taxAmount = Math.round(amount * 0.1);

    const clientSnap = await clientRef.get();
    const clientName = clientSnap.exists
      ? ((clientSnap.data() as BillingClientDoc).companyName || clientId)
      : clientId;

    batch.set(
      invoiceRef,
      {
        clientId,
        clientName,
        projectId,
        projectName: project.name,
        yearMonth,
        amount,
        taxAmount,
        totalAmount: amount + taxAmount,
        status: "pending",
        daysOverdue: 0,
        payplePaymentId: null,
        taxInvoiceId: null,
        paidAt: null,
        confirmedBy: null,
        firstNoticeSent: false,
        secondNoticeSent: false,
        retryCount: 0,
        lastError: null,
        createdAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp(),
      },
      { merge: false }
    );
    count++;
    batchCount++;

    if (batchCount >= BATCH_LIMIT) {
      await batch.commit();
      batch = db.batch();
      batchCount = 0;
    }
  }

  if (batchCount > 0) await batch.commit();
  logger.info("generateInvoices: done", { count, yearMonth, todayDay });
}

// Step 2: pending invoice + 빌링키 → 페이플 출금
async function requestCmsPayments(
  payple: PaypleClient,
  popbill: PopbillClient,
  solapi: SolapiClient,
  settings: BillingSettingsDoc
): Promise<void> {
  const db = admin.firestore();

  const invoicesSnap = await db
    .collectionGroup("invoices")
    .where("status", "==", "pending")
    .get();

  if (invoicesSnap.empty) {
    logger.info("requestCmsPayments: no pending invoices");
    return;
  }

  const month = getSeoulYearMonth().split("-")[1].replace(/^0/, "");

  for (const invoiceDoc of invoicesSnap.docs) {
    const invoice = invoiceDoc.data() as BillingInvoiceDoc;
    const invoiceRef = invoiceDoc.ref;

    // 이중 출금 방지
    if (invoice.payplePaymentId) {
      logger.info("requestCmsPayments: skip (already has paymentId)", {
        invoiceId: invoiceDoc.id,
      });
      continue;
    }

    const clientRef = invoiceRef.parent.parent;
    if (!clientRef) continue;

    const clientSnap = await clientRef.get();
    if (!clientSnap.exists) continue;
    const clientData = clientSnap.data() as BillingClientDoc;

    if (clientData.paypleBillingKey) {
      // CMS 자동 출금 시도
      const payResult = await payple.requestBillingPay({
        billingKey: clientData.paypleBillingKey,
        amount: invoice.totalAmount,
        orderId: `${clientRef.id}/${invoiceDoc.id}`,
        productName: `${invoice.projectName} ${invoice.yearMonth} 운영관리비`,
        buyerName: clientData.contactName,
        buyerEmail: clientData.email,
        buyerPhone: clientData.phone,
      });

      if (payResult.success) {
        await invoiceRef.update({
          status: "paid",
          payplePaymentId: payResult.paymentId ?? null,
          paidAt: FieldValue.serverTimestamp(),
          updatedAt: FieldValue.serverTimestamp(),
        });

        // 출금 성공 SMS
        const successMsg = renderMessage("billing_success", {
          contactName: clientData.contactName,
          projectName: invoice.projectName,
          totalAmount: formatAmount(invoice.totalAmount),
          billingDate: "",
          month,
          bankInfo: `${settings.bankName} ${settings.bankAccount} (${settings.bankHolder})`,
          taxEmail: clientData.taxEmail,
          contactPhone: settings.contactPhone,
        });
        const smsResult = await sendSms(
          solapi,
          settings.solapiSendPhone,
          clientData.phone,
          successMsg,
          settings.useAlimtalk
        );
        await logNotification({
          clientId: clientRef.id,
          clientName: clientData.companyName,
          projectId: invoice.projectId,
          type: "billing_success",
          channel: settings.useAlimtalk ? "alimtalk" : "sms",
          recipientPhone: clientData.phone,
          message: successMsg,
          status: smsResult.success ? "sent" : "failed",
          errorMessage: smsResult.error ?? null,
        });

        // 세금계산서 자동 발행
        if (settings.autoIssueTaxInvoice) {
          try {
            await issueTaxInvoiceForInvoice(
              popbill,
              solapi,
              settings,
              invoiceRef,
              invoice,
              clientData
            );
          } catch (err) {
            logger.error("Tax invoice issue error", { error: String(err) });
          }
        }
      } else {
        await invoiceRef.update({
          status: "failed",
          lastError: payResult.errorMessage ?? "출금 실패",
          updatedAt: FieldValue.serverTimestamp(),
        });

        // 출금 실패 SMS
        const failMsg = renderMessage("billing_failed", {
          contactName: clientData.contactName,
          projectName: invoice.projectName,
          totalAmount: formatAmount(invoice.totalAmount),
          billingDate: "",
          month,
          bankInfo: "",
          taxEmail: clientData.taxEmail,
          contactPhone: settings.contactPhone,
        });
        const smsResult = await sendSms(
          solapi,
          settings.solapiSendPhone,
          clientData.phone,
          failMsg,
          settings.useAlimtalk
        );
        await logNotification({
          clientId: clientRef.id,
          clientName: clientData.companyName,
          projectId: invoice.projectId,
          type: "billing_failed",
          channel: settings.useAlimtalk ? "alimtalk" : "sms",
          recipientPhone: clientData.phone,
          message: failMsg,
          status: smsResult.success ? "sent" : "failed",
          errorMessage: smsResult.error ?? null,
        });
      }
    } else {
      // 빌링키 없음 → 수동 이체 안내
      const guideMsg = renderMessage("manual_transfer_guide", {
        contactName: clientData.contactName,
        projectName: invoice.projectName,
        totalAmount: formatAmount(invoice.totalAmount),
        billingDate: "",
        month,
        bankInfo: `${settings.bankName} ${settings.bankAccount} (${settings.bankHolder})`,
        taxEmail: clientData.taxEmail,
        contactPhone: settings.contactPhone,
      });
      const smsResult = await sendSms(
        solapi,
        settings.solapiSendPhone,
        clientData.phone,
        guideMsg,
        settings.useAlimtalk
      );
      await logNotification({
        clientId: clientRef.id,
        clientName: clientData.companyName,
        projectId: invoice.projectId,
        type: "billing_failed",
        channel: settings.useAlimtalk ? "alimtalk" : "sms",
        recipientPhone: clientData.phone,
        message: guideMsg,
        status: smsResult.success ? "sent" : "failed",
        errorMessage: smsResult.error ?? null,
      });
    }
  }

  logger.info("requestCmsPayments: done", {
    total: invoicesSnap.size,
  });
}

// Step 3: N일 후 결제일인 프로젝트 → 사전 안내 SMS
async function sendPreReminders(
  solapi: SolapiClient,
  settings: BillingSettingsDoc
): Promise<void> {
  const db = admin.firestore();
  const reminderDay = getSeoulDayAfter(settings.reminderDaysBefore);

  const projectsSnap = await db
    .collectionGroup("projects")
    .where("status", "==", "active")
    .where("billingDay", "==", reminderDay)
    .get();

  if (projectsSnap.empty) {
    logger.info("sendPreReminders: no projects", { reminderDay });
    return;
  }

  const seoulNow = new Date(
    new Date().toLocaleString("en-US", { timeZone: "Asia/Seoul" })
  );
  const reminderDateStr = new Date(seoulNow);
  reminderDateStr.setDate(reminderDateStr.getDate() + settings.reminderDaysBefore);
  const billingMonth = reminderDateStr.getMonth() + 1;
  const billingDayNum = reminderDateStr.getDate();
  const billingDate = `${billingMonth}월 ${billingDayNum}일`;

  for (const projectDoc of projectsSnap.docs) {
    const project = projectDoc.data() as BillingProjectDoc;
    const clientRef = projectDoc.ref.parent.parent;
    if (!clientRef) continue;

    const clientSnap = await clientRef.get();
    if (!clientSnap.exists) continue;
    const clientData = clientSnap.data() as BillingClientDoc;

    const taxAmount = Math.round(project.monthlyFee * 0.1);
    const totalAmount = project.monthlyFee + taxAmount;

    const msg = renderMessage("pre_reminder", {
      contactName: clientData.contactName,
      projectName: project.name,
      totalAmount: formatAmount(totalAmount),
      billingDate,
      month: String(billingMonth),
      bankInfo: "",
      taxEmail: clientData.taxEmail,
      contactPhone: settings.contactPhone,
    });

    const smsResult = await sendSms(
      solapi,
      settings.solapiSendPhone,
      clientData.phone,
      msg,
      settings.useAlimtalk
    );

    await logNotification({
      clientId: clientRef.id,
      clientName: clientData.companyName,
      projectId: projectDoc.id,
      type: "pre_reminder",
      channel: settings.useAlimtalk ? "alimtalk" : "sms",
      recipientPhone: clientData.phone,
      message: msg,
      status: smsResult.success ? "sent" : "failed",
      errorMessage: smsResult.error ?? null,
    });
  }

  logger.info("sendPreReminders: done", { total: projectsSnap.size });
}

// Step 4: 미납 갱신 + 독촉 + CMS 재시도
async function updateOverdueAndNotify(
  payple: PaypleClient,
  popbill: PopbillClient,
  solapi: SolapiClient,
  settings: BillingSettingsDoc
): Promise<void> {
  const db = admin.firestore();
  const todayStr = getSeoulDateString();

  const invoicesSnap = await db
    .collectionGroup("invoices")
    .where("status", "in", ["pending", "failed"])
    .get();

  if (invoicesSnap.empty) {
    logger.info("updateOverdueAndNotify: no overdue invoices");
    return;
  }

  const month = getSeoulYearMonth().split("-")[1].replace(/^0/, "");

  for (const invoiceDoc of invoicesSnap.docs) {
    const invoice = invoiceDoc.data() as BillingInvoiceDoc;
    const invoiceRef = invoiceDoc.ref;

    // createdAt이 오늘인 경우 건너뜀 (오늘 새로 생성된 invoice)
    const createdAtDate = invoice.createdAt.toDate();
    const createdStr = createdAtDate
      .toLocaleDateString("sv-SE", { timeZone: "Asia/Seoul" });
    if (createdStr >= todayStr) continue;

    const daysOverdue = Math.max(
      0,
      daysBetween(
        new Date(createdStr + "T00:00:00+09:00"),
        todayStr
      )
    );

    await invoiceRef.update({
      daysOverdue,
      status: daysOverdue > 0 ? "overdue" : invoice.status,
      updatedAt: FieldValue.serverTimestamp(),
    });

    const clientRef = invoiceRef.parent.parent;
    if (!clientRef) continue;

    const clientSnap = await clientRef.get();
    if (!clientSnap.exists) continue;
    const clientData = clientSnap.data() as BillingClientDoc;

    // 1차 독촉 + CMS 재시도
    if (
      daysOverdue >= settings.firstNoticeDaysAfter &&
      !invoice.firstNoticeSent
    ) {
      const msg = renderMessage("overdue_1st", {
        contactName: clientData.contactName,
        projectName: invoice.projectName,
        totalAmount: formatAmount(invoice.totalAmount),
        billingDate: "",
        month,
        bankInfo: "",
        taxEmail: clientData.taxEmail,
        contactPhone: settings.contactPhone,
      });
      const smsResult = await sendSms(
        solapi,
        settings.solapiSendPhone,
        clientData.phone,
        msg,
        settings.useAlimtalk
      );
      await logNotification({
        clientId: clientRef.id,
        clientName: clientData.companyName,
        projectId: invoice.projectId,
        type: "overdue_1st",
        channel: settings.useAlimtalk ? "alimtalk" : "sms",
        recipientPhone: clientData.phone,
        message: msg,
        status: smsResult.success ? "sent" : "failed",
        errorMessage: smsResult.error ?? null,
      });

      // CMS 재시도
      if (
        clientData.paypleBillingKey &&
        invoice.retryCount < settings.maxRetryCount
      ) {
        const payResult = await payple.requestBillingPay({
          billingKey: clientData.paypleBillingKey,
          amount: invoice.totalAmount,
          orderId: `${clientRef.id}/${invoiceDoc.id}`,
          productName: `${invoice.projectName} ${invoice.yearMonth} 운영관리비`,
          buyerName: clientData.contactName,
          buyerEmail: clientData.email,
          buyerPhone: clientData.phone,
        });

        if (payResult.success) {
          await invoiceRef.update({
            status: "paid",
            payplePaymentId: payResult.paymentId ?? null,
            paidAt: FieldValue.serverTimestamp(),
            firstNoticeSent: true,
            retryCount: invoice.retryCount + 1,
            updatedAt: FieldValue.serverTimestamp(),
          });

          if (settings.autoIssueTaxInvoice) {
            try {
              const updatedInvoice = {
                ...invoice,
                status: "paid" as const,
              };
              await issueTaxInvoiceForInvoice(
                popbill,
                solapi,
                settings,
                invoiceRef,
                updatedInvoice,
                clientData
              );
            } catch (err) {
              logger.error("Tax invoice issue error on retry", {
                error: String(err),
              });
            }
          }
          continue;
        } else {
          await invoiceRef.update({
            retryCount: invoice.retryCount + 1,
            lastError: payResult.errorMessage ?? "재시도 실패",
            firstNoticeSent: true,
            updatedAt: FieldValue.serverTimestamp(),
          });
        }
      } else {
        await invoiceRef.update({
          firstNoticeSent: true,
          updatedAt: FieldValue.serverTimestamp(),
        });
      }
    }

    // 2차 독촉
    if (
      daysOverdue >= settings.secondNoticeDaysAfter &&
      !invoice.secondNoticeSent
    ) {
      const msg = renderMessage("overdue_2nd", {
        contactName: clientData.contactName,
        projectName: invoice.projectName,
        totalAmount: formatAmount(invoice.totalAmount),
        billingDate: "",
        month,
        bankInfo: "",
        taxEmail: clientData.taxEmail,
        contactPhone: settings.contactPhone,
      });
      const smsResult = await sendSms(
        solapi,
        settings.solapiSendPhone,
        clientData.phone,
        msg,
        settings.useAlimtalk
      );
      await logNotification({
        clientId: clientRef.id,
        clientName: clientData.companyName,
        projectId: invoice.projectId,
        type: "overdue_2nd",
        channel: settings.useAlimtalk ? "alimtalk" : "sms",
        recipientPhone: clientData.phone,
        message: msg,
        status: smsResult.success ? "sent" : "failed",
        errorMessage: smsResult.error ?? null,
      });
      await invoiceRef.update({
        secondNoticeSent: true,
        updatedAt: FieldValue.serverTimestamp(),
      });
    }

    // 관리자 심각 알림 (D+7+, 고객별 1회 — daysOverdue가 정확히 7일 때)
    if (daysOverdue >= 7 && daysOverdue < 8) {
      const adminMsg = `[KSI 미납 심각] ${clientData.companyName} / ${invoice.projectName} / ${invoice.yearMonth} / ${formatAmount(invoice.totalAmount)}원 / D+${daysOverdue}`;
      const smsResult = await sendSms(
        solapi,
        settings.solapiSendPhone,
        settings.solapiSendPhone,
        adminMsg,
        false
      );
      await logNotification({
        clientId: clientRef.id,
        clientName: clientData.companyName,
        projectId: invoice.projectId,
        type: "overdue_severe",
        channel: "sms",
        recipientPhone: settings.solapiSendPhone,
        message: adminMsg,
        status: smsResult.success ? "sent" : "failed",
        errorMessage: smsResult.error ?? null,
      });
    }
  }

  logger.info("updateOverdueAndNotify: done", { total: invoicesSnap.size });
}

// Step 5: 해지 예정일 도래 프로젝트 → terminated 전환 + SMS
async function processTerminations(
  solapi: SolapiClient,
  settings: BillingSettingsDoc
): Promise<void> {
  const db = admin.firestore();
  const todayStr = getSeoulDateString();

  const projectsSnap = await db
    .collectionGroup("projects")
    .where("status", "==", "terminating")
    .get();

  if (projectsSnap.empty) {
    logger.info("processTerminations: no terminating projects");
    return;
  }

  for (const projectDoc of projectsSnap.docs) {
    const project = projectDoc.data() as BillingProjectDoc;

    if (!project.terminationDate || project.terminationDate > todayStr) {
      continue;
    }

    await projectDoc.ref.update({
      status: "terminated",
      updatedAt: FieldValue.serverTimestamp(),
    });

    const clientRef = projectDoc.ref.parent.parent;
    if (!clientRef) continue;

    const clientSnap = await clientRef.get();
    if (!clientSnap.exists) continue;
    const clientData = clientSnap.data() as BillingClientDoc;

    const msg = renderMessage("termination_complete", {
      contactName: clientData.contactName,
      projectName: project.name,
      totalAmount: "",
      billingDate: "",
      month: "",
      bankInfo: "",
      taxEmail: clientData.taxEmail,
      contactPhone: settings.contactPhone,
    });

    const smsResult = await sendSms(
      solapi,
      settings.solapiSendPhone,
      clientData.phone,
      msg,
      settings.useAlimtalk
    );

    await logNotification({
      clientId: clientRef.id,
      clientName: clientData.companyName,
      projectId: projectDoc.id,
      type: "termination_complete",
      channel: settings.useAlimtalk ? "alimtalk" : "sms",
      recipientPhone: clientData.phone,
      message: msg,
      status: smsResult.success ? "sent" : "failed",
      errorMessage: smsResult.error ?? null,
    });

    logger.info("processTerminations: terminated", {
      projectId: projectDoc.id,
      clientId: clientRef.id,
    });
  }
}

/**
 * 매일 09:00 KST (00:00 UTC) — 메인 과금 스케줄러
 */
export const billingDailyCycle = onSchedule(
  {
    schedule: "0 0 * * *",
    timeZone: "UTC",
    region: REGION,
    secrets: SECRETS,
  },
  async () => {
    logger.info("billingDailyCycle: start");

    let settings: BillingSettingsDoc;
    try {
      settings = await loadSettings();
    } catch (err) {
      logger.error("billingDailyCycle: failed to load settings", {
        error: String(err),
      });
      return;
    }

    const solapi = new SolapiClient(
      solapiApiKey.value(),
      solapiApiSecret.value()
    );
    const payple = new PaypleClient(
      paypleClientId.value(),
      paypleClientSecret.value(),
      settings.paypleIsSandbox
    );
    const popbill = new PopbillClient(
      popbillLinkId.value(),
      popbillSecretKey.value(),
      settings.popbillIsSandbox
    );

    // Step 1
    try {
      await generateInvoices(settings);
    } catch (err) {
      logger.error("billingDailyCycle step1 generateInvoices failed", {
        error: String(err),
      });
    }

    // Step 2
    try {
      await requestCmsPayments(payple, popbill, solapi, settings);
    } catch (err) {
      logger.error("billingDailyCycle step2 requestCmsPayments failed", {
        error: String(err),
      });
    }

    // Step 3
    try {
      await sendPreReminders(solapi, settings);
    } catch (err) {
      logger.error("billingDailyCycle step3 sendPreReminders failed", {
        error: String(err),
      });
    }

    // Step 4
    try {
      await updateOverdueAndNotify(payple, popbill, solapi, settings);
    } catch (err) {
      logger.error("billingDailyCycle step4 updateOverdueAndNotify failed", {
        error: String(err),
      });
    }

    // Step 5
    try {
      await processTerminations(solapi, settings);
    } catch (err) {
      logger.error("billingDailyCycle step5 processTerminations failed", {
        error: String(err),
      });
    }

    logger.info("billingDailyCycle: complete");
  }
);

/**
 * 매일 09:30 KST (00:30 UTC) — 관리자 일일 요약 SMS
 */
export const sendAdminDailySummary = onSchedule(
  {
    schedule: "30 0 * * *",
    timeZone: "UTC",
    region: REGION,
    secrets: SECRETS,
  },
  async () => {
    logger.info("sendAdminDailySummary: start");

    let settings: BillingSettingsDoc;
    try {
      settings = await loadSettings();
    } catch (err) {
      logger.error("sendAdminDailySummary: failed to load settings", {
        error: String(err),
      });
      return;
    }

    const solapi = new SolapiClient(
      solapiApiKey.value(),
      solapiApiSecret.value()
    );

    const db = admin.firestore();
    const todayStr = getSeoulDateString();
    const yearMonth = getSeoulYearMonth();

    try {
      // 오늘 수금 집계
      const paidSnap = await db
        .collectionGroup("invoices")
        .where("status", "==", "paid")
        .where("yearMonth", "==", yearMonth)
        .get();

      let paidCount = 0;
      let paidAmount = 0;
      for (const doc of paidSnap.docs) {
        const inv = doc.data() as BillingInvoiceDoc;
        const paidAt = inv.paidAt?.toDate();
        if (
          paidAt &&
          paidAt.toLocaleDateString("sv-SE", { timeZone: "Asia/Seoul" }) ===
            todayStr
        ) {
          paidCount++;
          paidAmount += inv.totalAmount;
        }
      }

      // 미납 집계
      const overdueSnap = await db
        .collectionGroup("invoices")
        .where("status", "in", ["pending", "failed", "overdue"])
        .get();

      let overdueCount = 0;
      let overdueAmount = 0;
      const overdueLines: string[] = [];
      for (const doc of overdueSnap.docs) {
        const inv = doc.data() as BillingInvoiceDoc;
        overdueCount++;
        overdueAmount += inv.totalAmount;
        overdueLines.push(
          `${inv.projectName} ${formatAmount(inv.totalAmount)}원 D+${inv.daysOverdue}`
        );
      }

      const summaryMsg = renderMessage("admin_daily_summary", {
        contactName: "",
        projectName: "",
        totalAmount: "",
        billingDate: "",
        month: "",
        bankInfo: "",
        taxEmail: "",
        contactPhone: "",
        date: todayStr,
        paidCount: String(paidCount),
        paidAmount: formatAmount(paidAmount),
        overdueCount: String(overdueCount),
        overdueAmount: formatAmount(overdueAmount),
        overdueList: overdueLines.join("\n"),
      });

      await solapi.sendMessage({
        to: settings.solapiSendPhone,
        from: settings.solapiSendPhone,
        text: summaryMsg,
      });

      logger.info("sendAdminDailySummary: sent", {
        paidCount,
        overdueCount,
      });
    } catch (err) {
      logger.error("sendAdminDailySummary failed", { error: String(err) });
    }
  }
);
