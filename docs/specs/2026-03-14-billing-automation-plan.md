# KSIAPI 과금 자동화 구현 계획

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 기존 KhakiSketch 어드민에 CMS 자동이체(페이플) + 자동 독촉(Solapi) + 세금계산서(팝빌) 과금 시스템을 추가한다.

**Architecture:** Firebase 기존 인프라 확장. Firestore 서브컬렉션(billing-clients/{id}/projects, invoices) + Cloud Functions v2 스케줄러 + 3개 외부 API 클라이언트. 어드민 UI는 기존 패턴(useAuth + QueryResult<T> + 사이드바 NavItem) 그대로 따름.

**Tech Stack:** Next.js 16, Firebase Cloud Functions v2 (TypeScript, Node 20, asia-northeast3), Firestore, Payple REST API, Solapi REST API, Popbill Node.js SDK

**Spec:** `docs/specs/2026-03-14-billing-automation-design.md`

---

## Chunk 1: Foundation — 타입, 스키마, 보안 규칙

### Task 1: 타입 정의

**Files:**
- Create: `types/billing.ts`

- [ ] **Step 1: billing 타입 파일 생성**

```typescript
// types/billing.ts
// 고객
export interface BillingClient {
  id: string;
  companyName: string;
  contactName: string;
  phone: string;
  email: string;
  taxEmail: string;
  businessRegNo: string;
  companyType: string;
  companyCategory: string;
  bankCode: string;
  bankAccountNo: string;
  paypleBillingKey: string;
  memo: string;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

// 프로젝트
export interface BillingProject {
  id: string;
  clientId: string;
  name: string;
  siteUrl: string;
  monthlyFee: number;
  billingDay: number;
  serviceItems: string[];
  status: 'active' | 'terminating' | 'terminated';
  terminationDate: string | null;
  terminationReason: string | null;
  contractStart: string;
  contractEnd: string | null;
  memo: string;
  createdAt: string;
  updatedAt: string;
}

// 청구서
export type InvoiceStatus = 'pending' | 'paid' | 'overdue' | 'waived' | 'failed';

export interface BillingInvoice {
  id: string; // {projectId}_{yearMonth}
  clientId: string;
  projectId: string;
  projectName: string;
  yearMonth: string;
  amount: number;
  taxAmount: number;
  totalAmount: number;
  status: InvoiceStatus;
  daysOverdue: number;
  payplePaymentId: string | null;
  taxInvoiceId: string | null;
  paidAt: string | null;
  confirmedBy: string | null;
  firstNoticeSent: boolean;
  secondNoticeSent: boolean;
  retryCount: number;
  lastError: string | null;
  createdAt: string;
  updatedAt: string;
}

// 알림 로그
export type NotificationType =
  | 'pre_reminder' | 'billing_success' | 'billing_failed'
  | 'overdue_1st' | 'overdue_2nd' | 'overdue_severe'
  | 'termination_scheduled' | 'termination_complete' | 'manual';

export interface BillingNotificationLog {
  id: string;
  clientId: string;
  clientName: string;
  projectId: string | null;
  type: NotificationType;
  channel: 'sms' | 'alimtalk';
  recipientPhone: string;
  message: string;
  status: 'sent' | 'failed';
  errorMessage: string | null;
  sentAt: string;
}

// 설정
export interface BillingSettings {
  reminderDaysBefore: number;
  firstNoticeDaysAfter: number;
  secondNoticeDaysAfter: number;
  maxRetryCount: number;
  bankName: string;
  bankAccount: string;
  bankHolder: string;
  contactPhone: string;
  solapiSendPhone: string;
  useAlimtalk: boolean;
  paypleIsSandbox: boolean;
  popbillIsSandbox: boolean;
  autoIssueTaxInvoice: boolean;
  supplierRegNo: string;
  supplierName: string;
  supplierCeo: string;
  supplierType: string;
  supplierCategory: string;
  updatedAt: string;
}

// 대시보드 요약
export interface BillingDashboardSummary {
  totalClients: number;
  paidCount: number;
  overdueCount: number;
  monthlyRevenue: number;
}

// QueryResult 재사용 (기존 패턴)
export interface BillingQueryResult<T> {
  success: boolean;
  data?: T;
  error?: string;
}
```

