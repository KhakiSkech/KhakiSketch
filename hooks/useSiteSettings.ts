'use client';

import { logger } from '@/lib/logger';
import { useState, useEffect } from 'react';
import { getStats, getFAQ, getTestimonials, getPricing } from '@/lib/firestore-site-settings';
import type { SiteStats, SiteFAQ, SiteTestimonials, SitePricing } from '@/types/admin';

interface UseStatsReturn {
  stats: SiteStats | null;
  isLoading: boolean;
  error: string | null;
}

interface UseFAQReturn {
  faq: SiteFAQ | null;
  isLoading: boolean;
  error: string | null;
}

interface UseTestimonialsReturn {
  testimonials: SiteTestimonials | null;
  isLoading: boolean;
  error: string | null;
}

interface UsePricingReturn {
  pricing: SitePricing | null;
  isLoading: boolean;
  error: string | null;
}

/**
 * 사이트 통계를 가져오는 훅
 */
export function useStats(): UseStatsReturn {
  const [stats, setStats] = useState<SiteStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadStats = async (): Promise<void> => {
      try {
        const data = await getStats();
        setStats(data);
      } catch (err) {
        logger.warn('Stats 로드 실패:', err);
        setError('통계 로드 실패');
      } finally {
        setIsLoading(false);
      }
    };

    loadStats();
  }, []);

  return { stats, isLoading, error };
}

/**
 * FAQ를 가져오는 훅
 */
export function useFAQ(): UseFAQReturn {
  const [faq, setFaq] = useState<SiteFAQ | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadFAQ = async (): Promise<void> => {
      try {
        const data = await getFAQ();
        setFaq(data);
      } catch (err) {
        logger.warn('FAQ 로드 실패:', err);
        setError('FAQ 로드 실패');
      } finally {
        setIsLoading(false);
      }
    };

    loadFAQ();
  }, []);

  return { faq, isLoading, error };
}

/**
 * 고객 후기를 가져오는 훅
 */
export function useTestimonials(): UseTestimonialsReturn {
  const [testimonials, setTestimonials] = useState<SiteTestimonials | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadTestimonials = async (): Promise<void> => {
      try {
        const data = await getTestimonials();
        setTestimonials(data);
      } catch (err) {
        logger.warn('Testimonials 로드 실패:', err);
        setError('후기 로드 실패');
      } finally {
        setIsLoading(false);
      }
    };

    loadTestimonials();
  }, []);

  return { testimonials, isLoading, error };
}

/**
 * 가격표를 가져오는 훅
 */
export function usePricing(): UsePricingReturn {
  const [pricing, setPricing] = useState<SitePricing | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadPricing = async (): Promise<void> => {
      try {
        const data = await getPricing();
        setPricing(data);
      } catch (err) {
        logger.warn('Pricing 로드 실패:', err);
        setError('가격표 로드 실패');
      } finally {
        setIsLoading(false);
      }
    };

    loadPricing();
  }, []);

  return { pricing, isLoading, error };
}
