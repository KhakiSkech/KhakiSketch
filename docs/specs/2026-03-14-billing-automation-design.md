# KSIAPI 과금 자동화 시스템 설계 스펙

> 버전: v1.1
> 작성일: 2026-03-14
> 상태: 확정 (스펙 리뷰 반영)

---

## 1. 개요

### 1.1 목적

KhakiSketch 기존 어드민(/admin)을 확장하여 월정액 운영관리 과금을 자동화한다.
CMS 자동이체(페이플) + 자동 독촉(Solapi SMS/알림톡) + 세금계산서 자동발행(팝빌)으로
관리자 개입 최소화.

### 1.2 핵심 흐름

```
D-3  SMS: "3일 후 자동 출금 예정"
D+0  페이플 CMS 출금 → 성공 시 팝빌 세금계산서 자동 발행
D+3  실패 시 재시도 + 1차 독촉
D+5  2차 독촉
D+7+ 관리자에게 미납 심각 알림
```

### 1.3 사용자

- **관리자**: KSI 내부 (송재찬 + 내부 인원). 대시보드에서 모니터링, 예외 처리만.
- **고객 (간접)**: SMS/알림톡 수신. 시스템 직접 접근 없음.

### 1.4 기술 스택

| 영역 | 기술 |
|------|------|
| Frontend | 기존 Next.js 16 어드민 확장 |
| Backend | Firebase Cloud Functions (TypeScript, Node 20) |
| Database | Firestore (기존) |
| Auth | Firebase Auth + Custom Claims (기존) |
| CMS 결제 | 페이플 (Payple) REST API |
| 알림 | Solapi REST API (SMS → 알림톡 전환) |
| 세금계산서 | 팝빌 (Popbill) Node.js SDK |

---

## 2. 범위

### 2.1 포함

- 고객/프로젝트 CRUD
- CMS 자동 출금 (페이플 빌링키 등록 + 정기 출금)
- 자동 독촉 SMS/알림톡 (D-3 사전안내, D+0 청구, D+3/D+5 독촉)
- 세금계산서 자동 발행 (팝빌, 출금 성공 시 즉시)
- 미납 현황 대시보드
- 서비스 해지 플로우 (terminating → terminated)
- 관리자 일일 요약 알림
- 과금/알림/API 설정 관리

### 2.2 제외

- 킬스위치 (자동 서비스 중단/복구) — 관리자 수동 판단
- 고객 포탈/로그인
- PG 카드 결제
- Solapi 앱스토어 수익 집계
- MRR 추이 차트 (Phase 2)

---

## 3. Firestore 스키마

기존 Firestore에 4개 컬렉션 추가.

### 3.1 billing-clients

고객사 정보. 서브컬렉션으로 projects, invoices 포함.

```
billing-clients/{clientId}
├── companyName: string          // 고객사명
├── contactName: string          // 담당자명
├── phone: string                // 알림 수신 번호
├── email: string                // 이메일
├── taxEmail: string             // 세금계산서 수신 이메일
├── businessRegNo: string        // 사업자등록번호
├── companyType: string          // 업태
├── companyCategory: string      // 종목
├── bankCode: string             // 고객 출금 은행 코드
├── bankAccountNo: string        // 고객 출금 계좌 (CMS용)
├── paypleBillingKey: string     // 페이플 빌링키
├── memo: string
├── status: 'active' | 'inactive'
├── createdAt: Timestamp
└── updatedAt: Timestamp
```

### 3.2 billing-clients/{clientId}/projects

고객별 프로젝트. 1 고객 : N 프로젝트.

```
billing-clients/{clientId}/projects/{projectId}
├── name: string                 // 프로젝트명
├── siteUrl: string              // 고객 사이트 URL
├── monthlyFee: number           // 월정액 (원, VAT 별도)
├── billingDay: number           // 결제일 (1~28)
├── serviceItems: string[]       // ['hosting','ssl','alimtalk','maintenance']
├── status: 'active' | 'terminating' | 'terminated'
├── terminationDate: string      // 해지 예정일 (ISO date, nullable)
├── terminationReason: string    // 해지 사유 (nullable)
├── contractStart: string        // 계약 시작일
├── contractEnd: string | null   // 계약 종료일 (null = 무기한)
├── memo: string
├── createdAt: Timestamp
└── updatedAt: Timestamp
```

### 3.3 billing-clients/{clientId}/invoices

월별 청구 레코드. collectionGroup 쿼리로 전체 미납 조회 가능.

