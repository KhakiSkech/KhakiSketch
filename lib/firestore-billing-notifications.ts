// Firestore Billing Notification Logs Service
import { logger } from './logger';
import {
  collection,
  getDocs,
  query,
  orderBy,
  where,
  limit as firestoreLimit,
  Timestamp,
  DocumentData,
  QueryConstraint,
} from 'firebase/firestore';
import { getFirebaseFirestore } from './firebase';
import { withTimeout } from './utils';
import type {
  BillingNotificationLog,
  BillingQueryResult,
  NotificationType,
} from '@/types/billing';

const NOTIFICATIONS_COLLECTION = 'billing-notification-logs';

// ===== Timestamp 변환 헬퍼 =====

function convertTimestamp(ts: Timestamp | null | undefined): string {
  if (!ts) return new Date().toISOString();
  if (typeof ts.toDate === 'function') {
    return ts.toDate().toISOString();
  }
  return typeof ts === 'string' ? ts : new Date().toISOString();
}

// ===== BillingNotificationLog 변환 =====

function notificationFromFirestore(
  docId: string,
  data: DocumentData
): BillingNotificationLog {
  return {
    id: docId,
    clientId: data.clientId || '',
    clientName: data.clientName || '',
    projectId: data.projectId || null,
    type: data.type as NotificationType,
    channel: data.channel || 'sms',
    recipientPhone: data.recipientPhone || '',
    message: data.message || '',
    status: data.status || 'sent',
    errorMessage: data.errorMessage || null,
    sentAt: convertTimestamp(data.sentAt),
  };
}

// ===== 알림 로그 서비스 =====

/**
 * 알림 발송 이력 조회
 */
export async function getNotificationLogs(filters?: {
  clientId?: string;
  type?: string;
  startDate?: string;
  endDate?: string;
  limit?: number;
}): Promise<BillingQueryResult<BillingNotificationLog[]>> {
  try {
    const db = getFirebaseFirestore();
    const constraints: QueryConstraint[] = [orderBy('sentAt', 'desc')];

    if (filters?.clientId) {
      constraints.push(where('clientId', '==', filters.clientId));
    }
    if (filters?.type) {
      constraints.push(where('type', '==', filters.type));
    }
    if (filters?.startDate) {
      constraints.push(
        where('sentAt', '>=', Timestamp.fromDate(new Date(filters.startDate)))
      );
    }
    if (filters?.endDate) {
      constraints.push(
        where('sentAt', '<=', Timestamp.fromDate(new Date(filters.endDate)))
      );
    }
    if (filters?.limit && filters.limit > 0) {
      constraints.push(firestoreLimit(filters.limit));
    }

    const q = query(collection(db, NOTIFICATIONS_COLLECTION), ...constraints);
    const snapshot = await withTimeout(getDocs(q), 5000);

    const logs = snapshot.docs.map((d) => notificationFromFirestore(d.id, d.data()));
    return { success: true, data: logs };
  } catch (error) {
    logger.error('알림 이력 조회 실패:', error);
    return { success: false, error: '알림 이력을 불러오는데 실패했습니다.' };
  }
}
