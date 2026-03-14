// Firestore Quote Leads Service
import { logger } from './logger';

import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  where,
  Timestamp,
  DocumentData,
  QueryConstraint,
  arrayUnion,
  writeBatch,
} from 'firebase/firestore';
import { getFirebaseFirestore } from './firebase';
import { withTimeout } from './utils';
import { QuoteLead, LeadStatus, LeadPriority, LeadSource, LeadNote, LeadActivity, LeadTodo, TodoStatus, QuoteEmail, QuoteEmailStatus, CustomerStats } from '@/types/admin';

const LEADS_COLLECTION = 'quote-leads';

interface QueryResult<T> {
  success: boolean;
  data?: T;
  error?: string;
}

/**
 * QuoteLead 문서를 Firestore 데이터로 변환
 */
function toFirestoreData(lead: Omit<QuoteLead, 'id'>): DocumentData {
  return {
    ...lead,
    createdAt: Timestamp.fromDate(new Date(lead.createdAt)),
    updatedAt: Timestamp.fromDate(new Date(lead.updatedAt)),
    contactedAt: lead.contactedAt ? Timestamp.fromDate(new Date(lead.contactedAt)) : null,
    quotedAt: lead.quotedAt ? Timestamp.fromDate(new Date(lead.quotedAt)) : null,
    closedAt: lead.closedAt ? Timestamp.fromDate(new Date(lead.closedAt)) : null,
  };
}

/**
 * Firestore 문서를 QuoteLead로 변환
 */
function fromFirestoreData(docId: string, data: DocumentData): QuoteLead {
  const convertTimestamp = (ts: Timestamp | null | undefined) => {
    if (!ts) return undefined;
    if (typeof ts.toDate === 'function') {
      return ts.toDate().toISOString();
    }
    return typeof ts === 'string' ? ts : undefined;
  };

  return {
    id: docId,
    projectType: data.projectType || '',
    projectTypeOther: data.projectTypeOther,
    projectName: data.projectName || '',
    projectSummary: data.projectSummary || '',
    projectDescription: data.projectDescription || '',
    projectGoal: data.projectGoal || '',
    projectTags: data.projectTags || [],
    referenceUrl: data.referenceUrl,
    isGovernmentFunded: data.isGovernmentFunded || false,
    targetExchanges: data.targetExchanges || [],
    platforms: data.platforms || [],
    currentStage: data.currentStage || 'idea',
    features: data.features || [],
    techStack: data.techStack || [],
    budget: data.budget || '',
    timeline: data.timeline || '',
    customerName: data.customerName || '',
    company: data.company,
    email: data.email || '',
    phone: data.phone || '',
    preferredContact: data.preferredContact || [],
    status: data.status || 'NEW',
    priority: data.priority || 'MEDIUM',
    assignedTo: data.assignedTo,
    source: data.source || 'WEBSITE',
    ipAddress: data.ipAddress,
    userAgent: data.userAgent,
    referrer: data.referrer,
    landingPage: data.landingPage || '',
    createdAt: convertTimestamp(data.createdAt) || new Date().toISOString(),
    updatedAt: convertTimestamp(data.updatedAt) || new Date().toISOString(),
    contactedAt: convertTimestamp(data.contactedAt),
    quotedAt: convertTimestamp(data.quotedAt),
    closedAt: convertTimestamp(data.closedAt),
    notes: data.notes || [],
    activities: data.activities || [],
  };
}

/**
 * 모든 견적 리드 조회
 */
export async function getAllLeads(
  filters?: {
    status?: LeadStatus;
    priority?: LeadPriority;
    source?: LeadSource;
    assignedTo?: string;
  }
): Promise<QueryResult<QuoteLead[]>> {
  try {
    const db = getFirebaseFirestore();
    const constraints: QueryConstraint[] = [orderBy('createdAt', 'desc')];
    
    if (filters?.status) {
      constraints.push(where('status', '==', filters.status));
    }
    if (filters?.priority) {
      constraints.push(where('priority', '==', filters.priority));
    }
    if (filters?.source) {
      constraints.push(where('source', '==', filters.source));
    }
    if (filters?.assignedTo) {
      constraints.push(where('assignedTo', '==', filters.assignedTo));
    }

    const q = query(collection(db, LEADS_COLLECTION), ...constraints);
    const snapshot = await withTimeout(getDocs(q), 5000);
    
    const leads = snapshot.docs.map((doc) => fromFirestoreData(doc.id, doc.data()));
    return { success: true, data: leads };
  } catch (error) {
    logger.error('Error fetching leads:', error);
    return { success: false, error: '리드 목록을 불러오는데 실패했습니다.' };
  }
}

