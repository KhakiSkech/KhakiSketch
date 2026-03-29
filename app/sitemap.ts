import { logger } from '@/lib/logger';
import { MetadataRoute } from 'next';
import { getAllArticles } from '@/lib/firestore-articles';
import { getAllProjects } from '@/lib/firestore-projects';
import { projects as staticProjects } from '@/data/projects';
import { articles as staticArticles } from '@/data/articles';

export const dynamic = 'force-static';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://khakisketch.co.kr';
  
  // 정적 페이지 — 비즈니스 중요도 기반 priority 설정
  const staticPages: { path: string; priority: number; changeFrequency: 'daily' | 'weekly' | 'monthly' }[] = [
    // 핵심 전환 페이지
    { path: '', priority: 1.0, changeFrequency: 'daily' },
    { path: '/quote', priority: 0.9, changeFrequency: 'monthly' },
    { path: '/pricing', priority: 0.9, changeFrequency: 'monthly' },
    { path: '/contact', priority: 0.9, changeFrequency: 'monthly' },
    // 서비스 페이지 (매출 직결)
    { path: '/services/startup-mvp', priority: 0.9, changeFrequency: 'monthly' },
    { path: '/services/business-automation', priority: 0.9, changeFrequency: 'monthly' },
    { path: '/services/corporate-website', priority: 0.9, changeFrequency: 'monthly' },
    // 신뢰 구축 페이지
    { path: '/portfolio', priority: 0.8, changeFrequency: 'weekly' },
    { path: '/blog', priority: 0.8, changeFrequency: 'weekly' },
    { path: '/process', priority: 0.7, changeFrequency: 'monthly' },
    { path: '/about', priority: 0.7, changeFrequency: 'monthly' },
    { path: '/brochure', priority: 0.6, changeFrequency: 'monthly' },
    // 법적 페이지
    { path: '/privacy', priority: 0.3, changeFrequency: 'monthly' },
    { path: '/terms', priority: 0.3, changeFrequency: 'monthly' },
  ];

  // 정적 페이지 URL 생성
  const staticUrls: MetadataRoute.Sitemap = staticPages.map((page) => ({
    url: `${baseUrl}${page.path}`,
    lastModified: new Date(),
    changeFrequency: page.changeFrequency,
    priority: page.priority,
  }));
  
  // 블로그 글 URL 생성
  let blogUrls: MetadataRoute.Sitemap = [];
  try {
    const articles = await getAllArticles();
    const articlesToUse = articles.length > 0 ? articles : staticArticles;
    
    blogUrls = articlesToUse.map((article) => {
      const lastMod = article.updatedAt || article.publishedAt;
      return {
        url: `${baseUrl}/blog/${article.slug}`,
        lastModified: new Date(lastMod),
        changeFrequency: 'weekly' as const,
        priority: 0.7,
      };
    });
  } catch (error) {
    logger.error('Error generating blog sitemap:', error);
    // Fallback to static articles
    blogUrls = staticArticles.map((article) => ({
      url: `${baseUrl}/blog/${article.slug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }));
  }
  
  // 포트폴리오 URL 생성
  let portfolioUrls: MetadataRoute.Sitemap = [];
  try {
    const projects = await getAllProjects();
    const projectsToUse = projects.length > 0 ? projects : staticProjects;
    
    portfolioUrls = projectsToUse.map((project) => {
      const lastMod = project.updatedAt || project.createdAt || new Date().toISOString();
      return {
        url: `${baseUrl}/portfolio/${project.id}`,
        lastModified: new Date(lastMod),
        changeFrequency: 'monthly' as const,
        priority: 0.7,
      };
    });
  } catch (error) {
    logger.error('Error generating portfolio sitemap:', error);
    // Fallback to static projects
    portfolioUrls = staticProjects.map((project) => ({
      url: `${baseUrl}/portfolio/${project.id}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    }));
  }
  
  return [...staticUrls, ...blogUrls, ...portfolioUrls];
}
