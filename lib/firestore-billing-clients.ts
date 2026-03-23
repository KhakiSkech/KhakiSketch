// Firestore Billing Clients & Projects Service
import { logger } from './logger';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  query,
  orderBy,
  where,
  Timestamp,
  DocumentData,
  QueryConstraint,
} from 'firebase/firestore';
import { getFirebaseFirestore } from './firebase';
import { withTimeout } from './utils';
import type { BillingClient, BillingProject, BillingQueryResult } from '@/types/billing';

const CLIENTS_COLLECTION = 'billing-clients';
const PROJECTS_SUBCOLLECTION = 'projects';

// ===== Timestamp 변환 헬퍼 =====

function convertTimestamp(ts: Timestamp | null | undefined): string | undefined {
  if (!ts) return undefined;
  if (typeof ts.toDate === 'function') {
    return ts.toDate().toISOString();
  }
  return typeof ts === 'string' ? ts : undefined;
}

// ===== BillingClient 변환 =====

function clientFromFirestore(docId: string, data: DocumentData): BillingClient {
  return {
    id: docId,
    clientType: data.clientType || 'business',
    companyName: data.companyName || '',
    contactName: data.contactName || '',
    phone: data.phone || '',
    email: data.email || '',
    taxEmail: data.taxEmail || '',
    businessRegNo: data.businessRegNo || '',
    companyType: data.companyType || '',
    companyCategory: data.companyCategory || '',
    bankCode: data.bankCode || '',
    bankAccountNo: data.bankAccountNo || '',
    memo: data.memo || '',
    status: data.status || 'active',
    createdAt: convertTimestamp(data.createdAt) || new Date().toISOString(),
    updatedAt: convertTimestamp(data.updatedAt) || new Date().toISOString(),
  };
}

// ===== BillingProject 변환 =====

function projectFromFirestore(docId: string, clientId: string, data: DocumentData): BillingProject {
  return {
    id: docId,
    clientId,
    name: data.name || '',
    siteUrl: data.siteUrl || '',
    monthlyFee: data.monthlyFee || 0,
    billingDay: data.billingDay || 1,
    serviceItems: data.serviceItems || [],
    status: data.status || 'active',
    terminationDate: data.terminationDate || null,
    terminationReason: data.terminationReason || null,
    contractStart: data.contractStart || '',
    contractEnd: data.contractEnd || null,
    memo: data.memo || '',
    createdAt: convertTimestamp(data.createdAt) || new Date().toISOString(),
    updatedAt: convertTimestamp(data.updatedAt) || new Date().toISOString(),
  };
}

// ===== 고객 CRUD =====

/**
 * 모든 청구 고객 조회
 */
export async function getAllBillingClients(
  filters?: { status?: string }
): Promise<BillingQueryResult<BillingClient[]>> {
  try {
    const db = getFirebaseFirestore();
    const constraints: QueryConstraint[] = [orderBy('createdAt', 'desc')];

    if (filters?.status) {
      constraints.push(where('status', '==', filters.status));
    }

    const q = query(collection(db, CLIENTS_COLLECTION), ...constraints);
    const snapshot = await withTimeout(getDocs(q), 5000);

    const clients = snapshot.docs.map((d) => clientFromFirestore(d.id, d.data()));
    return { success: true, data: clients };
  } catch (error) {
    logger.error('고객 목록 조회 실패:', error);
    return { success: false, error: '고객 목록을 불러오는데 실패했습니다.' };
  }
}

/**
 * 특정 청구 고객 조회
 */
export async function getBillingClientById(
  clientId: string
): Promise<BillingQueryResult<BillingClient>> {
  try {
    const db = getFirebaseFirestore();
    const docRef = doc(db, CLIENTS_COLLECTION, clientId);
    const docSnap = await withTimeout(getDoc(docRef), 5000);

    if (!docSnap.exists()) {
      return { success: false, error: '고객을 찾을 수 없습니다.' };
    }

    return { success: true, data: clientFromFirestore(docSnap.id, docSnap.data()) };
  } catch (error) {
    logger.error('고객 조회 실패:', error);
    return { success: false, error: '고객 정보를 불러오는데 실패했습니다.' };
  }
}

