# KhakiSketch

KSI(KhakiSketch Inc.) 개발 스튜디오의 에이전시 포트폴리오 + CRM 웹사이트.
스타트업 MVP, 비즈니스 자동화, 기업 웹사이트 제작 서비스를 소개하고, 견적 문의 리드 관리와 블로그/포트폴리오 CMS를 제공합니다.

**Live:** https://khakisketch.co.kr

## Tech Stack

| Layer | Stack |
|-------|-------|
| Framework | Next.js 16 (App Router, React 19, Turbopack) |
| Styling | Tailwind CSS v4, Framer Motion |
| Backend | Firebase (Auth, Firestore, Storage, Cloud Functions) |
| Editor | Novel (TipTap) WYSIWYG |
| Build | Static export (`output: 'export'`) |
| Test | Vitest, Testing Library, jsdom |
| CI | GitHub Actions (lint, type-check, build, test) |
| Formatting | Prettier + lint-staged |

## Project Structure

```
KhakiSketch/
├── app/                     # Next.js App Router pages
│   ├── admin/               # Admin CMS (blog, portfolio, quotes, analytics, settings)
│   ├── blog/                # Blog pages
│   ├── portfolio/           # Portfolio pages
│   ├── about/               # About page
│   ├── contact/             # Contact page
│   ├── quote/               # Quote request form
│   ├── services/            # Services page
│   ├── pricing/             # Pricing page
│   ├── process/             # Process page
│   ├── brochure/            # Brochure download
│   └── api/                 # API routes
├── components/
│   ├── admin/               # Admin components (ArticleForm, SimpleProjectForm, WysiwygEditor)
│   └── ui/                  # Shared UI (NoiseTexture, MarkdownRenderer, ContentRenderer)
├── hooks/                   # Custom hooks (useAuth, useSearch, useProjects)
├── lib/                     # Utilities + Firestore services
│   ├── firebase.ts          # Firebase lazy singleton
│   ├── firestore-*.ts       # Firestore CRUD services
│   ├── logger.ts            # Environment-aware logger
│   └── utils.ts             # Shared utilities
├── functions/               # Firebase Cloud Functions (Node.js 22)
│   └── src/                 # setAdminClaim, onUserCreated, onLeadCreated, onImageUploaded
├── data/                    # Static fallback data
├── types/                   # TypeScript type definitions
└── __tests__/               # Vitest tests
```

## Getting Started

### Prerequisites

- Node.js 20+
- Firebase project with Auth, Firestore, Storage enabled

### Setup

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local
# Edit .env.local with your Firebase config

# Run dev server
npm run dev
```

Open http://localhost:3000

### Environment Variables

```env
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
NEXT_PUBLIC_ADMIN_EMAILS=admin@example.com
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

## Scripts

```bash
npm run dev          # Dev server (Turbopack)
npm run build        # Production build (static export)
npm run lint         # ESLint
npm run test         # Vitest
npm run type-check   # TypeScript check
npm run format       # Prettier format
```

## Admin CMS

`/admin` - Firebase Auth (Custom Claims `admin: true`) 기반 관리자 페이지

- **Portfolio** - 프로젝트 CRUD (WYSIWYG editor, 이미지 업로드, 자동저장)
- **Blog** - 아티클 CRUD (WYSIWYG editor, 태그, 카테고리)
- **Quotes** - 견적 문의 리드 관리
- **Analytics** - GA4 Data API 대시보드
- **Settings** - FAQ, Testimonials, Pricing, Stats 관리

## Cloud Functions

```bash
cd functions
npm install
npm test              # Run function tests
firebase deploy --only functions
```

| Function | Trigger | Description |
|----------|---------|-------------|
| `setAdminClaim` | Callable (v2) | Admin custom claim 설정 |
| `onUserCreated` | Auth onCreate (v1) | 신규 유저 처리 |
| `onLeadCreated` | Firestore onCreate (v2) | 견적 문의 알림 이메일 |
| `onImageUploaded` | Storage onFinalized (v2) | 이미지 최적화 |

## Deploy

```bash
# Build
npm run build

# Deploy hosting
firebase deploy --only hosting

# Deploy all (functions + rules + hosting)
firebase deploy
```

## License

Private - All Rights Reserved
