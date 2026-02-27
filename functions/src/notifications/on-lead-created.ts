import { onDocumentCreated } from "firebase-functions/v2/firestore";
import { defineSecret } from "firebase-functions/params";
import { logger } from "firebase-functions";
import * as admin from "firebase-admin";
import * as nodemailer from "nodemailer";
import { generateAdminNotificationHtml, LeadData } from "./email-templates";

const smtpPass = defineSecret("SMTP_PASS");

/**
 * Firestore onCreate 트리거: 견적 접수 시 관리자 이메일 알림 발송
 * quote-leads 컬렉션에 문서 생성 시 자동 발동
 */
export const onLeadCreated = onDocumentCreated(
  {
    document: "quote-leads/{leadId}",
    region: "asia-northeast3",
    secrets: [smtpPass],
  },
  async (event) => {
    const snapshot = event.data;
    if (!snapshot) return;

    const data = snapshot.data();
    const lead: LeadData = {
      id: event.params.leadId,
      customerName: data.customerName,
      email: data.email,
      phone: data.phone,
      company: data.company,
      projectType: data.projectType,
      projectName: data.projectName,
      projectSummary: data.projectSummary,
      budget: data.budget,
      timeline: data.timeline,
      priority: data.priority || "MEDIUM",
      createdAt: data.createdAt,
    };

    try {
      // Firestore에서 알림 설정 읽기
      const db = admin.firestore();
      const settingsDoc = await db
        .doc("admin-config/notification-settings")
        .get();

      if (!settingsDoc.exists) {
        logger.warn("Notification settings not configured at admin-config/notification-settings");
        return;
      }

      const settings = settingsDoc.data()!;
      const { recipientEmails, smtpHost, smtpPort, smtpUser, smtpFrom } =
        settings;

      if (!recipientEmails?.length) {
        logger.warn("No recipient emails configured");
        return;
      }

      // SMTP 트랜스포터 생성
      const transporter = nodemailer.createTransport({
        host: smtpHost || "smtp.gmail.com",
        port: smtpPort || 587,
        secure: false,
        auth: {
          user: smtpUser,
          pass: smtpPass.value(),
        },
      });

      const isUrgent =
        lead.priority === "URGENT" || lead.priority === "HIGH";
      const subject = isUrgent
        ? `\u{1F6A8} [긴급] 새 견적 접수 - ${lead.customerName}`
        : `[새 견적 접수] ${lead.customerName} - ${lead.projectType}`;

      const html = generateAdminNotificationHtml(lead, isUrgent);

      await transporter.sendMail({
        from: smtpFrom || smtpUser,
        to: recipientEmails.join(","),
        subject,
        html,
      });

      logger.info(`Notification email sent for lead ${lead.id}`);
    } catch (error) {
      logger.error(`Failed to send notification for lead ${lead.id}:`, error);
    }
  }
);
