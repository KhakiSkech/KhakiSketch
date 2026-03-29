import * as admin from "firebase-admin";

admin.initializeApp();

// Admin: Custom Claims 관리
export { setAdminClaim } from "./admin/set-admin-claim";
export { onUserCreated } from "./admin/on-user-created";

// Notifications: 견적 접수 이메일 알림
export { onLeadCreated } from "./notifications/on-lead-created";

// Images: 서버사이드 썸네일/중간 이미지 생성
// 활성화 방법: GCP Console에서 Eventarc 서비스 계정에 Storage 권한 부여 → 아래 주석 해제 → 재배포
// export { onImageUploaded } from "./images/on-image-uploaded";

// Analytics: GA4 데이터 조회
export { getAnalyticsData } from "./analytics";