- [ ] **Step 2: Commit**
```bash
git add types/billing.ts
git commit -m "feat(billing): add billing type definitions"
```

---

### Task 2: Firestore 보안 규칙 업데이트

**Files:**
- Modify: `firestore.rules`

- [ ] **Step 1: billing 컬렉션 규칙 추가**

기존 `firestore.rules`의 마지막 `}` 전에 추가:

```
    // === Billing System ===
    match /billing-clients/{clientId} {
      allow read, write: if isAdmin();

      match /projects/{projectId} {
        allow read, write: if isAdmin();
      }

      match /invoices/{invoiceId} {
        allow read, write: if isAdmin();
      }
    }

    match /billing-notification-logs/{logId} {
      allow read: if isAdmin();
      allow write: if false;
    }

    match /billing-settings/{doc} {
      allow read, write: if isAdmin();
    }
```

- [ ] **Step 2: Commit**
```bash
git add firestore.rules
git commit -m "feat(billing): add Firestore security rules for billing collections"
```

---

### Task 3: Firestore 인덱스 설정

**Files:**
- Create: `firestore.indexes.json`
- Modify: `firebase.json`

- [ ] **Step 1: firestore.indexes.json 생성**

```json
{
  "indexes": [
    {
      "collectionGroup": "projects",
      "queryScope": "COLLECTION_GROUP",
      "fields": [
        { "fieldPath": "status", "order": "ASCENDING" },
        { "fieldPath": "billingDay", "order": "ASCENDING" }
      ]
    },
    {
      "collectionGroup": "projects",
      "queryScope": "COLLECTION_GROUP",
      "fields": [
        { "fieldPath": "status", "order": "ASCENDING" },
        { "fieldPath": "terminationDate", "order": "ASCENDING" }
      ]
    },
    {
      "collectionGroup": "invoices",
      "queryScope": "COLLECTION_GROUP",
      "fields": [
        { "fieldPath": "status", "order": "ASCENDING" },
        { "fieldPath": "createdAt", "order": "ASCENDING" }
      ]
    },
    {
      "collectionGroup": "invoices",
      "queryScope": "COLLECTION_GROUP",
      "fields": [
        { "fieldPath": "status", "order": "ASCENDING" },
        { "fieldPath": "daysOverdue", "order": "DESCENDING" }
      ]
    }
  ],
  "fieldOverrides": []
}
```

- [ ] **Step 2: firebase.json에 indexes 참조 추가**

`"firestore"` 섹션에 `"indexes": "firestore.indexes.json"` 추가.

- [ ] **Step 3: Commit**
```bash
git add firestore.indexes.json firebase.json
git commit -m "feat(billing): add Firestore collectionGroup indexes for billing"
```

---

## Chunk 2: Cloud Functions — API 클라이언트 + 타입

### Task 4: Functions billing 타입 정의

**Files:**
- Create: `functions/src/billing/types.ts`

- [ ] **Step 1: Cloud Functions용 billing 타입 생성**

Firestore DocumentData 기반 타입. 프론트엔드 타입과 유사하지만 Timestamp 사용.

```typescript
// functions/src/billing/types.ts
import { Timestamp } from "firebase-admin/firestore";

export interface BillingClientDoc {
  companyName: string;
  contactName: string;
  phone: string;
  email: string;
  taxEmail: string;
  businessRegNo: string;
  companyType: string;
  companyCategory: string;
  bankCode: string;
  bankAccountNo: string;
  paypleBillingKey: string;
  memo: string;
  status: "active" | "inactive";
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface BillingProjectDoc {
  name: string;
  siteUrl: string;
  monthlyFee: number;
  billingDay: number;
  serviceItems: string[];
  status: "active" | "terminating" | "terminated";
  terminationDate: string | null;
  terminationReason: string | null;
  contractStart: string;
  contractEnd: string | null;
  memo: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface BillingInvoiceDoc {
  clientId: string;
  projectId: string;
  projectName: string;
  yearMonth: string;
  amount: number;
  taxAmount: number;
  totalAmount: number;
  status: "pending" | "paid" | "overdue" | "waived" | "failed";
  daysOverdue: number;
  payplePaymentId: string | null;
  taxInvoiceId: string | null;
  paidAt: Timestamp | null;
  confirmedBy: string | null;
  firstNoticeSent: boolean;
  secondNoticeSent: boolean;
  retryCount: number;
  lastError: string | null;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface BillingSettingsDoc {
  reminderDaysBefore: number;
  firstNoticeDaysAfter: number;
  secondNoticeDaysAfter: number;
  maxRetryCount: number;
  bankName: string;
  bankAccount: string;
  bankHolder: string;
  contactPhone: string;
  solapiSendPhone: string;
  useAlimtalk: boolean;
  paypleIsSandbox: boolean;
  popbillIsSandbox: boolean;
  autoIssueTaxInvoice: boolean;
  supplierRegNo: string;
  supplierName: string;
  supplierCeo: string;
  supplierType: string;
  supplierCategory: string;
}
```

