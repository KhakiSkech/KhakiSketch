/**
 * Node.js에서 실행 가능한 Firestore 마이그레이션 스크립트
 *
 * 사용법: node scripts/run-migration.mjs
 */

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, doc, setDoc, writeBatch } from 'firebase/firestore';

// Firebase 설정
const firebaseConfig = {
  apiKey: "AIzaSyBLnZyR3MJ3pP_quC8HDcRNUu6_-jNrsGQ",
  authDomain: "khaki-sketch-app.firebaseapp.com",
  projectId: "khaki-sketch-app",
  storageBucket: "khaki-sketch-app.firebasestorage.app",
  messagingSenderId: "429926937870",
  appId: "1:429926937870:web:d46b253a2b368b2cdfd35f"
};

// Firebase 초기화
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// 프로젝트 데이터
const projects = [
  {
    id: 'crypto-dashboard',
    title: '다전략 암호화폐 리포트 대시보드',
    description: '전략별 수익률·MDD 실시간 시각화 및 포지션 모니터링',
    category: '트레이딩',
    duration: '3개월',
    teamSize: '2명',
    featured: true,
    status: 'PROTOTYPE',
    techStack: ['React', 'TypeScript', 'Recharts', 'Tailwind CSS'],
    thumbnail: '/images/portfolio/crypto-dashboard.png',
    overview: '다양한 암호화폐 투자 전략의 성과를 실시간으로 모니터링하고 분석할 수 있는 대시보드입니다.',
    challenges: ['실시간 데이터 처리', '복잡한 차트 시각화', '다양한 전략 지표 계산'],
    solutions: ['WebSocket을 통한 실시간 데이터 스트리밍', 'Recharts 기반 커스텀 차트 컴포넌트', '효율적인 지표 계산 알고리즘'],
    results: ['투자 의사결정 시간 50% 단축', '전략 성과 분석 자동화', '리스크 관리 효율성 향상'],
  },
  {
    id: 'landscape-erp',
    title: '조경 시공사 자재 관리 ERP',
    description: '엑셀 업무를 웹으로 전환하여 자재 발주 시간 40% 단축',
    category: '업무 자동화',
    duration: '2개월',
    teamSize: '1-2명',
    featured: true,
    status: 'SAMPLE',
    techStack: ['Next.js', 'React', 'TypeScript', 'Tailwind CSS'],
    thumbnail: '/images/portfolio/landscape-erp.png',
    overview: '조경 시공사의 자재 관리, 발주, 재고 추적을 위한 통합 ERP 시스템입니다.',
    challenges: ['복잡한 엑셀 업무 프로세스 분석', '다양한 자재 카테고리 관리', '발주 워크플로우 자동화'],
    solutions: ['단계별 업무 프로세스 웹 시스템화', '체계적인 자재 분류 체계 구축', '자동 발주 알림 및 승인 시스템'],
    results: ['자재 발주 시간 40% 단축', '재고 파악 정확도 95% 이상', '월간 관리 비용 30% 절감'],
  },
  {
    id: 'healthcare-mvp',
    title: '초기 창업팀 헬스케어 플랫폼',
    description: '3개월 만에 MVP 런칭 후 시드 투자 유치 성공',
    category: 'MVP',
    duration: '3개월',
    teamSize: '3명 팀',
    featured: true,
    status: 'SAMPLE',
    techStack: ['React Native (Web)', 'TypeScript', 'Redux'],
    thumbnail: '/images/portfolio/healthcare-mvp.png',
    overview: '개인 건강 관리와 전문가 상담을 연결하는 헬스케어 플랫폼입니다.',
    challenges: ['빠른 MVP 개발 일정', '복잡한 예약 시스템', '의료 데이터 보안'],
    solutions: ['핵심 기능 중심의 MVP 전략', '직관적인 예약 UI/UX', '암호화 및 접근 제어 구현'],
    results: ['3개월 내 MVP 런칭', '시드 투자 유치 성공', '초기 사용자 500명 확보'],
  },
  {
    id: 'logistics-dashboard',
    title: '물류 기업 실시간 배송 추적 시스템',
    description: '차량 위치, 배송 상태를 실시간으로 모니터링하는 통합 대시보드',
    category: '업무 자동화',
    duration: '2.5개월',
    teamSize: '2-3명',
    featured: false,
    status: 'SAMPLE',
    techStack: ['React', 'TypeScript', 'Mapbox', 'Chart.js', 'Tailwind CSS'],
    thumbnail: '/images/portfolio/logistics-dashboard.png',
    overview: '물류 기업의 배송 차량 위치와 배송 상태를 실시간으로 모니터링하는 시스템입니다.',
    challenges: ['실시간 위치 추적', '대량의 배송 데이터 처리', '직관적인 지도 시각화'],
    solutions: ['GPS 데이터 실시간 처리', '효율적인 데이터 구조 설계', 'Mapbox 기반 커스텀 지도'],
    results: ['배송 지연 감소 25%', '고객 문의 대응 시간 50% 단축', '운영 효율성 30% 향상'],
  },
];

