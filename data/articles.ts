import type { FirestoreArticle } from '@/types/admin';

export type { FirestoreArticle as Article } from '@/types/admin';

export const articles: FirestoreArticle[] = [
  // ── Firestore 동기화 (2026-03-27) ──
  {
    slug: 'startup-mvp-development-guide',
    title: '스타트업 MVP 개발, 3개월 안에 끝내는 현실적인 방법',
    description: 'MVP 개발 비용, 기간, 기술 선택부터 실패하지 않는 전략까지. 10개 이상의 MVP를 만들어 본 개발팀이 알려드리는 현실적인 가이드.',
    category: 'GUIDE',
    publishedAt: '2026-03-24',
    readingTime: '8분',
    tags: ['MVP', '스타트업', '개발외주', '비용', '가이드'],
    featured: true,
    contentFormat: 'html',
    content: '',
    updatedAt: '2026-03-23T16:59:41.749Z',
  },
  {
    slug: 'outsourcing-failure-reasons',
    title: '개발 외주 실패하는 5가지 이유 (그리고 해결법)',
    description: '수천만 원 외주했는데 기대 이하? 실패 원인과 해결법.',
    category: 'INSIGHT',
    publishedAt: '2026-03-24',
    readingTime: '7분',
    tags: ['개발외주', '실패', 'IT외주', '프로젝트관리'],
    featured: true,
    contentFormat: 'html',
    content: '',
    updatedAt: '2026-03-23T16:59:42.181Z',
  },
  {
    slug: 'business-automation-guide-2026',
    title: '2026년 중소기업 업무 자동화 시작 가이드',
    description: '반복 업무에 하루 2시간? 자동화 대상부터 ROI까지.',
    category: 'GUIDE',
    publishedAt: '2026-03-24',
    readingTime: '6분',
    tags: ['업무자동화', '중소기업', '효율화'],
    featured: false,
    contentFormat: 'html',
    content: '',
    updatedAt: '2026-03-23T16:59:42.939Z',
  },
  {
    slug: 'corporate-website-roi-analysis',
    title: '기업 홈페이지, 정말 필요한가? 비용 대비 효과 분석',
    description: '홈페이지 500만~3000만원, 투자 가치는?',
    category: 'INSIGHT',
    publishedAt: '2026-03-24',
    readingTime: '5분',
    tags: ['기업홈페이지', 'ROI', '비용'],
    featured: false,
    contentFormat: 'html',
    content: '',
    updatedAt: '2026-03-23T16:59:43.339Z',
  },
  {
    slug: 'landscape-erp-case-study',
    title: '[Case Study] 조경 ERP를 3개월 만에 구축한 이야기',
    description: '엑셀 관리 → 웹 ERP 전환 실제 프로젝트.',
    category: 'CASE_STUDY',
    publishedAt: '2026-03-24',
    readingTime: '6분',
    tags: ['ERP', '케이스스터디', '조경', '맞춤개발'],
    featured: true,
    contentFormat: 'html',
    content: '',
    updatedAt: '2026-03-23T16:59:44.011Z',
  },
  // ── 기존 샘플 글 (빌드 시 정적 페이지 생성용) ──
  {
    slug: 'startup-mvp-checklist',
    title: '스타트업 MVP 개발, 이것만 체크하세요',
    description: '예비창업자를 위한 MVP 개발 전 필수 체크리스트. 기능 범위 설정부터 기술 스택 선택까지.',
    category: 'GUIDE',
    publishedAt: '2025-01-10',
    readingTime: '7분',
    tags: ['MVP', '스타트업', '개발전략'],
    featured: true,
    content: `
## MVP란 무엇인가?

MVP(Minimum Viable Product)는 최소한의 기능으로 시장 검증을 할 수 있는 제품입니다. 완벽한 제품이 아닌, **핵심 가설을 검증할 수 있는 최소한의 제품**을 의미합니다.

## MVP 개발 전 체크리스트

### 1. 문제 정의가 명확한가?

- 누구의 어떤 문제를 해결하는가?
- 이 문제가 실제로 존재하는가?
- 사람들이 돈을 지불할 만큼 중요한 문제인가?

### 2. 핵심 기능이 정의되었는가?

MVP에서 가장 중요한 것은 **"무엇을 뺄 것인가"**입니다.

- Must Have: 없으면 서비스가 성립하지 않는 기능
- Should Have: 있으면 좋지만 없어도 되는 기능
- Nice to Have: 나중에 추가해도 되는 기능

처음엔 Must Have만 구현하세요.

### 3. 성공 지표가 설정되었는가?

MVP 출시 후 무엇을 측정할 것인가?

- 회원가입 수
- 핵심 기능 사용률
- 재방문율
- 유료 전환율

### 4. 기술 스택은 적절한가?

**빠른 검증이 목표라면:**
- 웹앱: Next.js + Vercel
- 모바일: Flutter 또는 React Native
- 백엔드: Firebase 또는 Supabase

**복잡한 비즈니스 로직이 필요하다면:**
- 백엔드: FastAPI + PostgreSQL
- 인프라: AWS 또는 GCP

## 흔한 실수들

### 1. 너무 많은 기능을 넣으려 함

"이것도 있으면 좋겠어요"의 함정에 빠지지 마세요.

### 2. 완벽한 디자인에 집착

MVP 단계에서는 기능 검증이 우선입니다. UI/UX 개선은 검증 후에 해도 됩니다.

### 3. 확장성을 너무 일찍 고민

아직 유저가 100명도 안 되는데 100만 명을 위한 인프라를 구축할 필요 없습니다.

## 결론

MVP의 목적은 **빠른 시장 검증**입니다. 완벽한 제품을 만들려 하지 말고, 최소한의 기능으로 가설을 검증하세요.

카키스케치는 스타트업의 MVP 개발을 돕습니다. 기획 단계부터 함께 고민하고, 불필요한 기능을 줄여 빠르게 시장에 출시할 수 있도록 지원합니다.
    `.trim(),
  },
  {
    slug: 'discovery-session-guide',
    title: 'Discovery 세션이란? 개발 전 기획의 중요성',
    description: '요구사항 정의서 없이 개발을 시작하면 안 되는 이유. Discovery 세션의 진행 방식과 기대 효과.',
    category: 'INSIGHT',
    publishedAt: '2025-01-05',
    readingTime: '5분',
    tags: ['Discovery', '기획', '요구사항정의'],
    featured: true,
    content: `
## 왜 Discovery가 필요한가?

많은 프로젝트가 실패하는 가장 큰 이유는 **요구사항이 명확하지 않기 때문**입니다.

"이런 거 만들어주세요"라는 막연한 요청으로 시작하면:
- 개발 중간에 기능이 계속 바뀜
- 예산과 일정이 초과됨
- 결과물이 기대와 다름

## Discovery 세션이란?

Discovery는 본격적인 개발 전에 진행하는 **기획 및 설계 단계**입니다.

### 포함 내용

1. **비즈니스 이해**
   - 서비스의 목적과 목표
   - 타겟 사용자 정의
   - 경쟁사 분석

2. **기능 정의**
   - 핵심 기능 목록화
   - 우선순위 설정
   - 범위 확정

3. **화면 설계**
   - 주요 화면 와이어프레임
   - 사용자 플로우 정의

4. **기술 검토**
   - 적합한 기술 스택 제안
   - 외부 서비스 연동 검토

### 산출물

- 요구사항 정의서
- 화면 설계서 (와이어프레임)
- 기술 스택 제안서
- 개발 견적서

## Discovery의 장점

### 1. 명확한 범위

"대충 이런 느낌"이 아닌, 구체적인 기능 목록과 화면이 정의됩니다.

### 2. 정확한 견적

범위가 명확해지면 개발 비용과 일정도 정확해집니다.

### 3. 리스크 감소

개발 중 "이건 생각 못 했는데..."가 줄어듭니다.

### 4. 소통 기반 마련

개발자와 클라이언트가 같은 그림을 보게 됩니다.

## 카키스케치의 Discovery

카키스케치는 Discovery를 유료로 진행합니다. (20~30만원)

왜 유료인가요?
- 실제로 시간과 노력이 들어가는 작업입니다
- 무료로 진행하면 양측 모두 진지하게 임하지 않게 됩니다
- 단, **개발 계약 시 Discovery 비용은 전액 차감**됩니다

## 결론

"빨리 개발하고 싶어요"라는 마음은 이해합니다. 하지만 기획 없이 시작한 개발은 결국 더 오래 걸리고, 더 많은 비용이 듭니다.

Discovery에 투자한 시간은 결코 낭비가 아닙니다.
    `.trim(),
  },
  {
    slug: 'automation-roi',
    title: '업무 자동화 ROI 계산하는 법',
    description: '반복 업무를 자동화하면 얼마나 절약되나요? 실제 ROI 계산 방법과 자동화 우선순위 결정 가이드.',
    category: 'GUIDE',
    publishedAt: '2024-12-20',
    readingTime: '6분',
    tags: ['자동화', 'ROI', '업무효율'],
    content: `
## 자동화할 가치가 있는 업무인가?

모든 반복 업무가 자동화 대상은 아닙니다. ROI(투자 대비 수익)를 계산해보세요.

## ROI 계산 공식

\`\`\`
연간 절감액 = (작업 시간 × 시급 × 빈도 × 52주) - 자동화 비용 - 유지보수 비용
\`\`\`

### 예시

**상황:**
- 매주 3시간 소요되는 리포트 작성 업무
- 담당자 시급: 30,000원
- 자동화 개발 비용: 500만원
- 연간 유지보수: 50만원

**계산:**
- 연간 업무 비용: 3시간 × 30,000원 × 52주 = 468만원
- 자동화 후 절감: 468만원 - 50만원(유지보수) = 418만원/년
- 투자 회수 기간: 500만원 ÷ 418만원 = 약 1.2년

**결론:** 1년 2개월 후부터 순이익 발생

## 자동화 우선순위 결정 기준

### 높은 우선순위

- 반복 빈도가 높은 업무 (매일, 매주)
- 시간 소요가 큰 업무 (2시간 이상)
- 실수 가능성이 높은 업무
- 표준화된 프로세스

### 낮은 우선순위

- 가끔 발생하는 업무 (월 1회 이하)
- 복잡한 판단이 필요한 업무
- 변동성이 큰 업무

## 자주 자동화되는 업무들

### 데이터 처리
- 엑셀 데이터 정리 및 변환
- 시스템 간 데이터 동기화
- 정기 리포트 생성

### 커뮤니케이션
- 정기 이메일 발송
- 슬랙/메일 알림 자동화
- 고객 응대 자동화

### 문서 작업
- 계약서/견적서 생성
- 데이터 기반 문서 자동 작성

## 자동화의 숨은 비용

ROI 계산 시 놓치기 쉬운 비용들:

1. **초기 세팅 시간**: 기존 프로세스 정리, 요구사항 전달
2. **학습 비용**: 새 시스템 적응 기간
3. **예외 처리**: 자동화가 처리 못 하는 케이스
4. **유지보수**: 외부 시스템 변경 시 수정 필요

## 결론

자동화는 무조건 좋은 것이 아닙니다. ROI를 계산하고, 우선순위를 정해서 진행하세요.

카키스케치는 업무 자동화 컨설팅을 제공합니다. 현재 업무 프로세스를 분석하고, 자동화 가치가 있는 영역을 찾아드립니다.
    `.trim(),
  },
];

export function getArticleBySlug(slug: string): FirestoreArticle | undefined {
  return articles.find((article) => article.slug === slug);
}

export function getFeaturedArticles(): FirestoreArticle[] {
  return articles.filter((article) => article.featured);
}
