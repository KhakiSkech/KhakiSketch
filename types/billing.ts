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
  clientName: string;
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
