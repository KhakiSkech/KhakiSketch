// Firestore Billing Invoices Service
import { logger } from './logger';
import {
  collection,
  collectionGroup,
  doc,
  getDoc,
  getDocs,
  query,
  orderBy,
  where,
  Timestamp,
  DocumentData,
} from 'firebase/firestore';
import { getFirebaseFirestore } from './firebase';
import { withTimeout } from './utils';
import type {
  BillingInvoice,
  BillingDashboardSummary,
  BillingQueryResult,
  InvoiceStatus,
} from '@/types/billing';

const CLIENTS_COLLECTION = 'billing-clients';
const INVOICES_SUBCOLLECTION = 'invoices';

// ===== Timestamp 변환 헬퍼 =====

function convertTimestamp(ts: Timestamp | null | undefined): string | null {
  if (!ts) return null;
  if (typeof ts.toDate === 'function') {
    return ts.toDate().toISOString();
  }
  return typeof ts === 'string' ? ts : null;
}

// ===== BillingInvoice 변환 =====

function invoiceFromFirestore(docId: string, clientId: string, data: DocumentData, clientName?: string): BillingInvoice {
  return {
    id: docId,
    clientId,
    clientName: clientName ?? data.clientName ?? clientId,
    projectId: data.projectId || '',
    projectName: data.projectName || '',
    yearMonth: data.yearMonth || '',
    amount: data.amount || 0,
    taxAmount: data.taxAmount || 0,
    totalAmount: data.totalAmount || 0,
    status: data.status || 'pending',
    daysOverdue: data.daysOverdue || 0,
    taxInvoiceId: data.taxInvoiceId || null,
    paidAt: convertTimestamp(data.paidAt),
    confirmedBy: data.confirmedBy || null,
    firstNoticeSent: data.firstNoticeSent || false,
    secondNoticeSent: data.secondNoticeSent || false,
    lastError: data.lastError || null,
    createdAt: convertTimestamp(data.createdAt) || new Date().toISOString(),
    updatedAt: convertTimestamp(data.updatedAt) || new Date().toISOString(),
  };
}

/**
 * collectionGroup 문서에서 clientId 추출 (부모 경로: billing-clients/{clientId}/invoices/{id})
 */
function extractClientId(refPath: string): string {
  // e.g. "billing-clients/abc123/invoices/proj_2026-03"
  const parts = refPath.split('/');
  const idx = parts.indexOf(CLIENTS_COLLECTION);
  return idx !== -1 ? (parts[idx + 1] ?? '') : '';
}

// ===== clientName 보강 헬퍼 =====

async function enrichWithClientNames(
  db: ReturnType<typeof getFirebaseFirestore>,
  invoices: BillingInvoice[]
): Promise<BillingInvoice[]> {
  const uniqueClientIds = [...new Set(invoices.map((inv) => inv.clientId))];
  const clientNameMap: Record<string, string> = {};
  for (const cid of uniqueClientIds) {
    const clientDoc = await getDoc(doc(db, CLIENTS_COLLECTION, cid));
    if (clientDoc.exists()) {
      clientNameMap[cid] = (clientDoc.data().companyName as string) || cid;
    } else {
      clientNameMap[cid] = cid;
    }
  }
  return invoices.map((inv) => ({
    ...inv,
    clientName: clientNameMap[inv.clientId] ?? inv.clientId,
  }));
}

// ===== 청구서 서비스 =====

/**
 * 전체 청구서 조회 (collectionGroup)
 */
export async function getAllInvoices(
  filters?: { status?: InvoiceStatus; yearMonth?: string }
): Promise<BillingQueryResult<BillingInvoice[]>> {
  try {
    const db = getFirebaseFirestore();
    const constraints = [];

    if (filters?.status) {
      constraints.push(where('status', '==', filters.status));
    }
    if (filters?.yearMonth) {
      constraints.push(where('yearMonth', '==', filters.yearMonth));
    }
    constraints.push(orderBy('createdAt', 'desc'));

    const q = query(collectionGroup(db, INVOICES_SUBCOLLECTION), ...constraints);
    const snapshot = await withTimeout(getDocs(q), 5000);

    const invoices = snapshot.docs.map((d) => {
      const clientId = extractClientId(d.ref.path);
      return invoiceFromFirestore(d.id, clientId, d.data());
    });

    const enriched = await enrichWithClientNames(db, invoices);
    return { success: true, data: enriched };
  } catch (error) {
    logger.error('청구서 전체 조회 실패:', error);
    return { success: false, error: '청구서 목록을 불러오는데 실패했습니다.' };
  }
}

