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
  clientName: string;
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