/**
 * 특정 리드 조회
 */
export async function getLeadById(id: string): Promise<QueryResult<QuoteLead>> {
  try {
    const db = getFirebaseFirestore();
    const docRef = doc(db, LEADS_COLLECTION, id);
    const docSnap = await withTimeout(getDoc(docRef), 5000);

    if (!docSnap.exists()) {
      return { success: false, error: '리드를 찾을 수 없습니다.' };
    }

    const lead = fromFirestoreData(docSnap.id, docSnap.data());
    return { success: true, data: lead };
  } catch (error) {
    logger.error('Error fetching lead:', error);
    return { success: false, error: '리드를 불러오는데 실패했습니다.' };
  }
}

/**
 * 새 리드 생성
 */
export async function createLead(
  data: Omit<QuoteLead, 'id' | 'createdAt' | 'updatedAt' | 'notes' | 'activities'>
): Promise<QueryResult<string>> {
  try {
    const db = getFirebaseFirestore();
    const now = new Date().toISOString();
    
    const leadData = toFirestoreData({
      ...data,
      createdAt: now,
      updatedAt: now,
      notes: [],
      activities: [{
        id: crypto.randomUUID(),
        type: 'STATUS_CHANGE',
        description: '새로운 견적이 접수되었습니다.',
        createdBy: 'system',
        createdAt: now,
      }],
    });

    const docRef = await addDoc(collection(db, LEADS_COLLECTION), leadData);
    return { success: true, data: docRef.id };
  } catch (error) {
    logger.error('Error creating lead:', error);
    return { success: false, error: '리드 생성에 실패했습니다.' };
  }
}

/**
 * 리드 업데이트
 */
export async function updateLead(
  id: string,
  updates: Partial<QuoteLead>
): Promise<QueryResult<void>> {
  try {
    const db = getFirebaseFirestore();
    const docRef = doc(db, LEADS_COLLECTION, id);
    
    const { id: _id, ...rest } = updates;
    const updateData: DocumentData = {
      ...rest,
      updatedAt: Timestamp.now(),
    };

    // Timestamp 변환
    if (updates.createdAt) {
      updateData.createdAt = Timestamp.fromDate(new Date(updates.createdAt));
    }
    if (updates.contactedAt) {
      updateData.contactedAt = Timestamp.fromDate(new Date(updates.contactedAt));
    }
    if (updates.quotedAt) {
      updateData.quotedAt = Timestamp.fromDate(new Date(updates.quotedAt));
    }
    if (updates.closedAt) {
      updateData.closedAt = Timestamp.fromDate(new Date(updates.closedAt));
    }

    await updateDoc(docRef, updateData);
    return { success: true };
  } catch (error) {
    logger.error('Error updating lead:', error);
    return { success: false, error: '리드 업데이트에 실패했습니다.' };
  }
}

/**
 * 리드 삭제
 */
export async function deleteLead(id: string): Promise<QueryResult<void>> {
  try {
    const db = getFirebaseFirestore();
    await deleteDoc(doc(db, LEADS_COLLECTION, id));
    return { success: true };
  } catch (error) {
    logger.error('Error deleting lead:', error);
    return { success: false, error: '리드 삭제에 실패했습니다.' };
  }
}

/**
 * 리드 상태 변경
 */