- [ ] **Step 2: Commit**

---

### Task 5: Solapi API 클라이언트

**Files:**
- Create: `functions/src/billing/solapi-client.ts`

- [ ] **Step 1: Solapi REST API 클라이언트 구현**

Solapi REST API v4를 사용한 SMS/알림톡 발송 클라이언트. HMAC-SHA256 인증.

```typescript
// functions/src/billing/solapi-client.ts
import * as crypto from "crypto";
import { logger } from "firebase-functions/v2";

interface SendMessageParams {
  to: string;
  text: string;
  from: string;
  type?: "SMS" | "LMS" | "ATA"; // ATA = 알림톡
  kakaoOptions?: {
    pfId: string;
    templateId: string;
    variables: Record<string, string>;
  };
}

interface SendResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

export class SolapiClient {
  private apiKey: string;
  private apiSecret: string;
  private baseUrl = "https://api.solapi.com";

  constructor(apiKey: string, apiSecret: string) {
    this.apiKey = apiKey;
    this.apiSecret = apiSecret;
  }

  private generateSignature(): { authorization: string; date: string } {
    const date = new Date().toISOString();
    const salt = crypto.randomBytes(32).toString("hex");
    const signature = crypto
      .createHmac("sha256", this.apiSecret)
      .update(date + salt)
      .digest("hex");

    return {
      authorization: `HMAC-SHA256 apiKey=${this.apiKey}, date=${date}, salt=${salt}, signature=${signature}`,
      date,
    };
  }

  async sendMessage(params: SendMessageParams): Promise<SendResult> {
    const { authorization } = this.generateSignature();

    const body: Record<string, unknown> = {
      message: {
        to: params.to,
        from: params.from,
        text: params.text,
        type: params.type || (params.text.length > 90 ? "LMS" : "SMS"),
      },
    };

    if (params.kakaoOptions) {
      body.message = {
        ...body.message,
        kakaoOptions: params.kakaoOptions,
      };
    }

    try {
      const response = await fetch(`${this.baseUrl}/messages/v4/send`, {
        method: "POST",
        headers: {
          Authorization: authorization,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (!response.ok) {
        logger.error("Solapi send failed:", data);
        return { success: false, error: data.errorMessage || "발송 실패" };
      }

      return { success: true, messageId: data.groupId };
    } catch (error) {
      logger.error("Solapi API error:", error);
      return { success: false, error: String(error) };
    }
  }
}
```

- [ ] **Step 2: Commit**

---

### Task 6: 알림 메시지 템플릿

**Files:**
- Create: `functions/src/billing/templates.ts`

- [ ] **Step 1: SMS/알림톡 메시지 템플릿 생성**

```typescript
// functions/src/billing/templates.ts

interface TemplateVars {
  contactName: string;
  projectName: string;
  totalAmount: string;     // 포맷된 금액 (예: "80,000")
  billingDate: string;     // "3월 5일"
  month: string;           // "3"
  bankInfo: string;        // "기업은행 xxx-xxx (송재찬)"
  taxEmail: string;
  contactPhone: string;
  terminationDate?: string;
  overdueList?: string;
  date?: string;
  paidCount?: string;
  paidAmount?: string;
  overdueCount?: string;
  overdueAmount?: string;
}

function fillTemplate(template: string, vars: TemplateVars): string {
  return Object.entries(vars).reduce(
    (msg, [key, value]) => msg.replaceAll(`{${key}}`, value || ""),
    template
  );
}

const TEMPLATES = {
  pre_reminder: `[카키스케치] {contactName}님, {projectName} 운영관리비 {totalAmount}원이 {billingDate}에 등록 계좌에서 자동 출금됩니다.
