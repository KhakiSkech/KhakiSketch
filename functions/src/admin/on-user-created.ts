import { auth } from "firebase-functions/v1";
import { logger } from "firebase-functions";
import * as admin from "firebase-admin";

/**
 * Auth onCreate 트리거 (v1)
 * 새 사용자 가입 시 Firestore 화이트리스트를 확인하여 자동으로 admin claim 부여
 */
export const onUserCreated = auth.user().onCreate(async (user) => {
  const email = user.email;
  if (!email) return;

  try {
    const db = admin.firestore();
    const doc = await db.doc("admin-config/allowed-emails").get();

    if (!doc.exists) return;

    const allowedEmails: string[] = doc.data()?.emails || [];

    if (allowedEmails.includes(email)) {
      await admin.auth().setCustomUserClaims(user.uid, { admin: true });
      logger.info(`Auto-granted admin claim to ${email}`);
    }
  } catch (error) {
    logger.error(`Error in onUserCreated for ${email}:`, error);
  }
});
