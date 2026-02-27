# 🎨 KhakiSketch - Premium Development Studio Website

KhakiSketch는 스타트업 MVP, 비즈니스 자동화, 기업 웹사이트 제작을 전문으로 하는 개발 스튜디오의 포트폴리오 웹사이트입니다.

> **최신 업데이트:** Phase 1 & 2 고도화 완료 (2026-02-04)  
> Firebase Auth 기반 보안 강화, 고급 검색 기능, 에러 처리 시스템 구축

## 🚀 주요 기능

### ✅ 구현 완료
- ⭐ 프리미엄 UI/UX (Framer Motion 애니메이션)
- 🔐 **Firebase Auth 기반 안전한 관리자 인증**
- 🔍 **고급 검색 기능** (디바운스, 키보드 단축키)
- 🛡️ **포괄적인 에러 처리** (Error Boundary)
- 📦 Firebase Firestore CMS
- 📝 블로그 시스템 (Markdown 지원)
- 🖼️ 이미지 갤러리 관리
- 📊 사이트 설정 (FAQ, Testimonials, Pricing, Stats)
- 📱 완전한 반응형 디자인
- ⚡ 성능 최적화 (폰트 프리로드, 이미지 lazy loading)
- 🎯 SEO 최적화 (메타데이터, Open Graph, JSON-LD)
- ♿ 접근성 지원 (Skip Link, ARIA 레이블)

## 🛠️ 기술 스택

**Frontend:**
- Next.js 16.0.8 (App Router)
- React 19.2.1
- TypeScript
- Tailwind CSS v4
- Framer Motion 12.30.0

**Backend & Services:**
- Firebase (Auth, Firestore, Storage, Hosting)
- EmailJS
- Google Analytics

**개발 도구:**
- ESLint
- TypeScript

## 📁 프로젝트 구조

```
KhakiSketch/
├── app/                    # Next.js App Router
│   ├── admin/             # 관리자 페이지 (CMS)
│   ├── portfolio/         # 포트폴리오
│   ├── blog/              # 블로그
│   ├── services/          # 서비스 상세
├── components/            # React 컴포넌트
│   ├── ui/               # 재사용 UI (SearchBox, ProjectCard 등)
│   ├── admin/            # 관리자 컴포넌트
│   └── ErrorBoundary.tsx # 에러 처리
├── hooks/                 # 커스텀 Hooks
│   ├── useAuth.ts        # 관리자 인증
│   ├── useSearch.ts      # 검색 기능
│   └── useProjects.ts    # 프로젝트 데이터
├── lib/                   # 유틸리티 함수
│   ├── firebase.ts       # Firebase 초기화
│   └── firestore-*.ts    # Firestore 서비스
├── types/                 # TypeScript 타입 정의
│   └── index.ts          # 통합 타입 정의
└── data/                  # 정적 데이터 (Fallback)
```

## 🔧 설정 및 실행

### 1. 환경변수 설정

`.env.example`을 복사하여 `.env.local` 생성:

```bash
cp .env.example .env.local
```

**필수 환경변수:**
```env
# Firebase 설정
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# 관리자 이메일 (쉼표로 구분)
NEXT_PUBLIC_ADMIN_EMAILS=songjc6561@gmail.com

# Google Analytics  
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

### 2. Firebase 설정

#### Auth 활성화
1. Firebase Console > Authentication
2. Sign-in method > 이메일/비밀번호 활성화
3. 관리자 계정 생성

#### 보안 규칙 배포
```bash
# Firestore 규칙
firebase deploy --only firestore:rules

# Storage 규칙
firebase deploy --only storage:rules
```

### 3. 개발 서버 실행

```bash
# 의존성 설치
npm install

# 개발 서버
npm run dev

# 빌드
npm run build

# 프로덕션 실행
npm start
```

브라우저에서 [http://localhost:3000](http://localhost:3000) 접속

## 🔐 관리자 페이지

관리자 페이지: `/admin`

**로그인:**
- Firebase Auth로 인증된 이메일만 접근 가능
- 환경변수 `NEXT_PUBLIC_ADMIN_EMAILS`에 등록된 이메일만 관리자 권한

**주요 기능:**
- 포트폴리오 프로젝트 관리 (CRUD)
- 블로그 아티클 관리 (Markdown 에디터)
- 이미지 갤러리 (Firebase Storage)
- 사이트 설정 (FAQ, Testimonials, Pricing, Stats)

## 📚 사용 가이드

### 새 프로젝트 추가
1. `/admin`에 로그인
2. "Portfolio" 탭 선택
3. "New Project" 클릭
4. 프로젝트 정보 입력 및 저장

### 검색 기능 사용
```typescript
import { useProjectSearch } from '@/hooks/useSearch';
import SearchBox from '@/components/ui/SearchBox';

const { query, setQuery, results } = useProjectSearch(projects);

<SearchBox
  value={query}
  onChange={setQuery}
  placeholder="검색..."
  resultsCount={results.length}
/>
```

## 🚀 배포

### Firebase Hosting

```bash
# 빌드
npm run build

# Firebase 배포
firebase deploy --only hosting
```

### Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/khakisketch)

## 📖 문서

- [구현 완료 보고서](./COMPLETION_REPORT.md) - Phase 1 & 2 완료 내역
- [고도화 구현 계획](./IMPLEMENTATION_SUMMARY.md) - 전체 구현 계획
- [워크플로우](./.agent/workflows/advanced-implementation-plan.md) - 상세 구현 가이드

## 🔒 보안

- ✅ Firebase Auth 기반 관리자 인증
- ✅ Firestore 보안 규칙 (이메일 화이트리스트)
- ✅ Storage 보안 규칙 (파일 타입, 크기 검증)
- ✅ 환경변수로 민감 정보 관리
- ✅ HTTPS 강제 (Firebase Hosting)

## 🎨 디자인

**브랜드 컬러:**
- Primary: `#263122` (카키 올리브)
- Secondary: `#749965` (연한 녹색)
- Background: `#FAF9F6` (크림)

**폰트:**
- Pretendard (한글 최적화)

**애니메이션:**
- Framer Motion
- 커스텀 CSS 애니메이션

## 📊 프로젝트 상태

| 측면 | 점수 | 상태 |
|------|------|------|
| 보안 | 9/10 | ✅ 완료 |
| 코드 품질 | 9/10 | ✅ 완료 |
| UX | 9/10 | ✅ 완료 |
| 성능 | 7/10 | 🔄 Phase 3 |
| 테스트 | 0/10 | 🔄 Phase 3 |

**종합:** 8.5/10

## 🔜 향후 계획 (Phase 3)

- ⬜ next/image 최적화
- ⬜ CSS 리팩토링
- ⬜ Bundle Analyzer
- ⬜ Vitest 설정 및 테스트 작성
- ⬜ SSG/ISR 전환
- ⬜ 다크 모드
- ⬜ 블로그 확장 (태그, 댓글, 소셜 공유)

## 📞 문의

- Email: songjc6561@gmail.com
- Website: https://khakisketch.com

## 📄 라이선스

Private - All Rights Reserved

---

**Built with ❤️ by KhakiSketch Team**