서비스 변경/해지: {contactPhone}`,

  billing_success: `[카키스케치] {projectName} {month}월 운영관리비 {totalAmount}원 정상 출금. 세금계산서가 {taxEmail}로 발송됩니다.`,

  billing_failed: `[카키스케치] {contactName}님, {projectName} {month}월 운영관리비 {totalAmount}원 출금이 실패했습니다. 계좌 잔액을 확인해주세요. 3일 후 재출금됩니다.
문의: {contactPhone}`,

  overdue_1st: `[카키스케치] {contactName}님, {projectName} 운영관리비가 미납 상태입니다. 계좌 잔액 확인 후 자동 출금이 재시도됩니다.
문의: {contactPhone}`,

  overdue_2nd: `[카키스케치] {contactName}님, {projectName} 운영관리비 미납이 지속되고 있습니다. 빠른 확인 부탁드립니다. 서비스 유지에 영향이 있을 수 있습니다.
문의: {contactPhone}`,

  overdue_severe: `[카키스케치] {contactName}님, {projectName} 운영관리비가 7일 이상 미납 상태입니다. 조속한 확인 부탁드립니다.
문의: {contactPhone}`,

  termination_scheduled: `[카키스케치] {contactName}님, {projectName} 서비스 해지가 접수되었습니다. {terminationDate}부로 운영관리가 종료됩니다. 철회 시 연락 부탁드립니다.
{contactPhone}`,

  termination_complete: `[카키스케치] {contactName}님, {projectName} 서비스가 종료되었습니다. 재이용을 원하시면 언제든 연락해주세요. {contactPhone}`,

  admin_daily_summary: `[KSI] {date} 수금 {paidCount}건 {paidAmount}원 / 미납 {overdueCount}건 {overdueAmount}원
{overdueList}`,

  manual_transfer_guide: `[카키스케치] {contactName}님, {projectName} {month}월 운영관리비 {totalAmount}원 입금 안내입니다.
입금계좌: {bankInfo}
문의: {contactPhone}`,
} as const;

export type TemplateKey = keyof typeof TEMPLATES;

export function renderMessage(key: TemplateKey, vars: TemplateVars): string {
  return fillTemplate(TEMPLATES[key], vars);
}

export function formatAmount(amount: number): string {
  return amount.toLocaleString("ko-KR");
}
```

- [ ] **Step 2: Commit**

---

### Task 7: 페이플 API 클라이언트

**Files:**
- Create: `functions/src/billing/payple-client.ts`

- [ ] **Step 1: 페이플 REST API 클라이언트 구현**

페이플 계좌간편결제(CMS) API 클라이언트. 인증 → 빌링키 등록 → 결제 요청 플로우.

- [ ] **Step 2: Commit**

---

### Task 8: 팝빌 세금계산서 클라이언트

**Files:**
- Create: `functions/src/billing/popbill-client.ts`

- [ ] **Step 1: 팝빌 Node.js SDK 래퍼 구현**

`popbill` npm 패키지를 사용한 전자세금계산서 발행 클라이언트.

- [ ] **Step 2: functions/package.json에 의존성 추가**

```bash
cd functions && npm install popbill
```

- [ ] **Step 3: Commit**

---

## Chunk 3: Cloud Functions — 스케줄러 + 웹훅 + 액션

### Task 9: 메인 스케줄러 (billingDailyCycle)

**Files:**
- Create: `functions/src/billing/scheduler.ts`

- [ ] **Step 1: 5단계 순차 실행 스케줄러 구현**

`onSchedule` v2 함수로 매일 09:00 KST 실행. 내부적으로 generateInvoices → requestCmsPayments → sendPreReminders → updateOverdueAndNotify → processTerminations 순차 실행. 각 단계 독립 try-catch.

