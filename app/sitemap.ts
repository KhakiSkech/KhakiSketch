import { logger } from '@/lib/logger';
import { MetadataRoute } from 'next';
import { getAllArticles } from '@/lib/firestore-articles';
import { getAllProjects } from '@/lib/firestore-projects';
import { projects as staticProjects } from '@/data/projects';
import { articles as staticArticles } from '@/data/articles';

export const dynamic = 'force-static';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://khakisketch.co.kr';
  
  // 정적 페이지들
  const staticPages = [
    '',
    '/about',
    '/portfolio',
    '/blog',
    '/pricing',
    '/process',
    '/quote',
    '/contact',
    '/services/startup-mvp',
    '/services/corporate-website',
    '/services/business-automation',
    '/brochure',
    '/privacy',
    '/terms',
  ];
  
  // 정적 페이지 URL 생성
  const staticUrls: MetadataRoute.Sitemap = staticPages.map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: new Date(),
    changeFrequency: (path === '' ? 'daily' : 'weekly') as 'daily' | 'weekly',
    priority: path === '' ? 1 : 0.8,
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
