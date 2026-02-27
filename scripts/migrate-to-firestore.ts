import { logger } from '@/lib/logger';
/**
 * 정적 데이터를 Firestore로 마이그레이션하는 스크립트
 *
 * 사용법:
 * 1. npm run dev로 개발 서버 시작
 * 2. /admin/settings 페이지 접속 후 로그인
 * 3. "데이터 마이그레이션" 섹션에서 버튼 클릭
 */

import { collection, doc, setDoc, writeBatch } from 'firebase/firestore';
import { getFirebaseFirestore } from '@/lib/firebase';
import { projects } from '@/data/projects';
import { articles } from '@/data/articles';

// 프로젝트 마이그레이션
export async function migrateProjects(): Promise<{ success: boolean; count: number; error?: string }> {
  try {
    const db = getFirebaseFirestore();
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
    logger.info(`✅ ${count}개의 프로젝트가 마이그레이션되었습니다.`);
    return { success: true, count };
  } catch (error) {
    logger.error('❌ 프로젝트 마이그레이션 실패:', error);
    return { success: false, count: 0, error: String(error) };
  }
}

// 글 마이그레이션
export async function migrateArticles(): Promise<{ success: boolean; count: number; error?: string }> {
  try {
    const db = getFirebaseFirestore();
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
    logger.info(`✅ ${count}개의 글이 마이그레이션되었습니다.`);
    return { success: true, count };
  } catch (error) {
    logger.error('❌ 글 마이그레이션 실패:', error);
    return { success: false, count: 0, error: String(error) };
  }
}

// 사이트 설정 기본값 마이그레이션
export async function migrateSiteSettings(): Promise<{ success: boolean; error?: string }> {
  try {
    const db = getFirebaseFirestore();

    // Stats
    await setDoc(doc(db, 'siteSettings', 'stats'), {
      completedProjects: 50,
      customerSatisfaction: 98,
      repeatCustomerRate: 85,
      averageProjectDuration: 4,
      updatedAt: new Date().toISOString(),
    });

    // FAQ (기본 예시)
    await setDoc(doc(db, 'siteSettings', 'faq'), {
      items: [
        {
          id: 'faq-1',
          category: 'GENERAL',
          question: '프로젝트 진행 기간은 얼마나 걸리나요?',
          answer: 'MVP의 경우 보통 4-8주, 복잡한 프로젝트는 2-3개월 정도 소요됩니다. 정확한 기간은 요구사항 분석 후 안내드립니다.',
        },
        {
          id: 'faq-2',
          category: 'PRICING',
          question: '견적은 어떻게 산정되나요?',
          answer: '기능 복잡도, 디자인 수준, 개발 기간을 종합적으로 고려하여 산정합니다. 무료 상담을 통해 정확한 견적을 받아보세요.',
        },
        {
          id: 'faq-3',
          category: 'PROCESS',
          question: '진행 과정에서 수정이 가능한가요?',
          answer: '네, 각 단계별로 피드백을 받고 수정합니다. 다만 기획 완료 후 대규모 변경은 추가 비용이 발생할 수 있습니다.',
        },
      ],
      updatedAt: new Date().toISOString(),
    });

    // Testimonials (기본 예시)
    await setDoc(doc(db, 'siteSettings', 'testimonials'), {
      items: [
        {
          id: 'testimonial-1',
          content: '빠른 개발 속도와 높은 품질에 만족합니다. MVP를 4주 만에 런칭할 수 있었습니다.',
          author: '김대표',
          role: 'CEO',
          company: '스타트업 A',
          projectType: 'MVP',
        },
        {
          id: 'testimonial-2',
          content: '업무 자동화 도입 후 매달 100시간 이상의 시간을 절약하고 있습니다.',
          author: '이팀장',
          role: '운영팀장',
          company: '기업 B',
          projectType: 'AUTOMATION',
        },
      ],
      updatedAt: new Date().toISOString(),
    });

    // Pricing (기본 예시)
    await setDoc(doc(db, 'siteSettings', 'pricing'), {
      plans: [
        {
          id: 'plan-mvp',
          name: 'MVP',
          description: '아이디어 검증을 위한 최소 기능 제품',
          price: '500만원~',
          duration: '4-8주',
          features: ['핵심 기능 개발', '반응형 디자인', '기본 관리자 페이지', '1개월 무료 유지보수'],
          recommended: true,
        },
        {
          id: 'plan-automation',
          name: '업무 자동화',
          description: '반복 업무를 자동화하여 효율 극대화',
          price: '300만원~',
          duration: '2-4주',
          features: ['프로세스 분석', '자동화 시스템 구축', 'API 연동', '매뉴얼 제공'],
          recommended: false,
        },
        {
          id: 'plan-website',
          name: '기업 웹사이트',
          description: '브랜드 이미지를 담은 전문적인 웹사이트',
          price: '200만원~',
          duration: '2-4주',
          features: ['맞춤 디자인', 'SEO 최적화', 'CMS 연동', '모바일 최적화'],
          recommended: false,
        },
      ],
      updatedAt: new Date().toISOString(),
    });

    logger.info('✅ 사이트 설정이 마이그레이션되었습니다.');
    return { success: true };
  } catch (error) {
    logger.error('❌ 사이트 설정 마이그레이션 실패:', error);
    return { success: false, error: String(error) };
  }
}

// 전체 마이그레이션
export async function migrateAll(): Promise<{
  projects: { success: boolean; count: number };
  articles: { success: boolean; count: number };
  siteSettings: { success: boolean };
}> {
  logger.info('🚀 마이그레이션 시작...');

  const projectsResult = await migrateProjects();
  const articlesResult = await migrateArticles();
  const siteSettingsResult = await migrateSiteSettings();

  logger.info('\n📊 마이그레이션 결과:');
  logger.info(`- 프로젝트: ${projectsResult.success ? '✅' : '❌'} (${projectsResult.count}개)`);
  logger.info(`- 글: ${articlesResult.success ? '✅' : '❌'} (${articlesResult.count}개)`);
  logger.info(`- 사이트 설정: ${siteSettingsResult.success ? '✅' : '❌'}`);

  return {
    projects: projectsResult,
    articles: articlesResult,
    siteSettings: siteSettingsResult,
  };
}
