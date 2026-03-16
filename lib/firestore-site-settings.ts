// Firestore Site Settings Service

import { logger } from './logger';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { getFirebaseFirestore } from './firebase';
import type {
  SiteStats,
  SiteFAQ,
  SiteTestimonials,
  SitePricing,
  SiteHeroImages,
  FAQItem,
  TestimonialItem,
  PricingPlan,
} from '@/types/admin';
import { withTimeout } from './utils';

const SITE_SETTINGS_COLLECTION = 'siteSettings';

// Document IDs
const STATS_DOC = 'stats';
const FAQ_DOC = 'faq';
const TESTIMONIALS_DOC = 'testimonials';
const PRICING_DOC = 'pricing';
const HERO_DOC = 'hero';

// ===== Stats =====

const DEFAULT_STATS: SiteStats = {
  completedProjects: 47,
  customerSatisfaction: 98,
  avgDeliveryTime: 45,
  repeatOrderRate: 73,
};

export async function getStats(): Promise<SiteStats> {
  try {
    const db = getFirebaseFirestore();
    const docRef = doc(db, SITE_SETTINGS_COLLECTION, STATS_DOC);
    const docSnap = await withTimeout(getDoc(docRef), 5000);

    if (docSnap.exists()) {
      return docSnap.data() as SiteStats;
    }
  } catch (error) {
    logger.warn('Stats 조회 실패, 기본값 사용:', error);
  }
  return DEFAULT_STATS;
}

export async function saveStats(
  stats: SiteStats
): Promise<{ success: boolean; error?: string }> {
  try {
    const db = getFirebaseFirestore();
    const docRef = doc(db, SITE_SETTINGS_COLLECTION, STATS_DOC);
    await setDoc(docRef, {
      ...stats,
      updatedAt: new Date().toISOString(),
    });
    return { success: true };
  } catch (error) {
    logger.error('Stats 저장 실패:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : '저장에 실패했습니다.',
    };
  }
}

// ===== FAQ =====

const DEFAULT_FAQ: SiteFAQ = {
  items: [
    {
      id: 'faq-1',
      category: 'PROCESS',
      question: '개발 기간은 얼마나 걸리나요?',
      answer:
        '프로젝트 규모에 따라 다르지만, 일반적인 MVP는 2-3개월, 업무 자동화 시스템은 1-2개월 정도 소요됩니다.',
      order: 1,
    },
    {
      id: 'faq-2',
      category: 'PRICING',
      question: '비용은 어떻게 책정되나요?',
      answer:
        'Discovery 세션을 통해 요구사항을 파악한 후, 기능별 상세 견적을 제공해드립니다. 예산에 맞게 범위를 조정하는 것도 가능합니다.',
      order: 2,
    },
    {
      id: 'faq-3',
      category: 'GENERAL',
      question: '미팅은 어떤 방식으로 진행되나요?',
      answer:
        '온라인 미팅(Zoom, Google Meet)으로 진행합니다. 서울 지역의 경우 오프라인 미팅도 가능합니다.',
      order: 3,
    },
  ],
};

export async function getFAQ(): Promise<SiteFAQ> {
  try {
    const db = getFirebaseFirestore();
    const docRef = doc(db, SITE_SETTINGS_COLLECTION, FAQ_DOC);
    const docSnap = await withTimeout(getDoc(docRef), 5000);

    if (docSnap.exists()) {
      return docSnap.data() as SiteFAQ;
    }
  } catch (error) {
    logger.warn('FAQ 조회 실패, 기본값 사용:', error);
  }
  return DEFAULT_FAQ;
}

export async function saveFAQ(
  faq: SiteFAQ
): Promise<{ success: boolean; error?: string }> {
  try {
    const db = getFirebaseFirestore();
    const docRef = doc(db, SITE_SETTINGS_COLLECTION, FAQ_DOC);
    await setDoc(docRef, {
      ...faq,
      updatedAt: new Date().toISOString(),
    });
    return { success: true };
  } catch (error) {
    logger.error('FAQ 저장 실패:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : '저장에 실패했습니다.',
    };
  }
}

