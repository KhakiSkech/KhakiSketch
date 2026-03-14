// Firestore Billing Settings Service
import { logger } from './logger';
import {
  doc,
  getDoc,
  setDoc,
  Timestamp,
  DocumentData,
} from 'firebase/firestore';
import { getFirebaseFirestore } from './firebase';
import { withTimeout } from './utils';
import type { BillingSettings, BillingQueryResult } from '@/types/billing';

const SETTINGS_COLLECTION = 'billing-settings';
const SETTINGS_DOC_ID = 'default';

// ===== Timestamp 변환 헬퍼 =====

function convertTimestamp(ts: Timestamp | null | undefined): string {
  if (!ts) return new Date().toISOString();
  if (typeof ts.toDate === 'function') {
    return ts.toDate().toISOString();
  }
  return typeof ts === 'string' ? ts : new Date().toISOString();
}

// ===== BillingSettings 변환 =====

function settingsFromFirestore(data: DocumentData): BillingSettings {
  return {
    reminderDaysBefore: data.reminderDaysBefore ?? 3,
    firstNoticeDaysAfter: data.firstNoticeDaysAfter ?? 3,
    secondNoticeDaysAfter: data.secondNoticeDaysAfter ?? 5,
    maxRetryCount: data.maxRetryCount ?? 1,
    bankName: data.bankName || '',
    bankAccount: data.bankAccount || '',
    bankHolder: data.bankHolder || '',
    contactPhone: data.contactPhone || '',
    solapiSendPhone: data.solapiSendPhone || '',
    useAlimtalk: data.useAlimtalk ?? false,
    paypleIsSandbox: data.paypleIsSandbox ?? true,
    popbillIsSandbox: data.popbillIsSandbox ?? true,
    autoIssueTaxInvoice: data.autoIssueTaxInvoice ?? false,
    supplierRegNo: data.supplierRegNo || '',
    supplierName: data.supplierName || '',
    supplierCeo: data.supplierCeo || '',
    supplierType: data.supplierType || '',
    supplierCategory: data.supplierCategory || '',
    updatedAt: convertTimestamp(data.updatedAt),
  };
}

// ===== 설정 서비스 =====

/**
 * 과금 설정 조회
 */
export async function getBillingSettings(): Promise<BillingQueryResult<BillingSettings>> {
  try {
    const db = getFirebaseFirestore();
    const docRef = doc(db, SETTINGS_COLLECTION, SETTINGS_DOC_ID);
    const docSnap = await withTimeout(getDoc(docRef), 5000);

    if (!docSnap.exists()) {
      // 문서가 없으면 기본값 반환
      const defaults = settingsFromFirestore({});
      return { success: true, data: defaults };
    }

    return { success: true, data: settingsFromFirestore(docSnap.data()) };
  } catch (error) {
    logger.error('과금 설정 조회 실패:', error);
    return { success: false, error: '과금 설정을 불러오는데 실패했습니다.' };
  }
}

/**
 * 과금 설정 수정
 */
export async function updateBillingSettings(
  data: Partial<BillingSettings>
): Promise<BillingQueryResult<void>> {
  try {
    const db = getFirebaseFirestore();
    const docRef = doc(db, SETTINGS_COLLECTION, SETTINGS_DOC_ID);

    const { updatedAt: _updatedAt, ...rest } = data;
    await setDoc(
      docRef,
      {
        ...rest,
        updatedAt: Timestamp.now(),
      },
      { merge: true }
    );

    return { success: true };
  } catch (error) {
    logger.error('과금 설정 수정 실패:', error);
    return { success: false, error: '과금 설정 수정에 실패했습니다.' };
  }
}