```
billing-clients/{clientId}/invoices/{projectId}_{yearMonth}   // 결정적 ID로 중복 방지
├── projectId: string
├── projectName: string
├── yearMonth: string            // '2026-03'
├── amount: number               // 공급가액
├── taxAmount: number            // 세액
├── totalAmount: number          // 합계
├── status: 'pending' | 'paid' | 'overdue' | 'waived' | 'failed'
├── daysOverdue: number          // 미납 일수
├── payplePaymentId: string      // 페이플 결제 ID (nullable)
├── taxInvoiceId: string         // 팝빌 세금계산서 ID (nullable)
├── paidAt: Timestamp            // 결제 완료 시각 (nullable)
├── confirmedBy: string          // 수동 확인 시 확인자 (nullable)
├── firstNoticeSent: boolean
├── secondNoticeSent: boolean
├── retryCount: number           // CMS 재시도 횟수
├── lastError: string            // 마지막 실패 사유 (nullable)
├── createdAt: Timestamp
└── updatedAt: Timestamp
```

### 3.4 billing-notification-logs

모든 알림 발송 이력.

```
billing-notification-logs/{logId}
├── clientId: string
├── clientName: string
├── projectId: string | null
├── type: 'pre_reminder' | 'billing_success' | 'billing_failed'
│       | 'overdue_1st' | 'overdue_2nd' | 'overdue_severe'
│       | 'termination_scheduled' | 'termination_complete' | 'manual'
├── channel: 'sms' | 'alimtalk'
├── recipientPhone: string
├── message: string
├── status: 'sent' | 'failed'
├── errorMessage: string | null
└── sentAt: Timestamp
```

### 3.5 billing-settings (단일 문서)

API 시크릿은 Firestore에 저장하지 않고, Firebase Secret Manager(`defineSecret()`)로 관리.
기존 프로젝트의 `SMTP_PASS` 패턴과 동일.

```
billing-settings/default (Firestore — 비밀번호 아닌 설정값만)
├── reminderDaysBefore: number       // 사전 안내 D-N (기본 3)
├── firstNoticeDaysAfter: number     // 1차 독촉 D+N (기본 3)
├── secondNoticeDaysAfter: number    // 2차 독촉 D+N (기본 5)
├── maxRetryCount: number            // CMS 재시도 횟수 (기본 1)
│
├── bankName: string                 // KSI 입금 은행명
├── bankAccount: string              // KSI 입금 계좌
├── bankHolder: string               // 예금주
├── contactPhone: string             // 문의 전화번호 (SMS 템플릿 변수)
│
├── solapiSendPhone: string          // 발신번호
├── useAlimtalk: boolean             // false=SMS, true=알림톡
├── paypleIsSandbox: boolean         // 테스트 모드
├── popbillIsSandbox: boolean
├── autoIssueTaxInvoice: boolean     // 세금계산서 자동 발행 on/off
│
├── supplierRegNo: string            // KSI 사업자등록번호
├── supplierName: string             // 상호
├── supplierCeo: string              // 대표자
├── supplierType: string             // 업태
├── supplierCategory: string         // 종목
│
└── updatedAt: Timestamp

Firebase Secret Manager (defineSecret — Cloud Functions에서만 접근)
├── SOLAPI_API_KEY
├── SOLAPI_API_SECRET
├── PAYPLE_CLIENT_ID
├── PAYPLE_CLIENT_SECRET
├── POPBILL_LINK_ID
└── POPBILL_SECRET_KEY
```

어드민 설정 UI에서는 시크릿 값 표시 대신 "설정됨/미설정" 상태만 표시.
시크릿 변경은 Firebase CLI(`firebase functions:secrets:set`)로 처리.

### 3.6 Firestore Security Rules 추가

```
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
  allow write: if false; // Cloud Functions만 쓰기
}

match /billing-settings/{doc} {
  allow read, write: if isAdmin();
}
```

---

## 4. Cloud Functions 구조

기존 `functions/src/` 에 `billing/` 디렉토리 추가.

### 4.1 파일 구조

```
functions/src/
├── index.ts                     // 기존 + billing exports 추가
└── billing/
    ├── index.ts                 // billing 모듈 exports
    ├── scheduler.ts             // 스케줄 함수 5개
    ├── webhooks.ts              // HTTP: 페이플 웹훅 수신
    ├── actions.ts               // Callable: 어드민 액션
    ├── payple-client.ts         // 페이플 API 클라이언트
    ├── solapi-client.ts         // Solapi API 클라이언트
    ├── popbill-client.ts        // 팝빌 API 클라이언트
    ├── templates.ts             // 알림 메시지 템플릿
    └── types.ts                 // 타입 정의
```

