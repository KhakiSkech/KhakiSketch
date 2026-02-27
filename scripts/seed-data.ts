import { logger } from '@/lib/logger';
// 테스트 데이터 생성 스크립트
// Firestore에 샘플 견적 데이터를 생성합니다

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, Timestamp } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const sampleLeads = [
  {
    projectType: 'MVP 개발',
    projectName: '스타트업 MVP 플랫폼',
    projectSummary: '예약 관리 시스템 개발',
    projectDescription: '고객 예약을 관리하고 알림을 별내는 웹 플랫폼',
    projectGoal: '자동화된 예약 시스템 구축',
    projectTags: ['예약', '알림', '관리자'],
    referenceUrl: 'https://example.com',
    isGovernmentFunded: false,
    platforms: ['Web', 'Mobile'],
    currentStage: 'planning',
    features: ['회원가입', '예약', '알림', '결제'],
    techStack: ['React', 'Node.js', 'Firebase'],
    budget: '1000-3000만원',
    timeline: '2-3개월',
    customerName: '김철수',
    company: '테크스타트업',
    email: 'kim@example.com',
    phone: '010-1234-5678',
    preferredContact: ['email', 'phone'],
    status: 'NEW',
    priority: 'HIGH',
    assignedTo: 'songjc6561@gmail.com',
    source: 'WEBSITE',
    landingPage: 'https://khakisketch.com/quote',
    createdAt: Timestamp.fromDate(new Date(Date.now() - 86400000 * 2)),
    updatedAt: Timestamp.fromDate(new Date(Date.now() - 86400000 * 2)),
    notes: [],
    activities: [
      {
        id: 'act-1',
        type: 'STATUS_CHANGE',
        description: '새로운 견적이 접수되었습니다.',
        createdBy: 'system',
        createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
      }
    ],
  },
  {
    projectType: '기업 웹사이트',
    projectName: '기업 홈페이지 리뉴얼',
    projectSummary: '반응형 기업 홈페이지 개발',
    projectDescription: '모던한 디자인의 반응형 기업 홈페이지',
    projectGoal: '브랜드 이미지 개선',
    projectTags: ['홈페이지', '반응형', '디자인'],
    isGovernmentFunded: false,
    platforms: ['Web'],
    currentStage: 'idea',
    features: ['메인페이지', '회사소개', '포트폴리오', '문의'],
    techStack: ['Next.js', 'Tailwind'],
    budget: '300-1000만원',
    timeline: '1개월 이내',
    customerName: '이영희',
    company: '디자인컴퍼니',
    email: 'lee@example.com',
    phone: '010-8765-4321',
    preferredContact: ['email'],
    status: 'CONTACTED',
    priority: 'MEDIUM',
    assignedTo: 'songjc6561@gmail.com',
    source: 'WEBSITE',
    landingPage: 'https://khakisketch.com/quote',
    contactedAt: Timestamp.fromDate(new Date(Date.now() - 86400000)),
    createdAt: Timestamp.fromDate(new Date(Date.now() - 86400000 * 3)),
    updatedAt: Timestamp.fromDate(new Date(Date.now() - 86400000)),
    notes: [
      {
        id: 'note-1',
        content: '첫 미팅 완료. 요구사항 정리됨.',
        createdBy: 'songjc6561@gmail.com',
        createdAt: new Date(Date.now() - 86400000).toISOString(),
      }
    ],
    activities: [
      {
        id: 'act-1',
        type: 'STATUS_CHANGE',
        description: '새로운 견적이 접수되었습니다.',
        createdBy: 'system',
        createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
      },
      {
        id: 'act-2',
        type: 'STATUS_CHANGE',
        description: "상태가 '연락완료'(으)로 변경되었습니다.",
        createdBy: 'songjc6561@gmail.com',
        createdAt: new Date(Date.now() - 86400000).toISOString(),
      },
      {
        id: 'act-3',
        type: 'NOTE',
        description: '노트가 추가되었습니다.',
        createdBy: 'songjc6561@gmail.com',
        createdAt: new Date(Date.now() - 86400000).toISOString(),
      }
    ],
  },
  {
    projectType: '업무 자동화',
    projectName: '인사관리 시스템',
    projectSummary: '낶은 업무 자동화 시스템',
    projectDescription: 'Excel 기반 인사관리를 웹 시스템으로 전환',
    projectGoal: '업무 효율화',
    projectTags: ['자동화', '인사', '관리'],
    isGovernmentFunded: true,
    platforms: ['Web'],
    currentStage: 'design_done',
    features: ['근태관리', '휴가관리', '급여계산', '리포트'],
    techStack: ['React', 'Python', 'PostgreSQL'],
    budget: '3000만원 이상',
    timeline: '3-6개월',
    customerName: '박민수',
    company: '중소기업A',
    email: 'park@example.com',
    phone: '010-5555-6666',
    preferredContact: ['phone', 'kakao'],
    status: 'QUOTED',
    priority: 'URGENT',
    assignedTo: 'songjc6561@gmail.com',
    source: 'REFERRAL',
    landingPage: 'https://khakisketch.com/quote',
    contactedAt: Timestamp.fromDate(new Date(Date.now() - 86400000 * 2)),
    quotedAt: Timestamp.fromDate(new Date(Date.now() - 86400000)),
    createdAt: Timestamp.fromDate(new Date(Date.now() - 86400000 * 5)),
    updatedAt: Timestamp.fromDate(new Date(Date.now() - 86400000)),
    notes: [],
    activities: [
      {
        id: 'act-1',
        type: 'STATUS_CHANGE',
        description: '새로운 견적이 접수되었습니다.',
        createdBy: 'system',
        createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
      },
      {
        id: 'act-2',
        type: 'STATUS_CHANGE',
        description: "상태가 '연락완료'(으)로 변경되었습니다.",
        createdBy: 'songjc6561@gmail.com',
        createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
      },
      {
        id: 'act-3',
        type: 'STATUS_CHANGE',
        description: "상태가 '견적완료'(으)로 변경되었습니다.",
        createdBy: 'songjc6561@gmail.com',
        createdAt: new Date(Date.now() - 86400000).toISOString(),
      }
    ],
  },
  {
    projectType: 'MVP 개발',
    projectName: '배달앱 MVP',
    projectSummary: '음식 배달 서비스 MVP',
    projectDescription: '간단한 음식 배달 서비스 MVP 개발',
    projectGoal: '시장 검증',
    projectTags: ['배달', '앱', 'MVP'],
    isGovernmentFunded: false,
    platforms: ['Mobile'],
    currentStage: 'idea',
    features: ['주문', '배달추적', '결제'],
    techStack: ['Flutter', 'Firebase'],
    budget: '1000-3000만원',
    timeline: '2-3개월',
    customerName: '최동훈',
    company: '푸드테크',
    email: 'choi@example.com',
    phone: '010-7777-8888',
    preferredContact: ['email'],
    status: 'WON',
    priority: 'HIGH',
    assignedTo: 'songjc6561@gmail.com',
    source: 'ADS',
    landingPage: 'https://khakisketch.com/quote',
    contactedAt: Timestamp.fromDate(new Date(Date.now() - 86400000 * 10)),
    quotedAt: Timestamp.fromDate(new Date(Date.now() - 86400000 * 7)),
    closedAt: Timestamp.fromDate(new Date(Date.now() - 86400000 * 5)),
    createdAt: Timestamp.fromDate(new Date(Date.now() - 86400000 * 15)),
    updatedAt: Timestamp.fromDate(new Date(Date.now() - 86400000 * 5)),
    notes: [
      {
        id: 'note-1',
        content: '계약 완료. 3월 시작 예정.',
        createdBy: 'songjc6561@gmail.com',
        createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
      }
    ],
    activities: [
      {
        id: 'act-1',
        type: 'STATUS_CHANGE',
        description: '새로운 견적이 접수되었습니다.',
        createdBy: 'system',
        createdAt: new Date(Date.now() - 86400000 * 15).toISOString(),
      },
      {
        id: 'act-2',
        type: 'STATUS_CHANGE',
        description: "상태가 '계약완료'(으)로 변경되었습니다.",
        createdBy: 'songjc6561@gmail.com',
        createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
      }
    ],
  },
  {
    projectType: '기업 웹사이트',
    projectName: '쇼핑몰 개발',
    projectSummary: '의류 쇼핑몰 웹사이트',
    projectDescription: '의류 판매를 위한 쇼핑몰 웹사이트',
    projectGoal: '온라인 판매 채널 구축',
    projectTags: ['쇼핑몰', 'e-commerce', '결제'],
    isGovernmentFunded: false,
    platforms: ['Web'],
    currentStage: 'planning',
    features: ['상품관리', '장바구니', '결제', '배송관리'],
    techStack: ['Next.js', 'Stripe'],
    budget: '1000-3000만원',
    timeline: '2-3개월',
    customerName: '정수진',
    company: '패션브랜드',
    email: 'jung@example.com',
    phone: '010-9999-0000',
    preferredContact: ['email', 'phone'],
    status: 'LOST',
    priority: 'MEDIUM',
    assignedTo: 'songjc6561@gmail.com',
    source: 'WEBSITE',
    landingPage: 'https://khakisketch.com/quote',
    contactedAt: Timestamp.fromDate(new Date(Date.now() - 86400000 * 8)),
    quotedAt: Timestamp.fromDate(new Date(Date.now() - 86400000 * 5)),
    closedAt: Timestamp.fromDate(new Date(Date.now() - 86400000 * 3)),
    createdAt: Timestamp.fromDate(new Date(Date.now() - 86400000 * 12)),
    updatedAt: Timestamp.fromDate(new Date(Date.now() - 86400000 * 3)),
    notes: [
      {
        id: 'note-1',
        content: '예산 문제로 계약 실패. 향후 재검토 예정.',
        createdBy: 'songjc6561@gmail.com',
        createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
      }
    ],
    activities: [
      {
        id: 'act-1',
        type: 'STATUS_CHANGE',
        description: '새로운 견적이 접수되었습니다.',
        createdBy: 'system',
        createdAt: new Date(Date.now() - 86400000 * 12).toISOString(),
      },
      {
        id: 'act-2',
        type: 'STATUS_CHANGE',
        description: "상태가 '계약실패'(으)로 변경되었습니다.",
        createdBy: 'songjc6561@gmail.com',
        createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
      }
    ],
  }
];

async function seedDatabase() {
  logger.info('🌱 테스트 데이터 생성 시작...');
  
  try {
    for (const lead of sampleLeads) {
      const docRef = await addDoc(collection(db, 'quote-leads'), lead);
      logger.info(`✅ Lead 생성 완료: ${docRef.id} - ${lead.customerName}`);
    }
    
    logger.info('✅ 모든 테스트 데이터 생성 완료!');
    logger.info(`📊 총 ${sampleLeads.length}개의 견적 데이터가 생성되었습니다.`);
  } catch (error) {
    logger.error('❌ 데이터 생성 실패:', error);
    process.exit(1);
  }
}

seedDatabase();