- [ ] **Step 2: Commit**

---

### Task 10: 관리자 일일 요약 (sendAdminDailySummary)

**Files:**
- Modify: `functions/src/billing/scheduler.ts`

- [ ] **Step 1: 09:30 KST 관리자 SMS 요약 스케줄러 추가**

오늘의 수금/미납 현황을 집계하여 관리자에게 SMS 발송.

- [ ] **Step 2: Commit**

---

### Task 11: 페이플 웹훅 수신

**Files:**
- Create: `functions/src/billing/webhooks.ts`

- [ ] **Step 1: HTTP 함수로 페이플 결제 결과 웹훅 구현**

orderId로 invoice 매칭, 상태 업데이트, 성공 시 세금계산서 발행 트리거.

- [ ] **Step 2: Commit**

---

### Task 12: Callable 어드민 액션

**Files:**
- Create: `functions/src/billing/actions.ts`

- [ ] **Step 1: 6개 callable 함수 구현**

registerCmsBilling, confirmPayment, waiveInvoice, sendManualNotice, terminateProject, issueTaxInvoice.

- [ ] **Step 2: Commit**

---

### Task 13: Functions index.ts에 billing exports 추가

**Files:**
- Create: `functions/src/billing/index.ts`
- Modify: `functions/src/index.ts`

- [ ] **Step 1: billing 모듈 export 파일 생성**

```typescript
// functions/src/billing/index.ts
export { billingDailyCycle, sendAdminDailySummary } from "./scheduler";
export { paypleWebhook } from "./webhooks";
export {
  registerCmsBilling,
  confirmPayment,
  waiveInvoice,
  sendManualNotice,
  terminateProject,
  issueTaxInvoice,
} from "./actions";
```

- [ ] **Step 2: 기존 index.ts에 billing 추가**

```typescript
// functions/src/index.ts 에 추가
export {
  billingDailyCycle,
  sendAdminDailySummary,
  paypleWebhook,
  registerCmsBilling,
  confirmPayment,
  waiveInvoice,
  sendManualNotice,
  terminateProject,
  issueTaxInvoice,
} from "./billing";
```

- [ ] **Step 3: tsc --noEmit로 타입 체크**
- [ ] **Step 4: Commit**

---

## Chunk 4: Frontend — Firestore 서비스

### Task 14: Billing Firestore 서비스

**Files:**
- Create: `lib/firestore-billing-clients.ts`
- Create: `lib/firestore-billing-invoices.ts`
- Create: `lib/firestore-billing-settings.ts`
- Create: `lib/firestore-billing-notifications.ts`

- [ ] **Step 1: 고객 CRUD 서비스** (`firestore-billing-clients.ts`)

기존 패턴(QueryResult<T>, withTimeout, getFirebaseFirestore) 따라서:
getAllClients, getClientById, createClient, updateClient, getClientProjects, createProject, updateProject 등.

- [ ] **Step 2: 청구서 서비스** (`firestore-billing-invoices.ts`)

collectionGroup 쿼리로 전체 invoice 조회, 미납 invoice 조회, 고객별 invoice 조회. 대시보드 요약 집계.

- [ ] **Step 3: 설정 서비스** (`firestore-billing-settings.ts`)

getBillingSettings, updateBillingSettings.

- [ ] **Step 4: 알림 로그 서비스** (`firestore-billing-notifications.ts`)

getNotificationLogs (날짜/고객/유형 필터).

- [ ] **Step 5: Commit**

---

## Chunk 5: Frontend — 어드민 UI

### Task 15: 사이드바 메뉴 추가

**Files:**
- Modify: `components/admin/Sidebar.tsx`

- [ ] **Step 1: 과금 관리 메뉴 그룹 추가**

기존 navigation 배열에 '과금 관리' 그룹 추가:
```typescript
{
  label: '과금 관리',
  href: '#',
  icon: <BillingIcon />,
  children: [
    { label: '대시보드', href: '/admin/billing', ... },
    { label: '고객 관리', href: '/admin/billing/clients', ... },
    { label: '청구/수금', href: '/admin/billing/invoices', ... },
    { label: '알림 이력', href: '/admin/billing/notifications', ... },
    { label: '과금 설정', href: '/admin/billing/settings', ... },
  ],
}
```

