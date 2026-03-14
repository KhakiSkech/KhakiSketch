// functions/src/billing/webhooks.ts
import { onRequest } from "firebase-functions/v2/https";
import { defineSecret } from "firebase-functions/params";
import { logger } from "firebase-functions/v2";
import * as admin from "firebase-admin";
import { FieldValue } from "firebase-admin/firestore";
import { SolapiClient } from "./solapi-client";
import { PopbillClient } from "./popbill-client";
import { renderMessage, formatAmount } from "./templates";
import type {
  BillingClientDoc,
  BillingInvoiceDoc,
  BillingSettingsDoc,
} from "./types";

const solapiApiKey = defineSecret("SOLAPI_API_KEY");
const solapiApiSecret = defineSecret("SOLAPI_API_SECRET");
const popbillLinkId = defineSecret("POPBILL_LINK_ID");
const popbillSecretKey = defineSecret("POPBILL_SECRET_KEY");

const REGION = "asia-northeast3";

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
 * HTTP: 페이플 결제 결과 웹훅 수신
 * POST /paypleWebhook
 */
export const paypleWebhook = onRequest(
  {
    region: REGION,
    secrets: [solapiApiKey, solapiApiSecret, popbillLinkId, popbillSecretKey],
  },
  async (req, res) => {
    if (req.method !== "POST") {
      res.status(405).json({ error: "Method Not Allowed" });
      return;
    }

    const body = req.body as Record<string, unknown>;
    const orderId =
      typeof body.PCD_ORDER_KEY === "string" ? body.PCD_ORDER_KEY : undefined;
    const paymentId =
      typeof body.PCD_PAY_OID === "string" ? body.PCD_PAY_OID : undefined;
    const resultCode =
      typeof body.PCD_PAY_RST === "string" ? body.PCD_PAY_RST : undefined;
    const errorMessage =
      typeof body.PCD_PAY_MSG === "string" ? body.PCD_PAY_MSG : undefined;

    if (!orderId) {
      logger.warn("paypleWebhook: missing PCD_ORDER_KEY", { body });
      res.status(400).json({ error: "Missing orderId" });
      return;
    }

    const db = admin.firestore();

    // orderId 형식: {projectId}_{yearMonth} — billing-clients 하위 invoice 탐색
    const invoicesSnap = await db
      .collectionGroup("invoices")
      .where(admin.firestore.FieldPath.documentId(), "==", orderId)
      .limit(1)
      .get();

    if (invoicesSnap.empty) {
      logger.warn("paypleWebhook: invoice not found", { orderId });
      // 로그만 남기고 200 응답 (재전송 방지)
      await db.collection("billing-notification-logs").add({
        clientId: "unknown",
        clientName: "unknown",
        projectId: null,
        type: "billing_failed",
        channel: "sms",
        recipientPhone: "unknown",
        message: `웹훅 수신: orderId=${orderId} invoice not found`,
        status: "failed",
        errorMessage: "invoice not found",
        sentAt: FieldValue.serverTimestamp(),
      });
      res.status(200).json({ ok: true });
      return;
    }

    const invoiceDoc = invoicesSnap.docs[0];
    const invoice = invoiceDoc.data() as BillingInvoiceDoc;
    const invoiceRef = invoiceDoc.ref;

    const clientRef = invoiceRef.parent.parent;
    if (!clientRef) {
      logger.error("paypleWebhook: cannot resolve clientRef", { orderId });
      res.status(200).json({ ok: true });
      return;
    }

    const [clientSnap, settingsSnap] = await Promise.all([
      clientRef.get(),
      db.doc("billing-settings/default").get(),
    ]);

    if (!clientSnap.exists || !settingsSnap.exists) {
      logger.error("paypleWebhook: client or settings not found", { orderId });
      res.status(200).json({ ok: true });
      return;
    }

    const clientData = clientSnap.data() as BillingClientDoc;
    const settings = settingsSnap.data() as BillingSettingsDoc;

    const isSuccess = resultCode === "success";
    const month = invoice.yearMonth.split("-")[1].replace(/^0/, "");

    if (isSuccess) {
      await invoiceRef.update({
        status: "paid",
        payplePaymentId: paymentId ?? null,
        paidAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp(),
      });

      // 출금 성공 SMS
      const solapi = new SolapiClient(
        solapiApiKey.value(),
        solapiApiSecret.value()
      );
      const successMsg = renderMessage("billing_success", {
        contactName: clientData.contactName,
        projectName: invoice.projectName,
        totalAmount: formatAmount(invoice.totalAmount),
        billingDate: "",
        month,
        bankInfo: "",
        taxEmail: clientData.taxEmail,
        contactPhone: settings.contactPhone,
      });
      const smsResult = await solapi.sendMessage({
        to: clientData.phone,
        from: settings.solapiSendPhone,
        text: successMsg,
        type: settings.useAlimtalk ? "ATA" : undefined,
      });

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
          const popbill = new PopbillClient(
            popbillLinkId.value(),
            popbillSecretKey.value(),
            settings.popbillIsSandbox
          );
          const today = new Date()
            .toLocaleDateString("sv-SE", { timeZone: "Asia/Seoul" })
            .replace(/-/g, "");
          const yearMonthLabel =
            invoice.yearMonth.replace("-", "년 ") + "월";

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

          if (issueResult.success) {
            await invoiceRef.update({
              taxInvoiceId: issueResult.taxInvoiceId ?? invoiceDoc.id,
              updatedAt: FieldValue.serverTimestamp(),
            });
          } else {
            logger.error("paypleWebhook: tax invoice failed", {
              error: issueResult.errorMessage,
            });
          }
        } catch (err) {
          logger.error("paypleWebhook: tax invoice error", {
            error: String(err),
          });
        }
      }

      logger.info("paypleWebhook: payment success", { orderId, paymentId });
    } else {
      await invoiceRef.update({
        status: "failed",
        lastError: errorMessage ?? "웹훅 실패 응답",
        updatedAt: FieldValue.serverTimestamp(),
      });

      await logNotification({
        clientId: clientRef.id,
        clientName: clientData.companyName,
        projectId: invoice.projectId,
        type: "billing_failed",
        channel: "sms",
        recipientPhone: clientData.phone,
        message: `웹훅 결제 실패: ${orderId} - ${errorMessage ?? "unknown"}`,
        status: "failed",
        errorMessage: errorMessage ?? null,
      });

      logger.warn("paypleWebhook: payment failed", {
        orderId,
        resultCode,
        errorMessage,
      });
    }

    res.status(200).json({ ok: true });
  }
);