/**
 * 청구 고객 생성
 */
export async function createBillingClient(
  data: Omit<BillingClient, 'id' | 'createdAt' | 'updatedAt'>
): Promise<BillingQueryResult<string>> {
  try {
    const db = getFirebaseFirestore();
    const now = Timestamp.now();

    const docRef = await addDoc(collection(db, CLIENTS_COLLECTION), {
      ...data,
      createdAt: now,
      updatedAt: now,
    });

    return { success: true, data: docRef.id };
  } catch (error) {
    logger.error('고객 생성 실패:', error);
    return { success: false, error: '고객 생성에 실패했습니다.' };
  }
}

/**
 * 청구 고객 수정
 */
export async function updateBillingClient(
  clientId: string,
  data: Partial<BillingClient>
): Promise<BillingQueryResult<void>> {
  try {
    const db = getFirebaseFirestore();
    const docRef = doc(db, CLIENTS_COLLECTION, clientId);

    const { id: _id, createdAt: _createdAt, ...rest } = data;
    const updateData: DocumentData = {
      ...rest,
      updatedAt: Timestamp.now(),
    };

    await updateDoc(docRef, updateData);
    return { success: true };
  } catch (error) {
    logger.error('고객 수정 실패:', error);
    return { success: false, error: '고객 정보 수정에 실패했습니다.' };
  }
}

// ===== 프로젝트 CRUD (서브컬렉션) =====

/**
 * 고객의 프로젝트 목록 조회
 */
export async function getClientProjects(
  clientId: string
): Promise<BillingQueryResult<BillingProject[]>> {
  try {
    const db = getFirebaseFirestore();
    const q = query(
      collection(db, CLIENTS_COLLECTION, clientId, PROJECTS_SUBCOLLECTION),
      orderBy('createdAt', 'desc')
    );
    const snapshot = await withTimeout(getDocs(q), 5000);

    const projects = snapshot.docs.map((d) =>
      projectFromFirestore(d.id, clientId, d.data())
    );
    return { success: true, data: projects };
  } catch (error) {
    logger.error('프로젝트 목록 조회 실패:', error);
    return { success: false, error: '프로젝트 목록을 불러오는데 실패했습니다.' };
  }
}

/**
 * 프로젝트 생성
 */
export async function createProject(
  clientId: string,
  data: Omit<BillingProject, 'id' | 'clientId' | 'createdAt' | 'updatedAt'>
): Promise<BillingQueryResult<string>> {
  try {
    const db = getFirebaseFirestore();
    const now = Timestamp.now();

    const docRef = await addDoc(
      collection(db, CLIENTS_COLLECTION, clientId, PROJECTS_SUBCOLLECTION),
      {
        ...data,
        clientId,
        createdAt: now,
        updatedAt: now,
      }
    );

    return { success: true, data: docRef.id };
  } catch (error) {
    logger.error('프로젝트 생성 실패:', error);
    return { success: false, error: '프로젝트 생성에 실패했습니다.' };
  }
}

/**
 * 프로젝트 수정
 */
export async function updateProject(
  clientId: string,
  projectId: string,
  data: Partial<BillingProject>
): Promise<BillingQueryResult<void>> {
  try {
    const db = getFirebaseFirestore();
    const docRef = doc(
      db,
      CLIENTS_COLLECTION,
      clientId,
      PROJECTS_SUBCOLLECTION,
      projectId
    );

    const { id: _id, clientId: _clientId, createdAt: _createdAt, ...rest } = data;
    const updateData: DocumentData = {
      ...rest,
      updatedAt: Timestamp.now(),
    };

    await updateDoc(docRef, updateData);
    return { success: true };
  } catch (error) {
    logger.error('프로젝트 수정 실패:', error);
    return { success: false, error: '프로젝트 수정에 실패했습니다.' };
  }
}
