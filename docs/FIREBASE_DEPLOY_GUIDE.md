# Firebase 배포 가이드

## 🚀 배포 준비사항

### 1. 환경변수 설정

`.env.local` 파일에 다음 환경변수를 설정합니다:

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Admin Emails (Firebase Auth에서 인증된 이메일 중 관리자로 지정)
NEXT_PUBLIC_ADMIN_EMAILS=admin@yourdomain.com,manager@yourdomain.com

# Google Analytics (선택)
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX

# EmailJS (견적 알림용 - 선택)
NEXT_PUBLIC_EMAILJS_SERVICE_ID=your_service_id
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=your_template_id
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=your_public_key
```

### 2. Firebase CLI 설치 및 로그인

```bash
# Firebase CLI 설치 (전역)
npm install -g firebase-tools

# Firebase 로그인
firebase login

# 프로젝트 초기화 (처음 설정 시)
firebase init
```

### 3. Firebase 프로젝트 설정

#### Authentication 설정
1. Firebase Console → Authentication → Sign-in method
2. Email/Password 활성화
3. 관리자 이메일로 계정 생성

#### Firestore 보안 규칙 배포
```bash
firebase deploy --only firestore:rules
```

#### Storage 보안 규칙 배포
```bash
firebase deploy --only storage:rules
```

## 📦 빌드 및 배포

### 개발 서버 실행
```bash
npm run dev
```

### 프로덕션 빌드
```bash
npm run build
```

### Firebase Hosting 배포
```bash
# 전체 배포 (Hosting + Firestore + Storage)
firebase deploy

# Hosting만 배포
firebase deploy --only hosting

# 특정 파일만 배포
firebase deploy --only hosting,firestore:rules
```

## 🔒 보안 설정 체크리스트

### Firestore 보안 규칙
- [x] 관리자 이메일 화이트리스트 설정 (`firestore.rules`)
- [x] 프로젝트/게시글 공개 읽기, 관리자 쓰기
- [x] 견적/CRM 데이터 관리자 전용
- [x] 어드민 설정 접근 제한

### Storage 보안 규칙
- [x] 이미지 파일 타입 검증
- [x] 파일 크기 제한 (10MB)
- [x] 관리자만 업로드 가능
- [x] 공개 읽기 설정

### Firebase Auth
- [x] 이메일/비밀번호 인증 활성화
- [x] 관리자 이메일 환경변수 설정
- [x] 인증 상태 지속성 설정

## 📊 새로운 기능

### 1. Firebase Auth 기반 관리자 인증
- 이메일/비밀번호 로그인
- 관리자 권한 자동 확인
- 안전한 세션 관리

### 2. 견적/CRM 시스템
- `/admin/quotes` - 견적 관리 페이지
- 리드 상태 관리 (NEW → CONTACTED → QUOTED → NEGOTIATING → WON/LOST)
- 우선순위 설정 (LOW/MEDIUM/HIGH/URGENT)
- 활동 로그 및 노트 기능
- 통계 대시보드

### 3. 개선된 관리자 대시보드
- 실시간 통계 카드
- 최근 견적/프로젝트 목록
- 빠른 작업 링크
- 알림 배지

## 🔧 문제 해결

### 빌드 오류
```bash
# 캐시 클리어 후 재빌드
rm -rf .next out
npm run build
```

### Firebase 권한 오류
```bash
# Firebase 토큰 재발급
firebase logout
firebase login
```

### Firestore 인덱스 오류
Firebase Console → Firestore Database → Indexes 에서 필요한 인덱스를 생성합니다.

주요 인덱스:
- `quote-leads`: createdAt (Descending)
- `quote-leads`: status (Ascending) + createdAt (Descending)

## 📝 배포 후 확인사항

1. [ ] 메인 페이지 접속 확인
2. [ ] 관리자 로그인 테스트
3. [ ] 견적 제출 테스트 (Firestore 저장 확인)
4. [ ] 이미지 업로드 테스트
5. [ ] 보안 규칙 동작 확인

## 🌐 배포된 URL

- **Production**: https://your-project.web.app
- **Admin**: https://your-project.web.app/admin

---

## 📞 지원

문제 발생 시 Firebase Console에서 로그를 확인하거나, 브라우저 개발자 도구의 Console 탭을 확인하세요.