export async function updateLeadStatus(
  id: string,
  newStatus: LeadStatus,
  userEmail: string
): Promise<QueryResult<void>> {
  try {
    const db = getFirebaseFirestore();
    const docRef = doc(db, LEADS_COLLECTION, id);
    const now = new Date().toISOString();

    const statusLabels: Record<LeadStatus, string> = {
      NEW: '접수',
      CONTACTED: '연락완료',
      QUOTED: '견적완료',
      NEGOTIATING: '협상중',
      WON: '계약완료',
      LOST: '계약실패',
      HOLD: '보류',
    };

    const activity: LeadActivity = {
      id: crypto.randomUUID(),
      type: 'STATUS_CHANGE',
      description: `상태가 '${statusLabels[newStatus]}'(으)로 변경되었습니다.`,
      createdBy: userEmail,
      createdAt: now,
    };

    const updateData: DocumentData = {
      status: newStatus,
      updatedAt: Timestamp.now(),
    };

    if (newStatus === 'CONTACTED') {
      updateData.contactedAt = Timestamp.now();
    } else if (newStatus === 'QUOTED') {
      updateData.quotedAt = Timestamp.now();
    } else if (newStatus === 'WON' || newStatus === 'LOST') {
      updateData.closedAt = Timestamp.now();
    }

    const batch = writeBatch(db);

    // 상태 업데이트
    batch.update(docRef, updateData);

    // 활동 로그도 같은 배치에 추가
    batch.update(docRef, {
      activities: arrayUnion(activity),
      updatedAt: Timestamp.now(),
    });

    await batch.commit();

    return { success: true };
  } catch (error) {
    logger.error('Error updating lead status:', error);
    return { success: false, error: '상태 변경에 실패했습니다.' };
  }
}

/**
 * 노트 추가
 */
export async function addLeadNote(
  leadId: string,
  content: string,
  userEmail: string
): Promise<QueryResult<void>> {
  try {
    const db = getFirebaseFirestore();
    const docRef = doc(db, LEADS_COLLECTION, leadId);
    
    const note: LeadNote = {
      id: crypto.randomUUID(),
      content,
      createdBy: userEmail,
      createdAt: new Date().toISOString(),
    };

    await updateDoc(docRef, {
      notes: arrayUnion(note),
      updatedAt: Timestamp.now(),
    });

    return { success: true };
  } catch (error) {
    logger.error('Error adding note:', error);
    return { success: false, error: '노트 추가에 실패했습니다.' };
  }
}

/**
 * 활동 로그 추가
 */
export async function addLeadActivity(
  leadId: string,
  activity: LeadActivity
): Promise<QueryResult<void>> {
  try {
    const db = getFirebaseFirestore();
    const docRef = doc(db, LEADS_COLLECTION, leadId);

    await updateDoc(docRef, {
      activities: arrayUnion(activity),
      updatedAt: Timestamp.now(),
    });

    return { success: true };
  } catch (error) {
    logger.error('Error adding activity:', error);
    return { success: false, error: '활동 로그 추가에 실패했습니다.' };
  }
}

/**
 * 리드 통계 조회
 */
export async function getLeadStats(): Promise<QueryResult<{
  total: number;
  byStatus: Record<LeadStatus, number>;
  byPriority: Record<LeadPriority, number>;
  thisMonth: number;
}>> {
  try {
    const db = getFirebaseFirestore();
    const snapshot = await withTimeout(getDocs(collection(db, LEADS_COLLECTION)), 5000);
    
    const leads = snapshot.docs.map((doc) => fromFirestoreData(doc.id, doc.data()));
    
    const now = new Date();
    const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    const byStatus: Record<LeadStatus, number> = {
      NEW: 0, CONTACTED: 0, QUOTED: 0, NEGOTIATING: 0, WON: 0, LOST: 0, HOLD: 0,
    };
    
    const byPriority: Record<LeadPriority, number> = {
      LOW: 0, MEDIUM: 0, HIGH: 0, URGENT: 0,
    };

    let thisMonth = 0;

    leads.forEach((lead) => {
      byStatus[lead.status]++;
      byPriority[lead.priority]++;
      
      const createdDate = new Date(lead.createdAt);
      if (createdDate >= thisMonthStart) {
        thisMonth++;
      }
    });

    return {
      success: true,
      data: {
        total: leads.length,
        byStatus,
        byPriority,
        thisMonth,
      },
    };
  } catch (error) {
    logger.error('Error fetching lead stats:', error);
    return { success: false, error: '통계 조회에 실패했습니다.' };
  }
}

// ===== Todos (할 일) =====

const TODOS_COLLECTION = 'lead-todos';

/**
 * 리드의 할 일 목록 조회
 */