### 4.2 스케줄 함수 (매일 자동 실행)

모든 날짜 비교는 `Asia/Seoul` 타임존 기준. Cloud Functions region: `asia-northeast3` (기존 함수와 동일).

| 함수 | 스케줄 | 설명 |
|------|--------|------|
| billingDailyCycle | 매일 09:00 KST | **메인 스케줄러** — 아래 단계를 순차 실행 (race condition 방지) |
| sendAdminDailySummary | 매일 09:30 KST | 관리자에게 일일 요약 SMS |

`billingDailyCycle`은 단일 함수 내에서 순차 실행:

```
1. generateInvoices()      — 오늘 결제일인 active 프로젝트의 invoice 생성
2. requestCmsPayments()    — 모든 pending invoice + 빌링키 → 페이플 출금
3. sendPreReminders()      — N일 후 결제일인 프로젝트 → SMS
4. updateOverdueAndNotify()— 미납 갱신 + 독촉 + CMS 재시도
5. processTerminations()   — 해지 예정일 도래 프로젝트 → terminated 전환 + SMS
```

순차 실행으로 스케줄러 간 race condition을 원천 방지.
각 단계는 독립적으로 try-catch하여 한 단계 실패가 전체를 중단하지 않음.

### 4.3 HTTP 함수

| 함수 | Method | 설명 |
|------|--------|------|
| paypleWebhook | POST | 페이플 결제 결과 웹훅 수신 → invoice 상태 업데이트 + 세금계산서 발행 트리거 |

### 4.4 Callable 함수 (어드민 액션)

| 함수 | 설명 |
|------|------|
| registerCmsBilling | 고객 CMS 빌링키 등록 (페이플 본인인증 URL 생성) |
| confirmPayment | 수동 입금 확인 (CMS 없이 이체한 경우) |
| waiveInvoice | 청구 면제 처리 |
| sendManualNotice | 수동 알림 SMS/알림톡 발송 |
| terminateProject | 프로젝트 해지 처리 (terminating 상태 전환) |
| issueTaxInvoice | 세금계산서 수동 발행 |

### 4.5 스케줄러 상세 로직

#### Step 1: generateInvoices()

```
1. collectionGroup('projects') where status == 'active'
2. billingDay == 오늘 날짜 (Asia/Seoul) 필터
3. 각 프로젝트에 대해:
   - 결정적 ID `{projectId}_{yearMonth}`로 invoice set() (중복 생성 원천 방지)
   - amount = monthlyFee
   - taxAmount = Math.round(monthlyFee * 0.1)
   - totalAmount = amount + taxAmount
   - status = 'pending'
```

#### Step 2: requestCmsPayments()

```
1. collectionGroup('invoices') where status == 'pending' (오늘 생성분뿐 아니라 모든 pending)
2. 해당 client의 paypleBillingKey 확인
3. billingKey 있으면:
   - payplePaymentId 이미 있으면 skip (이중 출금 방지)
   - 페이플 API POST /billing/pay
   - 성공 → status='paid', paidAt=now
   - 성공 + autoIssueTaxInvoice → 팝빌 세금계산서 발행
   - 실패 → status='failed', lastError 기록
4. billingKey 없으면:
   - SMS로 수동 이체 안내 발송 (계좌 정보 포함)
```

#### Step 3: sendPreReminders()

```
1. collectionGroup('projects') where status == 'active'
2. billingDay == (오늘 + reminderDaysBefore)일 필터
3. 해당 고객에게 사전 안내 SMS 발송
```

#### Step 4: updateOverdueAndNotify()

```
1. collectionGroup('invoices') where status in ['pending','failed'], createdAt < 오늘
2. daysOverdue = 오늘(Asia/Seoul) - billingDay(해당 월)
3. daysOverdue >= firstNoticeDaysAfter + !firstNoticeSent:
   - 1차 독촉 SMS + CMS 재시도 (retryCount < maxRetryCount)
   - firstNoticeSent = true
4. daysOverdue >= secondNoticeDaysAfter + !secondNoticeSent:
   - 2차 독촉 SMS
   - secondNoticeSent = true
5. daysOverdue >= 7:
   - 관리자에게 "미납 심각" SMS (고객별 1회만)
```

#### Step 5: processTerminations()

```
1. collectionGroup('projects') where status == 'terminating'
2. terminationDate <= 오늘(Asia/Seoul) 필터
3. 상태 전환: 'terminating' → 'terminated'
4. 해지 완료 SMS 발송
```

---

## 5. 페이플 CMS 연동

### 5.1 빌링키 등록 플로우