/**
 * 특정 고객의 청구서 조회
 */
export async function getClientInvoices(
  clientId: string
): Promise<BillingQueryResult<BillingInvoice[]>> {
  try {
    const db = getFirebaseFirestore();
    const q = query(
      collection(db, CLIENTS_COLLECTION, clientId, INVOICES_SUBCOLLECTION),
      orderBy('createdAt', 'desc')
    );
    const snapshot = await withTimeout(getDocs(q), 5000);

    const clientDoc = await getDoc(doc(db, CLIENTS_COLLECTION, clientId));
    const clientName = clientDoc.exists()
      ? ((clientDoc.data().companyName as string) || clientId)
      : clientId;

    const invoices = snapshot.docs.map((d) =>
      invoiceFromFirestore(d.id, clientId, d.data(), clientName)
    );

    return { success: true, data: invoices };
  } catch (error) {
    logger.error('고객 청구서 조회 실패:', error);
    return { success: false, error: '고객 청구서를 불러오는데 실패했습니다.' };
  }
}

/**
 * 연체 청구서 조회 (collectionGroup, status = 'overdue' | 'failed')
 */
export async function getOverdueInvoices(): Promise<BillingQueryResult<BillingInvoice[]>> {
  try {
    const db = getFirebaseFirestore();
    const q = query(
      collectionGroup(db, INVOICES_SUBCOLLECTION),
      where('status', 'in', ['overdue', 'failed']),
      orderBy('daysOverdue', 'desc')
    );
    const snapshot = await withTimeout(getDocs(q), 5000);

    const invoices = snapshot.docs.map((d) => {
      const clientId = extractClientId(d.ref.path);
      return invoiceFromFirestore(d.id, clientId, d.data());
    });

    const enriched = await enrichWithClientNames(db, invoices);
    return { success: true, data: enriched };
  } catch (error) {
    logger.error('연체 청구서 조회 실패:', error);
    return { success: false, error: '연체 청구서를 불러오는데 실패했습니다.' };
  }
}

/**
 * 대시보드 요약 조회 (특정 yearMonth 기준)
 */
export async function getBillingDashboardSummary(
  yearMonth: string
): Promise<BillingQueryResult<BillingDashboardSummary>> {
  try {
    const db = getFirebaseFirestore();

    // 이번달 청구서 전체 조회
    const invoiceQuery = query(
      collectionGroup(db, INVOICES_SUBCOLLECTION),
      where('yearMonth', '==', yearMonth)
    );
    const invoiceSnapshot = await withTimeout(getDocs(invoiceQuery), 5000);

    const invoices = invoiceSnapshot.docs.map((d) => {
      const clientId = extractClientId(d.ref.path);
      return invoiceFromFirestore(d.id, clientId, d.data());
    });

    // 전체 고객 수
    const clientsSnapshot = await withTimeout(
      getDocs(collection(db, CLIENTS_COLLECTION)),
      5000
    );
    const totalClients = clientsSnapshot.size;

    // 통계 집계
    const paidInvoices = invoices.filter((inv) => inv.status === 'paid');
    const overdueInvoices = invoices.filter(
      (inv) => inv.status === 'overdue' || inv.status === 'failed'
    );

    const summary: BillingDashboardSummary = {
      totalClients,
      paidCount: paidInvoices.length,
      overdueCount: overdueInvoices.length,
      monthlyRevenue: paidInvoices.reduce((sum, inv) => sum + inv.totalAmount, 0),
    };

    return { success: true, data: summary };
  } catch (error) {
    logger.error('대시보드 요약 조회 실패:', error);
    return { success: false, error: '대시보드 요약을 불러오는데 실패했습니다.' };
  }
}