export async function getLeadTodos(leadId: string): Promise<QueryResult<LeadTodo[]>> {
  try {
    const db = getFirebaseFirestore();
    const q = query(
      collection(db, TODOS_COLLECTION),
      where('leadId', '==', leadId),
      orderBy('dueDate', 'asc')
    );

    const snapshot = await withTimeout(getDocs(q), 5000);
    const todos = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as LeadTodo[];

    return { success: true, data: todos };
  } catch (error) {
    logger.error('Error fetching todos:', error);
    return { success: false, error: '할 일 조회에 실패했습니다.' };
  }
}

/**
 * 오늘 마감인 할 일 조회
 */
export async function getTodayTodos(): Promise<QueryResult<LeadTodo[]>> {
  try {
    const db = getFirebaseFirestore();
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const q = query(
      collection(db, TODOS_COLLECTION),
      where('dueDate', '>=', today.toISOString()),
      where('dueDate', '<', tomorrow.toISOString()),
      where('status', 'in', ['PENDING', 'IN_PROGRESS']),
      orderBy('dueDate', 'asc')
    );

    const snapshot = await withTimeout(getDocs(q), 5000);
    const todos = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as LeadTodo[];

    return { success: true, data: todos };
  } catch (error) {
    logger.error('Error fetching today todos:', error);
    return { success: false, error: '오늘의 할 일 조회에 실패했습니다.' };
  }
}

/**
 * 할 일 생성
 */
export async function createTodo(
  todo: Omit<LeadTodo, 'id' | 'createdAt' | 'updatedAt'>
): Promise<QueryResult<string>> {
  try {
    const db = getFirebaseFirestore();
    const now = new Date().toISOString();
    
    const docRef = await addDoc(collection(db, TODOS_COLLECTION), {
      ...todo,
      createdAt: now,
      updatedAt: now,
    });

    return { success: true, data: docRef.id };
  } catch (error) {
    logger.error('Error creating todo:', error);
    return { success: false, error: '할 일 생성에 실패했습니다.' };
  }
}

/**
 * 할 일 업데이트
 */
export async function updateTodo(
  id: string,
  updates: Partial<LeadTodo>
): Promise<QueryResult<void>> {
  try {
    const db = getFirebaseFirestore();
    const docRef = doc(db, TODOS_COLLECTION, id);
    
    await updateDoc(docRef, {
      ...updates,
      updatedAt: new Date().toISOString(),
    });

    return { success: true };
  } catch (error) {
    logger.error('Error updating todo:', error);
    return { success: false, error: '할 일 업데이트에 실패했습니다.' };
  }
}

/**
 * 할 일 완료 처리
 */