```
관리자: 어드민에서 "CMS 등록" 버튼 클릭
  → registerCmsBilling callable 호출
  → 페이플 API: 본인인증 URL 생성
  → 고객에게 SMS로 인증 URL 발송
  → 고객: 링크 클릭 → 본인인증 + 계좌 동의
  → 페이플 → 웹훅 → paypleBillingKey 저장
```

### 5.2 정기 출금 플로우

```
Cloud Function (09:05)
  → POST 페이플 /billing/pay
  → Request: { billingKey, amount, orderId, productName }
  → Response: 성공/실패
  → 성공 시: invoice.status='paid' + 세금계산서 발행
  → 실패 시: invoice.status='failed' + lastError 저장
```

### 5.3 웹훅 수신

```
POST /paypleWebhook
  → 서명 검증
  → 결제 결과에 따라 invoice 상태 업데이트
  → 성공 시 세금계산서 자동 발행 트리거
  → notification-logs에 기록
```

---

## 6. 팝빌 세금계산서 연동

### 6.1 자동 발행 트리거

CMS 출금 성공 시 (invoice.status='paid') 자동 실행.

```
1. billing-settings에서 공급자(KSI) 정보 로드
2. billing-clients에서 공급받는자(고객) 정보 로드
3. 팝빌 API 호출:
   - 품명: "{프로젝트명} SW 운영관리 서비스 ({yearMonth})"
   - 공급가액: invoice.amount
   - 세액: invoice.taxAmount
   - 비고: 프로젝트명 + 서비스 항목
4. 결과:
   - 성공 → invoice.taxInvoiceId 저장
   - 실패 → 관리자에게 SMS 알림 (수동 발행 필요)
```

### 6.2 수동 발행

어드민에서 "세금계산서 발행" 버튼 → issueTaxInvoice callable 호출.

---

## 7. 알림 메시지 템플릿

### 7.1 SMS 템플릿 (카카오 채널 검수 전)

```
[사전 안내 D-3]
[카키스케치] {contactName}님, {projectName} 운영관리비 {totalAmount}원이 {billingDate}에 등록 계좌에서 자동 출금됩니다.
서비스 변경/해지: 010-7466-6560

[출금 완료]
[카키스케치] {projectName} {month}월 운영관리비 {totalAmount}원 정상 출금. 세금계산서가 {taxEmail}로 발송됩니다.

[출금 실패 D+0]
[카키스케치] {contactName}님, {projectName} {month}월 운영관리비 {totalAmount}원 출금이 실패했습니다. 계좌 잔액을 확인해주세요. 3일 후 재출금됩니다.
문의: 010-7466-6560

[1차 독촉 D+3]
[카키스케치] {contactName}님, {projectName} 운영관리비가 미납 상태입니다. 계좌 잔액 확인 후 자동 출금이 재시도됩니다.
문의: 010-7466-6560

[2차 독촉 D+5]
[카키스케치] {contactName}님, {projectName} 운영관리비 미납이 지속되고 있습니다. 빠른 확인 부탁드립니다. 서비스 유지에 영향이 있을 수 있습니다.
문의: 010-7466-6560

[관리자 일일 요약]
[KSI] {date} 수금 {paidCount}건 {paidAmount}원 / 미납 {overdueCount}건 {overdueAmount}원
{overdueList}

[해지 접수]
[카키스케치] {contactName}님, {projectName} 서비스 해지가 접수되었습니다. {terminationDate}부로 운영관리가 종료됩니다. 철회 시 연락 부탁드립니다.
010-7466-6560

[해지 완료]
[카키스케치] {contactName}님, {projectName} 서비스가 종료되었습니다. 재이용을 원하시면 언제든 연락해주세요. 010-7466-6560
```

### 7.2 알림톡 전환

`billing-settings.useAlimtalk = true`로 전환 시 동일 템플릿을 알림톡 채널로 발송.
카카오 비즈메시지 템플릿 검수 완료 후 전환.

---

## 8. 어드민 UI

기존 /admin 사이드바에 메뉴 추가. 기존 디자인 패턴(Tailwind, 다크 테마) 유지.

### 8.1 페이지 목록

| URL | 화면명 | 핵심 UI |
|-----|--------|---------|
| /admin/billing | 과금 대시보드 | 상태 카드 4개 + 미납 테이블 + 최근 알림 |
| /admin/billing/clients | 고객 목록 | 테이블(검색/상태필터), 등록 버튼 |
| /admin/billing/clients/new | 고객 등록 | 폼 (회사명, 담당자, 연락처, 사업자번호, 계좌) |
| /admin/billing/clients/[id] | 고객 상세 | 탭(기본정보/프로젝트/결제이력), CMS 등록 버튼 |
| /admin/billing/invoices | 청구서 목록 | 월별 필터, 상태별 색상, 입금확인/면제 버튼 |
| /admin/billing/notifications | 알림 이력 | 발송 로그 테이블 (날짜/고객/유형 필터) |
| /admin/billing/settings | 과금 설정 | 독촉 정책, 계좌 정보, API 키, SMS/알림톡 토글 |