- [ ] **Step 2: Commit**

---

### Task 16: 과금 대시보드

**Files:**
- Create: `app/admin/billing/page.tsx`
- Create: `app/admin/billing/BillingDashboardClient.tsx`

- [ ] **Step 1: 대시보드 서버 페이지 + 클라이언트 컴포넌트**

상태 카드 4개 (전체 고객, 이번달 수금, 미납, MRR) + 미납 테이블 + 최근 알림 로그. 기존 admin 대시보드 패턴 따름.

- [ ] **Step 2: Commit**

---

### Task 17: 고객 관리 (목록 + 등록 + 상세)

**Files:**
- Create: `app/admin/billing/clients/page.tsx`
- Create: `app/admin/billing/clients/BillingClientsClient.tsx`
- Create: `app/admin/billing/clients/new/page.tsx`
- Create: `app/admin/billing/clients/new/NewClientClient.tsx`
- Create: `app/admin/billing/clients/[id]/page.tsx`
- Create: `app/admin/billing/clients/[id]/ClientDetailClient.tsx`

- [ ] **Step 1: 고객 목록 페이지** — 테이블 + 검색 + 상태 필터 + 등록 버튼
- [ ] **Step 2: 고객 등록 페이지** — 폼 (회사명, 담당자, 연락처, 사업자번호, 계좌)
- [ ] **Step 3: 고객 상세 페이지** — 탭(기본정보/프로젝트/결제이력), CMS 등록 버튼, 프로젝트 추가/편집
- [ ] **Step 4: Commit**

---

### Task 18: 청구/수금 관리

**Files:**
- Create: `app/admin/billing/invoices/page.tsx`
- Create: `app/admin/billing/invoices/BillingInvoicesClient.tsx`

- [ ] **Step 1: 청구서 목록 페이지**

월별 필터, 상태별 색상 코딩 (D+1~3 노랑, D+4~6 주황, D+7+ 빨강), 입금확인/면제 버튼.

- [ ] **Step 2: Commit**

---

### Task 19: 알림 이력

**Files:**
- Create: `app/admin/billing/notifications/page.tsx`
- Create: `app/admin/billing/notifications/NotificationLogsClient.tsx`

- [ ] **Step 1: 발송 로그 테이블** — 날짜/고객/유형 필터, 성공/실패 상태.
- [ ] **Step 2: Commit**

---

### Task 20: 과금 설정

**Files:**
- Create: `app/admin/billing/settings/page.tsx`
- Create: `app/admin/billing/settings/BillingSettingsClient.tsx`

- [ ] **Step 1: 설정 페이지**

독촉 정책 (D-3, D+3, D+5), 입금 계좌 정보, Solapi 발신번호, SMS/알림톡 토글, 공급자 정보, 시크릿 상태 표시 (설정됨/미설정).

- [ ] **Step 2: Commit**

---

## Chunk 6: 통합 + 검증

### Task 21: 빌드 검증 + 타입 체크

- [ ] **Step 1: 프론트엔드 빌드**
```bash
npm run build
```

- [ ] **Step 2: Functions 타입 체크**
```bash
cd functions && npm run lint
```

- [ ] **Step 3: 테스트 실행**
```bash
npm test
```

- [ ] **Step 4: 전체 결과 확인 후 최종 커밋**

---

## 실행 순서 요약

| 순서 | Task | 내용 | 병렬 가능 |
|------|------|------|-----------|
| 1 | Task 1-3 | 타입 + 규칙 + 인덱스 | 순차 |
| 2 | Task 4-8 | Functions 타입 + API 클라이언트 3개 | Task 5,6,7,8 병렬 |
| 3 | Task 9-13 | 스케줄러 + 웹훅 + 액션 + exports | 순차 (의존성) |
| 4 | Task 14 | Firestore 서비스 4개 | 병렬 |
| 5 | Task 15-20 | 어드민 UI 6개 페이지 | Task 16-20 병렬 |
| 6 | Task 21 | 빌드 검증 | 순차 |
