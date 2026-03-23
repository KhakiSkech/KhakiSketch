// functions/src/billing/types.ts
import { Timestamp } from "firebase-admin/firestore";

export interface BillingClientDoc {
  clientType: "business" | "individual";
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
  clientName: string;
  projectId: string;
  projectName: string;
  yearMonth: string;
  amount: number;
  taxAmount: number;
  totalAmount: number;
  status: "pending" | "paid" | "overdue" | "waived" | "failed";
  daysOverdue: number;
  /** @deprecated CMS 자동이체 제거됨 */
  payplePaymentId?: string | null;
  taxInvoiceId: string | null;
  paidAt: Timestamp | null;
  confirmedBy: string | null;
  firstNoticeSent: boolean;
  secondNoticeSent: boolean;
  /** @deprecated CMS 재시도 제거됨 */
  retryCount?: number;
  lastError: string | null;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface BillingSettingsDoc {
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
}
