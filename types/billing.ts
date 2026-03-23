// types/billing.ts
// 고객
export type ClientType = 'business' | 'individual';

export interface BillingClient {
  id: string;
  clientType: ClientType;
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
  /** @deprecated CMS 자동이체 제거됨 (git tag: billing-payple-popbill-archive) */
  paypleBillingKey?: string;
  sourceLeadId?: string;
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
/** @deprecated 'failed' 상태는 CMS 자동이체 제거 후 더 이상 새로 생성되지 않음 (레거시 데이터 호환용) */
export type InvoiceStatus = 'pending' | 'paid' | 'overdue' | 'waived' | 'failed';

export interface BillingInvoice {
  id: string; // {projectId}_{yearMonth}
  clientId: string;
  clientName: string;
  projectId: string;
  projectName: string;
  yearMonth: string;
  amount: number;
  taxAmount: number;
  totalAmount: number;
  status: InvoiceStatus;
  daysOverdue: number;
  /** @deprecated CMS 자동이체 제거됨 */
  payplePaymentId?: string | null;
  taxInvoiceId: string | null;
  paidAt: string | null;
  confirmedBy: string | null;
  firstNoticeSent: boolean;
  secondNoticeSent: boolean;
  /** @deprecated CMS 재시도 제거됨 */
  retryCount?: number;
  lastError: string | null;
  createdAt: string;
  updatedAt: string;
}

// 알림 로그
export type NotificationType =
  | 'pre_reminder' | 'manual_transfer_guide'
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
  /** @deprecated CMS 재시도 제거됨 */
  maxRetryCount?: number;
  bankName: string;
  bankAccount: string;
  bankHolder: string;
  contactPhone: string;
  solapiSendPhone: string;
  useAlimtalk: boolean;
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