// 블로그 글 데이터
const articles = [
  {
    slug: 'startup-mvp-checklist',
    title: '스타트업 MVP 개발, 이것만 체크하세요',
    excerpt: '예비창업자를 위한 MVP 개발 전 필수 체크리스트. 기능 범위 설정부터 기술 스택 선택까지.',
    category: '가이드',
    readTime: '7분',
    publishedAt: '2025-01-10',
    featured: true,
    tags: ['MVP', '스타트업', '개발전략'],
    thumbnail: '/images/blog/mvp-checklist.png',
    content: `# 스타트업 MVP 개발 체크리스트

## 1. 핵심 기능 정의
MVP는 Minimum Viable Product입니다. 최소한의 기능으로 시장 검증이 목표입니다.

## 2. 기술 스택 선택
빠른 개발과 확장성을 모두 고려해야 합니다.

## 3. 일정 계획
현실적인 일정 설정이 중요합니다.`,
  },
  {
    slug: 'discovery-session-guide',
    title: 'Discovery 세션이란? 개발 전 기획의 중요성',
    excerpt: '요구사항 정의서 없이 개발을 시작하면 안 되는 이유. Discovery 세션의 진행 방식과 기대 효과.',
    category: '인사이트',
    readTime: '5분',
    publishedAt: '2025-01-05',
    featured: true,
    tags: ['Discovery', '기획', '요구사항정의'],
    thumbnail: '/images/blog/discovery-session.png',
    content: `# Discovery 세션 가이드

## Discovery 세션이란?
프로젝트 시작 전 요구사항을 명확히 하는 과정입니다.

## 왜 필요한가요?
명확한 요구사항 없이 시작하면 재작업이 발생합니다.

## 진행 방식
1. 비즈니스 목표 파악
2. 사용자 시나리오 정의
3. 기능 우선순위 결정`,
  },
  {
    slug: 'automation-roi',
    title: '업무 자동화 ROI 계산하는 법',
    excerpt: '반복 업무를 자동화하면 얼마나 절약되나요? 실제 ROI 계산 방법과 자동화 우선순위 결정 가이드.',
    category: '가이드',
    readTime: '6분',
    publishedAt: '2024-12-20',
    featured: false,
    tags: ['자동화', 'ROI', '업무효율'],
    thumbnail: '/images/blog/automation-roi.png',
    content: `# 업무 자동화 ROI 계산

## ROI 계산 공식
ROI = (절감 비용 - 투자 비용) / 투자 비용 × 100

## 절감 비용 산정
- 시간 절약 × 시간당 인건비
- 오류 감소로 인한 비용 절감
- 직원 만족도 향상`,
  },
];

// 프로젝트 마이그레이션
async function migrateProjects() {
  try {
    const batch = writeBatch(db);
    let count = 0;

    for (const project of projects) {
      const docRef = doc(collection(db, 'projects'), project.id);
      batch.set(docRef, {
        ...project,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
      count++;
    }

    await batch.commit();
    console.log(`✅ ${count}개의 프로젝트가 마이그레이션되었습니다.`);
    return { success: true, count };
  } catch (error) {
    console.error('❌ 프로젝트 마이그레이션 실패:', error);
    return { success: false, count: 0, error: String(error) };
  }
}

// 글 마이그레이션
async function migrateArticles() {
  try {
    const batch = writeBatch(db);
    let count = 0;

    for (const article of articles) {
      const docRef = doc(collection(db, 'articles'), article.slug);
      batch.set(docRef, {
        ...article,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
      count++;
    }

    await batch.commit();
    console.log(`✅ ${count}개의 글이 마이그레이션되었습니다.`);
    return { success: true, count };
  } catch (error) {
    console.error('❌ 글 마이그레이션 실패:', error);
    return { success: false, count: 0, error: String(error) };
  }
}

// 사이트 설정 마이그레이션
async function migrateSiteSettings() {
  try {
    // Stats
    await setDoc(doc(db, 'site-settings', 'stats'), {
      completedProjects: 50,
      customerSatisfaction: 98,
      repeatCustomerRate: 85,
      averageProjectDuration: 4,
      updatedAt: new Date().toISOString(),
    });

    // FAQ
    await setDoc(doc(db, 'site-settings', 'faq'), {
      items: [
        {
          id: 'faq-1',
          category: 'GENERAL',
          question: '프로젝트 진행 기간은 얼마나 걸리나요?',
          answer: 'MVP의 경우 보통 4-8주, 복잡한 프로젝트는 2-3개월 정도 소요됩니다.',
        },
        {
          id: 'faq-2',
          category: 'PRICING',
          question: '견적은 어떻게 산정되나요?',
          answer: '기능 복잡도, 디자인 수준, 개발 기간을 종합적으로 고려하여 산정합니다.',
        },
      ],
      updatedAt: new Date().toISOString(),
    });

    // Testimonials
    await setDoc(doc(db, 'site-settings', 'testimonials'), {
      items: [
        {
          id: 'testimonial-1',
          content: '빠른 개발 속도와 높은 품질에 만족합니다.',
          author: '김대표',
          role: 'CEO',
          company: '스타트업 A',
        },
      ],
      updatedAt: new Date().toISOString(),
    });

    console.log('✅ 사이트 설정이 마이그레이션되었습니다.');
    return { success: true };
  } catch (error) {
    console.error('❌ 사이트 설정 마이그레이션 실패:', error);
    return { success: false, error: String(error) };
  }
}

// 실행
async function main() {
  console.log('🚀 Firestore 마이그레이션 시작...\n');

  const projectsResult = await migrateProjects();
  const articlesResult = await migrateArticles();
  const settingsResult = await migrateSiteSettings();

  console.log('\n📊 마이그레이션 결과:');
  console.log(`- 프로젝트: ${projectsResult.success ? '✅' : '❌'} (${projectsResult.count}개)`);
  console.log(`- 글: ${articlesResult.success ? '✅' : '❌'} (${articlesResult.count}개)`);
  console.log(`- 사이트 설정: ${settingsResult.success ? '✅' : '❌'}`);

  process.exit(0);
}

main();