export function generateFAQId(): string {
  return `faq-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
}

// ===== Testimonials =====

const DEFAULT_TESTIMONIALS: SiteTestimonials = {
  items: [
    {
      id: 'testimonial-1',
      content:
        '복잡한 업무 프로세스를 명확하게 정리해주시고, 예상보다 빠르게 시스템을 구축해주셨습니다.',
      author: '김대표',
      role: '대표',
      company: '조경시공사',
      projectType: '업무 자동화',
      rating: 5,
      order: 1,
    },
    {
      id: 'testimonial-2',
      content:
        'MVP를 빠르게 만들어서 투자 유치에 성공했습니다. 기능 범위 조절에 대한 조언이 큰 도움이 되었습니다.',
      author: '이CEO',
      role: 'CEO',
      company: '스타트업',
      projectType: 'MVP 개발',
      rating: 5,
      order: 2,
    },
  ],
};

export async function getTestimonials(): Promise<SiteTestimonials> {
  try {
    const db = getFirebaseFirestore();
    const docRef = doc(db, SITE_SETTINGS_COLLECTION, TESTIMONIALS_DOC);
    const docSnap = await withTimeout(getDoc(docRef), 5000);

    if (docSnap.exists()) {
      return docSnap.data() as SiteTestimonials;
    }
  } catch (error) {
    logger.warn('Testimonials 조회 실패, 기본값 사용:', error);
  }
  return DEFAULT_TESTIMONIALS;
}

export async function saveTestimonials(
  testimonials: SiteTestimonials
): Promise<{ success: boolean; error?: string }> {
  try {
    const db = getFirebaseFirestore();
    const docRef = doc(db, SITE_SETTINGS_COLLECTION, TESTIMONIALS_DOC);
    await setDoc(docRef, {
      ...testimonials,
      updatedAt: new Date().toISOString(),
    });
    return { success: true };
  } catch (error) {
    logger.error('Testimonials 저장 실패:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : '저장에 실패했습니다.',
    };
  }
}

export function generateTestimonialId(): string {
  return `testimonial-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
}

// ===== Pricing =====

const DEFAULT_PRICING: SitePricing = {
  plans: [
    {
      id: 'pricing-1',
      name: 'Discovery',
      description: '프로젝트 기획 및 설계',
      price: '20~30만원',
      priceNote: '개발 계약 시 전액 차감',
      features: [
        { text: '요구사항 정의서', included: true },
        { text: '화면 설계서', included: true },
        { text: '기술 스택 제안', included: true },
        { text: '상세 견적서', included: true },
      ],
      highlighted: false,
      ctaText: '상담 신청',
      order: 1,
    },
    {
      id: 'pricing-2',
      name: 'MVP 개발',
      description: '스타트업 초기 제품',
      price: '500~1,500만원',
      priceNote: '규모에 따라 상이',
      features: [
        { text: '핵심 기능 개발', included: true },
        { text: '반응형 웹/앱', included: true },
        { text: '기본 관리자 페이지', included: true },
        { text: '1개월 유지보수', included: true },
      ],
      highlighted: true,
      ctaText: '견적 받기',
      order: 2,
    },
    {
      id: 'pricing-3',
      name: '업무 자동화',
      description: '반복 업무 시스템화',
      price: '300~800만원',
      priceNote: '자동화 범위에 따라',
      features: [
        { text: '업무 프로세스 분석', included: true },
        { text: '자동화 시스템 구축', included: true },
        { text: '데이터 통합', included: true },
        { text: '사용자 교육', included: true },
      ],
      highlighted: false,
      ctaText: '문의하기',
      order: 3,
    },
  ],
};

export async function getPricing(): Promise<SitePricing> {
  try {
    const db = getFirebaseFirestore();
    const docRef = doc(db, SITE_SETTINGS_COLLECTION, PRICING_DOC);
    const docSnap = await withTimeout(getDoc(docRef), 5000);

    if (docSnap.exists()) {
      return docSnap.data() as SitePricing;
    }
  } catch (error) {
    logger.warn('Pricing 조회 실패, 기본값 사용:', error);
  }
  return DEFAULT_PRICING;
}

export async function savePricing(
  pricing: SitePricing
): Promise<{ success: boolean; error?: string }> {
  try {
    const db = getFirebaseFirestore();
    const docRef = doc(db, SITE_SETTINGS_COLLECTION, PRICING_DOC);
    await setDoc(docRef, {
      ...pricing,
      updatedAt: new Date().toISOString(),
    });
    return { success: true };
  } catch (error) {
    logger.error('Pricing 저장 실패:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : '저장에 실패했습니다.',
    };
  }
}

export function generatePricingId(): string {
  return `pricing-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
}

// ===== Hero Images =====

export async function getHeroImages(): Promise<SiteHeroImages | null> {
  try {
    const db = getFirebaseFirestore();
    const docRef = doc(db, SITE_SETTINGS_COLLECTION, HERO_DOC);
    const docSnap = await withTimeout(getDoc(docRef), 5000);

    if (docSnap.exists()) {
      const data = docSnap.data();
      if (data.imageBack && data.imageFront) {
        return { imageBack: data.imageBack, imageFront: data.imageFront };
      }
    }
  } catch (error) {
    logger.warn('Hero images 조회 실패:', error);
  }
  return null;
}

export async function saveHeroImages(
  heroImages: SiteHeroImages
): Promise<{ success: boolean; error?: string }> {
  try {
    const db = getFirebaseFirestore();
    const docRef = doc(db, SITE_SETTINGS_COLLECTION, HERO_DOC);
    await setDoc(docRef, {
      ...heroImages,
      updatedAt: new Date().toISOString(),
    });
    return { success: true };
  } catch (error) {
    logger.error('Hero images 저장 실패:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : '저장에 실패했습니다.',
    };
  }
}
