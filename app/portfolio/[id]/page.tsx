import { logger } from '@/lib/logger';
import { getAllProjects, getProjectById } from '@/lib/firestore-projects';
import { projects as staticProjects } from '@/data/projects';
import { Metadata } from 'next';
import ProjectDetailContent from './ProjectDetailContent';

export async function generateStaticParams() {
    // Always include static project IDs as baseline
    const ids = new Set(staticProjects.map((p) => p.id));

    try {
        const projects = await getAllProjects();
        projects.forEach((p) => ids.add(p.id));
    } catch (error) {
        logger.error('Failed to fetch Firestore projects for static params:', error);
    }

    return Array.from(ids).map((id) => ({ id }));
}

export async function generateMetadata({
    params,
}: {
    params: Promise<{ id: string }>;
}): Promise<Metadata> {
    const { id } = await params;
    const project = await getProjectById(id);

    if (!project) {
        return {
            title: '프로젝트를 찾을 수 없습니다',
        };
    }

    return {
        title: `${project.title} | KhakiSketch Portfolio`,
        description: project.description,
        openGraph: {
            title: project.title,
            description: project.description,
            images: project.thumbnail.imageUrl
                ? [project.thumbnail.imageUrl]
                : ['/opengraph-image.webp'],
            type: 'website',
        },
        twitter: {
            card: 'summary_large_image',
            title: project.title,
            description: project.description,
            images: project.thumbnail.imageUrl
                ? [project.thumbnail.imageUrl]
                : ['/opengraph-image.webp'],
        },
        alternates: {
            canonical: `https://khakisketch.co.kr/portfolio/${id}`,
        },
    };
}

export default async function ProjectDetailPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const project = await getProjectById(id);

    const creativeWorkSchema = project
        ? {
              '@context': 'https://schema.org',
              '@type': 'CreativeWork',
              name: project.title,
              description: project.description,
              creator: {
                  '@type': 'Organization',
                  name: '카키스케치 KhakiSketch',
                  url: 'https://khakisketch.co.kr',
              },
              ...(project.thumbnail.imageUrl ? { image: project.thumbnail.imageUrl } : {}),
              url: `https://khakisketch.co.kr/portfolio/${id}`,
              genre: project.category,
          }
        : null;

    const breadcrumbSchema = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
            {
                '@type': 'ListItem',
                position: 1,
                name: '홈',
                item: 'https://khakisketch.co.kr',
            },
            {
                '@type': 'ListItem',
                position: 2,
                name: '포트폴리오',
                item: 'https://khakisketch.co.kr/portfolio',
            },
            ...(project
                ? [
                      {
                          '@type': 'ListItem',
                          position: 3,
                          name: project.title,
                          item: `https://khakisketch.co.kr/portfolio/${id}`,
                      },
                  ]
                : []),
        ],
    };

    return (
        <>
            {creativeWorkSchema && (
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(creativeWorkSchema) }}
                />
            )}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
            />
            <ProjectDetailContent id={id} />
        </>
    );
}