export async function completeTodo(
  id: string
): Promise<QueryResult<void>> {
  try {
    const db = getFirebaseFirestore();
    const docRef = doc(db, TODOS_COLLECTION, id);
    
    await updateDoc(docRef, {
      status: 'COMPLETED',
      completedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    return { success: true };
  } catch (error) {
    logger.error('Error completing todo:', error);
    return { success: false, error: '할 일 완료 처리에 실패했습니다.' };
  }
}

/**
 * 할 일 삭제
 */
export async function deleteTodo(id: string): Promise<QueryResult<void>> {
  try {
    const db = getFirebaseFirestore();
    await deleteDoc(doc(db, TODOS_COLLECTION, id));
    return { success: true };
  } catch (error) {
    logger.error('Error deleting todo:', error);
    return { success: false, error: '할 일 삭제에 실패했습니다.' };
  }
}

// ===== Quote Emails (견적서 발송) =====

const QUOTE_EMAILS_COLLECTION = 'quote-emails';

/**
 * 리드의 견적서 이메일 목록 조회
 */
export async function getLeadQuoteEmails(leadId: string): Promise<QueryResult<QuoteEmail[]>> {
  try {
    const db = getFirebaseFirestore();
    const q = query(
      collection(db, QUOTE_EMAILS_COLLECTION),
      where('leadId', '==', leadId),
      orderBy('createdAt', 'desc')
    );

    const snapshot = await withTimeout(getDocs(q), 5000);
    const emails = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as QuoteEmail[];

    return { success: true, data: emails };
  } catch (error) {
    logger.error('Error fetching quote emails:', error);
    return { success: false, error: '견적서 조회에 실패했습니다.' };
  }
}

/**
 * 견적서 이메일 생성
 */
export async function createQuoteEmail(
  email: Omit<QuoteEmail, 'id' | 'createdAt' | 'updatedAt'>
): Promise<QueryResult<string>> {
  try {
    const db = getFirebaseFirestore();
    const now = new Date().toISOString();
    
    const docRef = await addDoc(collection(db, QUOTE_EMAILS_COLLECTION), {
      ...email,
      createdAt: now,
      updatedAt: now,
    });

    return { success: true, data: docRef.id };
  } catch (error) {
    logger.error('Error creating quote email:', error);
    return { success: false, error: '견적서 생성에 실패했습니다.' };
  }
}

/**
 * 견적서 발송
 */
export async function sendQuoteEmail(
  id: string,
  userEmail: string
): Promise<QueryResult<void>> {
  try {
    const db = getFirebaseFirestore();
    const docRef = doc(db, QUOTE_EMAILS_COLLECTION, id);
    const now = new Date().toISOString();
    
    await updateDoc(docRef, {
      status: 'SENT',
      sentAt: now,
      updatedAt: now,
    });

    // 리드 활동 로그 추가
    const emailDoc = await getDoc(docRef);
    if (emailDoc.exists()) {
      const emailData = emailDoc.data() as QuoteEmail;
      await addLeadActivity(emailData.leadId, {
        id: crypto.randomUUID(),
        type: 'QUOTE_SENT',
        description: `견적서가 발송되었습니다. (금액: ${emailData.grandTotal.toLocaleString()}원)`,
        createdBy: userEmail,
        createdAt: now,
      });
    }

    return { success: true };
  } catch (error) {
    logger.error('Error sending quote email:', error);
    return { success: false, error: '견적서 발송에 실패했습니다.' };
  }
}

// ===== Customer Stats (고객 통계) =====

/**
 * 고객별 통계 조회
 */
export async function getCustomerStats(email: string): Promise<QueryResult<CustomerStats>> {
  try {
    const db = getFirebaseFirestore();
    
    // 해당 이메일의 모든 리드 조회
    const q = query(
      collection(db, LEADS_COLLECTION),
      where('email', '==', email)
    );

    const snapshot = await withTimeout(getDocs(q), 5000);
    const leads = snapshot.docs.map((doc) => fromFirestoreData(doc.id, doc.data()));

    if (leads.length === 0) {
      return { success: false, error: '고객을 찾을 수 없습니다.' };
    }

    // 통계 계산
    const totalLeads = leads.length;
    const totalContracts = leads.filter((l) => l.status === 'WON').length;
    const totalContractAmount = leads
      .filter((l) => l.status === 'WON')
      .reduce((sum, l) => {
        // 예산 문자열에서 숫자 추출 (예: "500~1,000만원" → 평균값 사용)
        // 먼저 쉼표를 제거한 뒤 숫자 추출
        const cleanBudget = l.budget.replace(/,/g, '');
        const budgetMatch = cleanBudget.match(/(\d+)/g);
        if (budgetMatch) {
          const values = budgetMatch.map(Number);
          const avg = values.reduce((a, b) => a + b, 0) / values.length;
          return sum + avg * 10000; // 만원 단위
        }
        return sum;
      }, 0);

    const successRate = Math.round((totalContracts / totalLeads) * 100);

    // 견적서 조회
    const quoteEmailsPromises = leads.map((l) => getLeadQuoteEmails(l.id));
    const quoteEmailsResults = await Promise.all(quoteEmailsPromises);
    const totalQuotes = quoteEmailsResults.reduce(
      (sum, result) => sum + (result.success && result.data ? result.data.length : 0),
      0
    );

    // 날짜 계산
    const dates = leads.map((l) => new Date(l.createdAt));
    const firstContactDate = new Date(Math.min(...dates.map((d) => d.getTime()))).toISOString();
    const lastContactDate = new Date(Math.max(...dates.map((d) => d.getTime()))).toISOString();

    const stats: CustomerStats = {
      customerEmail: email,
      customerName: leads[0].customerName,
      company: leads[0].company,
      totalLeads,
      totalQuotes,
      totalContracts,
      totalContractAmount,
      successRate,
      averageResponseTime: 0, // TODO: 구현
      firstContactDate,
      lastContactDate,
      leadIds: leads.map((l) => l.id),
    };

    return { success: true, data: stats };
  } catch (error) {
    logger.error('Error fetching customer stats:', error);
    return { success: false, error: '고객 통계 조회에 실패했습니다.' };
  }
}
