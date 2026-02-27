/**
 * 부트스트랩 스크립트 - 최초 1회 실행
 *
 * 실행 방법:
 * 1. Firebase Console > 프로젝트 설정 > 서비스 계정 > 새 비공개 키 생성
 * 2. 다운로드한 JSON 파일을 functions/scripts/ 에 저장
 * 3. 아래 명령 실행:
 *    node scripts/bootstrap-admin.js ./scripts/serviceAccountKey.json
 *
 * 이 스크립트가 하는 일:
 * - songjc6561@gmail.com 에 { admin: true } Custom Claim 설정
 * - Firestore admin-config/allowed-emails 문서 생성
 * - Firestore admin-config/notification-settings 문서 생성
 */

const admin = require("firebase-admin");

// ====== 설정 ======
const ADMIN_EMAIL = "songjc6561@gmail.com";
const SMTP_HOST = "smtp.gmail.com";
const SMTP_PORT = 587;
// ==================

async function main() {
  // 서비스 계정 키 경로
  const keyPath = process.argv[2];
  if (!keyPath) {
    console.error("사용법: node scripts/bootstrap-admin.js <서비스계정키.json 경로>");
    console.error("예: node scripts/bootstrap-admin.js ./scripts/serviceAccountKey.json");
    process.exit(1);
  }

  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const serviceAccount = require(require("path").resolve(keyPath));

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });

  const db = admin.firestore();

  try {
    // 1. Custom Claim 설정
    console.log(`\n[1/3] ${ADMIN_EMAIL} 에 admin claim 설정 중...`);
    const user = await admin.auth().getUserByEmail(ADMIN_EMAIL);
    await admin.auth().setCustomUserClaims(user.uid, { admin: true });
    console.log(`  ✓ uid=${user.uid} 에 { admin: true } 설정 완료`);

    // 검증
    const updated = await admin.auth().getUser(user.uid);
    console.log(`  ✓ 검증: customClaims =`, updated.customClaims);

    // 2. allowed-emails 문서 생성
    console.log(`\n[2/3] admin-config/allowed-emails 문서 생성 중...`);
    await db.doc("admin-config/allowed-emails").set({
      emails: [ADMIN_EMAIL],
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });
    console.log(`  ✓ 문서 생성 완료`);

    // 3. notification-settings 문서 생성
    console.log(`\n[3/3] admin-config/notification-settings 문서 생성 중...`);
    await db.doc("admin-config/notification-settings").set({
      recipientEmails: [ADMIN_EMAIL],
      smtpHost: SMTP_HOST,
      smtpPort: SMTP_PORT,
      smtpUser: ADMIN_EMAIL,
      smtpFrom: ADMIN_EMAIL,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });
    console.log(`  ✓ 문서 생성 완료`);

    console.log("\n========================================");
    console.log("부트스트랩 완료!");
    console.log("========================================");
    console.log("\n다음 단계:");
    console.log("  1. firebase functions:secrets:set SMTP_PASS");
    console.log("     (Gmail 앱 비밀번호 입력)");
    console.log("  2. cd functions && npm run build");
    console.log("  3. firebase deploy --only functions");
    console.log("  4. firebase deploy --only firestore:rules,storage");
    console.log("  5. npm run build && firebase deploy --only hosting");
    console.log("");
  } catch (error) {
    console.error("\n부트스트랩 실패:", error.message);
    process.exit(1);
  }

  process.exit(0);
}

main();