### 8.2 대시보드 카드

```
┌──────────────┬──────────────┬──────────────┬──────────────┐
│  전체 고객    │  이번달 수금  │  🔴 미납     │  이번달 MRR   │
│     8곳      │    6건 완료   │    2건       │  ₩640,000    │
└──────────────┴──────────────┴──────────────┴──────────────┘
```

### 8.3 미납 현황 색상 코딩

- D+1~3: 노란색 (주의)
- D+4~6: 주황색 (경고)
- D+7+: 빨간색 (심각)

---

## 9. 해지 플로우

```
관리자: 프로젝트 상태 → 'terminating' + 해지 예정일 설정
  → 시스템: 해지 접수 SMS 자동 발송
  → 다음 결제일부터 CMS 출금 자동 중단 (scheduler에서 terminating 프로젝트 skip)
  → 해지 예정일 도래 → 상태 자동 전환 'terminated'
  → 해지 완료 SMS 자동 발송
```

---

## 10. 보안

- **API 시크릿**: Firebase Secret Manager(`defineSecret()`)에 저장. Firestore에 시크릿 저장 금지.
- **외부 API 호출**: Cloud Functions에서만 실행 (클라이언트 직접 호출 불가).
- **페이플 웹훅 보안**:
  - 요청 body의 `PCD_RST_URL` + `PCD_PAY_RST` 필드로 결과 검증
  - `orderId`가 기존 invoice와 매칭되는지 확인 후 상태 업데이트
  - 존재하지 않는 invoice에 대한 웹훅은 무시 + 로그 기록
- **빌링키**: Firestore `billing-clients`에 저장, `isAdmin()` 접근 제어.
- **고객 계좌번호**: 어드민 UI에서 마스킹 표시 (`***-***-1234`).
- **Firestore 규칙**: `billing-notification-logs`는 admin도 write 불가 (Cloud Functions만 쓰기).

---

## 11. 에러 처리

| 상황 | 처리 |
|------|------|
| 페이플 출금 실패 | invoice.status='failed', lastError 기록, D+3에 재시도 |
| 페이플 API 장애 | 스케줄러 다음 실행 시 재처리 (idempotent 설계) |
| Solapi SMS 실패 | notification-logs에 'failed' 기록, 관리자에게 알림 |
| 팝빌 세금계산서 실패 | 관리자에게 SMS, 수동 발행 안내 |
| 스케줄러 중복 실행 | yearMonth + projectId로 invoice 중복 생성 방지 |
| 빌링키 미등록 고객 | CMS 건너뛰고 수동 이체 안내 SMS 발송 |

---

## 12. 외부 서비스 가입 선행 작업

| 서비스 | 필요 서류 | 소요 기간 |
|--------|-----------|-----------|
| 페이플 가맹점 | 사업자등록증, 통장사본, 신분증 | 1~2주 |
| 팝빌 회원가입 | 사업자등록증 | 즉시~3일 |
| Solapi (기존 계정) | - | 완료 |
| 카카오 비즈채널 | - | 검토중 |

---

## 13. Firestore 인덱스

collectionGroup 쿼리에 필요한 복합 인덱스. `firestore.indexes.json`에 추가.

| 컬렉션 그룹 | 필드 | 용도 |
|-------------|------|------|
| projects | status ASC, billingDay ASC | 결제일별 active 프로젝트 조회 |
| projects | status ASC, terminationDate ASC | 해지 예정 프로젝트 조회 |
| invoices | status ASC, createdAt ASC | pending/failed 미납 invoice 조회 |
| invoices | status ASC, daysOverdue DESC | 미납 현황 대시보드 정렬 |

---

## 14. 제외 항목 (명시)

| 항목 | 사유 |
|------|------|
| 킬스위치 | 관리자 수동 판단으로 결정 |
| 고객 포탈 | B2B, SMS/알림톡으로 충분 |
| PG 카드 결제 | CMS 계좌이체로 대체 |
| Solapi 앱스토어 수익 집계 | CMS 구독과 별개, Solapi가 자체 처리 |
| MRR 추이 차트 | Phase 2 |
| 계약 갱신 알림 | Phase 2 |
