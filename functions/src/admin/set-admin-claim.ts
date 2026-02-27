import { onCall, HttpsError } from "firebase-functions/v2/https";
import * as admin from "firebase-admin";

/**
 * Callable Function: 관리자 Custom Claim 설정/해제
 *
 * 호출자가 admin claim을 가져야 사용 가능.
 * 부트스트랩: 최초 관리자는 Firebase Console 또는 Admin SDK 스크립트로 설정.
 *   admin.auth().setCustomUserClaims(uid, { admin: true })
 */
export const setAdminClaim = onCall(
  { region: "asia-northeast3" },
  async (request) => {
    // 호출자 인증 확인
    if (!request.auth) {
      throw new HttpsError("unauthenticated", "인증이 필요합니다.");
    }

    // 호출자가 관리자인지 확인
    if (request.auth.token.admin !== true) {
      throw new HttpsError("permission-denied", "관리자 권한이 필요합니다.");
    }

    const { email, isAdmin } = request.data as {
      email?: string;
      isAdmin?: boolean;
    };

    if (!email || typeof isAdmin !== "boolean") {
      throw new HttpsError(
        "invalid-argument",
        "email(string)과 isAdmin(boolean)이 필요합니다."
      );
    }

    try {
      // 대상 사용자 조회
      const user = await admin.auth().getUserByEmail(email);

      // Custom Claims 설정
      await admin.auth().setCustomUserClaims(user.uid, { admin: isAdmin });

      // Firestore 화이트리스트 동기화
      const db = admin.firestore();
      const docRef = db.doc("admin-config/allowed-emails");
      const doc = await docRef.get();
      const emails: string[] = doc.exists ? doc.data()?.emails || [] : [];

      if (isAdmin && !emails.includes(email)) {
        await docRef.set({ emails: [...emails, email] }, { merge: true });
      } else if (!isAdmin && emails.includes(email)) {
        await docRef.set(
          { emails: emails.filter((e: string) => e !== email) },
          { merge: true }
        );
      }

      return {
        success: true,
        message: `${email}의 관리자 권한이 ${isAdmin ? "부여" : "해제"}되었습니다.`,
      };
    } catch (error: unknown) {
      const err = error as { code?: string; message?: string };
      if (err.code === "auth/user-not-found") {
        throw new HttpsError(
          "not-found",
          "해당 이메일의 사용자를 찾을 수 없습니다."
        );
      }
      throw new HttpsError(
        "internal",
        err.message || "권한 설정 중 오류가 발생했습니다."
      );
    }
  }
);
