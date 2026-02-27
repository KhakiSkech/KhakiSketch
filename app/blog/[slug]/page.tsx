import { logger } from '@/lib/logger';
import { articles as staticArticles } from '@/data/articles';
import { getAllArticles, getArticleBySlug } from '@/lib/firestore-articles';
import { Metadata } from 'next';
import BlogDetailClient from './BlogDetailClient';

export async function generateStaticParams() {
  try {
    const articles = await getAllArticles();
    if (articles.length > 0) {
      return articles.map((article) => ({
        slug: article.slug,
      }));
    }
  } catch (error) {
    logger.error('Failed to generate blog static params:', error);
  }
  // Fallback to static articles
  return staticArticles.map((article) => ({
    slug: article.slug,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article) {
    return {
      title: '글을 찾을 수 없습니다',
    };
  }

  return {
    title: article.title,
    description: article.description,
    openGraph: {
      title: `${article.title} | KhakiSketch Blog`,
      description: article.description,
      images: [{ url: '/opengraph-image.webp', width: 1200, height: 630 }],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${article.title} | KhakiSketch Blog`,
      description: article.description,
      images: ['/opengraph-image.webp'],
    },
    alternates: {
      canonical: `https://khakisketch.co.kr/blog/${slug}`,
    },
  };
}

export default async function BlogDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  const articleSchema = article ? {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.description,
    datePublished: article.publishedAt,
    author: {
      '@type': 'Organization',
      name: '카키스케치 KhakiSketch',
      url: 'https://khakisketch.co.kr',
    },
    publisher: {
      '@type': 'Organization',
      name: '카키스케치 KhakiSketch',
      logo: { '@type': 'ImageObject', url: 'https://khakisketch.co.kr/icon' },
    },
    mainEntityOfPage: `https://khakisketch.co.kr/blog/${slug}`,
    keywords: article.tags,
  } : null;

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: '홈', item: 'https://khakisketch.co.kr' },
      { '@type': 'ListItem', position: 2, name: '블로그', item: 'https://khakisketch.co.kr/blog' },
      ...(article ? [{ '@type': 'ListItem', position: 3, name: article.title, item: `https://khakisketch.co.kr/blog/${slug}` }] : []),
    ],
  };

  return (
    <>
      {articleSchema && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      )}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <BlogDetailClient slug={slug} />
    </>
  );
}
