'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { useProject, useProjects } from '@/hooks/useProjects';
import MarkdownRenderer from '@/components/ui/MarkdownRenderer';
import ProjectCard from '@/components/ui/ProjectCard';
import { Pattern1, Pattern2, Pattern3 } from '@/components/ui/Patterns';
import type { FirestoreProject, ProjectSolutionItem } from '@/types/admin';

const patternMap = { Pattern1, Pattern2, Pattern3 };

interface ProjectDetailContentProps {
    id: string;
}

export default function ProjectDetailContent({ id }: ProjectDetailContentProps) {
    const decodedId = decodeURIComponent(id);
    const { project, isLoading, error } = useProject(decodedId);
    const { projects: allProjects } = useProjects();

    // CSR 로드 후 페이지 타이틀 업데이트 (빌드 시 메타데이터 실패 대비)
    useEffect(() => {
        if (project) {
            document.title = `${project.title} | KhakiSketch Portfolio`;
        }
    }, [project]);

    if (isLoading) {
        return (
            <main className="min-h-screen bg-brand-bg">
                {/* Hero Skeleton */}
                <section className="relative w-full py-24 lg:py-32 bg-brand-primary">
                    <div className="max-w-7xl mx-auto px-6 lg:px-8">
                        <div className="max-w-4xl space-y-6">
                            <div className="flex gap-3">
                                <div className="h-8 w-24 bg-white/10 rounded-full animate-pulse" />
                                <div className="h-8 w-20 bg-white/10 rounded-full animate-pulse" />
                            </div>
                            <div className="h-14 bg-white/10 rounded-lg w-3/4 animate-pulse" />
                            <div className="h-8 bg-white/10 rounded-lg w-1/2 animate-pulse" />
                        </div>
                    </div>
                </section>
                {/* Content Skeleton */}
                <section className="max-w-7xl mx-auto px-6 lg:px-8 -mt-12 relative z-20">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                        <div className="lg:col-span-8 bg-white rounded-3xl p-8 lg:p-12 shadow-xl">
                            <div className="space-y-4">
                                <div className="h-6 bg-brand-primary/5 rounded w-full animate-pulse" />
                                <div className="h-6 bg-brand-primary/5 rounded w-5/6 animate-pulse" />
                                <div className="h-6 bg-brand-primary/5 rounded w-4/6 animate-pulse" />
                                <div className="h-48 bg-brand-primary/5 rounded-xl mt-8 animate-pulse" />
                            </div>
                        </div>
                        <aside className="lg:col-span-4">
                            <div className="bg-white rounded-2xl p-6 shadow-lg h-80 animate-pulse" />
                        </aside>
                    </div>
                </section>
            </main>
        );
    }

    if (error || !project) {
        return (
            <main className="min-h-screen bg-brand-bg flex items-center justify-center">
                <div className="text-center">
                    <div className="w-20 h-20 bg-brand-primary/5 rounded-2xl flex items-center justify-center mx-auto mb-6">
                        <svg
                            className="w-10 h-10 text-brand-muted"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={1.5}
                                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                        </svg>
                    </div>
                    <h1 className="text-3xl font-bold text-brand-primary mb-4">
                        프로젝트를 찾을 수 없습니다
                    </h1>
                    <p className="text-brand-muted text-lg mb-8">
                        요청하신 프로젝트가 존재하지 않거나 삭제되었습니다.
                    </p>
                    <Link
                        href="/portfolio"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-brand-primary text-white font-bold rounded-xl hover:bg-brand-primary/90 transition-colors"
                    >
                        <svg
                            className="w-5 h-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M10 19l-7-7m0 0l7-7m-7 7h18"
                            />
                        </svg>
                        포트폴리오로 돌아가기
                    </Link>
                </div>
            </main>
        );
    }

    const PatternComponent =
        project.thumbnail.pattern === 'Pattern2'
            ? Pattern2
            : project.thumbnail.pattern === 'Pattern3'
              ? Pattern3
              : Pattern1;

    // 마크다운 콘텐츠: content(신규) > markdownContent(레거시) 순서
    const markdownContent = project.content || project.markdownContent || '';

    // 관련 프로젝트: 같은 카테고리, 현재 제외, 최대 3개
    const relatedProjects = allProjects
        .filter((p) => p.category === project.category && p.id !== project.id)
        .slice(0, 3);

    return (
        <main className="min-h-screen bg-brand-bg pb-20">
            {/* Hero Section */}
            <section className="relative w-full py-24 lg:py-32 overflow-hidden bg-brand-primary text-white">
                <div className="absolute inset-0 opacity-10">
                    <PatternComponent className="w-full h-full text-white" />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-brand-primary to-transparent" />

                <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
                    <div className="max-w-4xl">
                        <div className="flex items-center gap-3 mb-6">
                            <span className="px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-sm font-bold border border-white/20">
                                {project.category}
                            </span>
                            {project.period && (
                                <span className="px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-sm font-bold border border-white/20">
                                    {project.period}
                                </span>
                            )}
                        </div>

                        <h1 className="text-4xl lg:text-6xl font-bold tracking-tight mb-6 leading-tight">
                            {project.title}
                        </h1>

                        <p className="text-xl lg:text-2xl text-white/80 leading-relaxed font-medium max-w-2xl">
                            {project.description}
                        </p>
                    </div>
                </div>
            </section>

            {/* Content Section */}
            <section className="max-w-7xl mx-auto px-6 lg:px-8 -mt-12 relative z-20">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    {/* Main Content (Left) */}
                    <div className="lg:col-span-8 bg-white rounded-3xl p-8 lg:p-12 shadow-xl border border-brand-primary/5">
                        {/* Overview Box */}
                        {project.overview && (
                            <div className="bg-brand-bg/50 rounded-2xl p-6 mb-12 border border-brand-primary/5">
                                <h3 className="text-lg font-bold text-brand-primary mb-3">
                                    Project Overview
                                </h3>
                                <p className="text-brand-text leading-relaxed whitespace-pre-wrap">
                                    {project.overview}
                                </p>
                            </div>
                        )}

                        {/* Markdown Content */}
                        {markdownContent ? (
                            <article className="prose prose-lg max-w-none prose-headings:text-brand-primary prose-headings:font-bold prose-p:text-brand-text prose-p:leading-relaxed prose-a:text-brand-secondary prose-strong:text-brand-primary prose-code:bg-gray-100 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-pre:bg-gray-900 prose-pre:text-gray-100">
                                <MarkdownRenderer content={markdownContent} />
                            </article>
                        ) : (
                            /* Legacy structured fields fallback */
                            ((project.challenge?.items?.length ?? 0) > 0 ||
                                (project.solution?.items?.length ?? 0) > 0) && (
                                <div className="space-y-8">
                                    {(project.challenge?.items?.length ?? 0) > 0 && (
                                        <div>
                                            <h3 className="text-xl font-bold text-brand-primary mb-4">
                                                Challenge
                                            </h3>
                                            <ul className="space-y-2">
                                                {project.challenge!.items.map(
                                                    (item: string, idx: number) => (
                                                        <li
                                                            key={idx}
                                                            className="flex gap-2 text-brand-text"
                                                        >
                                                            <span className="text-brand-secondary font-bold">
                                                                •
                                                            </span>
                                                            {item}
                                                        </li>
                                                    )
                                                )}
                                            </ul>
                                        </div>
                                    )}
                                    {(project.solution?.items?.length ?? 0) > 0 && (
                                        <div>
                                            <h3 className="text-xl font-bold text-brand-primary mb-4">
                                                Solution
                                            </h3>
                                            <ul className="space-y-4">
                                                {project.solution!.items.map(
                                                    (
                                                        item: ProjectSolutionItem,
                                                        idx: number
                                                    ) => (
                                                        <li key={idx}>
                                                            <div className="font-bold text-brand-primary mb-1">
                                                                {item.title}
                                                            </div>
                                                            <p className="text-sm text-brand-muted">
                                                                {item.description}
                                                            </p>
                                                        </li>
                                                    )
                                                )}
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            )
                        )}

                        {/* Result Metrics (Legacy) */}
                        {project.result && (project.result.metrics?.length ?? 0) > 0 && (
                            <div className="mt-12 pt-12 border-t border-gray-100">
                                <h3 className="text-xl font-bold text-brand-primary mb-6">
                                    {project.result.title || 'Results'}
                                </h3>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">
                                    {project.result.metrics.map((metric, idx) => (
                                        <div
                                            key={idx}
                                            className="text-center p-4 bg-brand-bg/50 rounded-xl"
                                        >
                                            <div className="text-2xl font-bold text-brand-secondary">
                                                {metric.value}
                                            </div>
                                            <div className="text-xs text-brand-muted mt-1">
                                                {metric.label}
                                            </div>
                                            {metric.unit && (
                                                <div className="text-xs text-brand-muted">
                                                    {metric.unit}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                                {project.result.summary && (
                                    <p className="text-brand-text leading-relaxed">
                                        {project.result.summary}
                                    </p>
                                )}
                            </div>
                        )}

                        {/* Project Gallery */}
                        {project.images && project.images.length > 0 && (
                            <div className="mt-12 pt-12 border-t border-gray-100">
                                <h3 className="text-xl font-bold text-brand-primary mb-6">
                                    Gallery
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {project.images.map((img, idx) => (
                                        <div
                                            key={idx}
                                            className="group relative rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                                        >
                                            <div className="aspect-video bg-gray-100 relative">
                                                <img
                                                    src={img.url}
                                                    alt={
                                                        img.caption ||
                                                        `${project.title} - 갤러리 이미지 ${idx + 1}`
                                                    }
                                                    className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                                                />
                                            </div>
                                            {img.caption && (
                                                <div className="p-4 bg-white border border-t-0 border-gray-100 rounded-b-2xl">
                                                    <p className="text-sm text-gray-500">
                                                        {img.caption}
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Sidebar (Right) */}
                    <aside className="lg:col-span-4 space-y-6">
                        <div className="bg-white rounded-2xl p-6 lg:p-8 shadow-lg border border-brand-primary/5 sticky top-24">
                            <h3 className="text-lg font-bold text-brand-primary mb-6 pb-4 border-b border-gray-100">
                                Project Info
                            </h3>

                            <div className="space-y-6">
                                <div>
                                    <div className="text-sm text-brand-muted mb-1">
                                        Client / Industry
                                    </div>
                                    <div className="font-bold text-brand-text">
                                        {project.tag || 'Confidential'}
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <div className="text-sm text-brand-muted mb-1">
                                            Timeline
                                        </div>
                                        <div className="font-bold text-brand-text">
                                            {project.period || '-'}
                                        </div>
                                    </div>
                                    <div>
                                        <div className="text-sm text-brand-muted mb-1">
                                            Team Size
                                        </div>
                                        <div className="font-bold text-brand-text">
                                            {project.teamSize || '-'}
                                        </div>
                                    </div>
                                </div>

                                {project.tech && (
                                    <div>
                                        <div className="text-sm text-brand-muted mb-2">
                                            Tech Stack
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                            {[
                                                ...(project.tech.frontend ?? []),
                                                ...(project.tech.backend ?? []),
                                                ...(project.tech.database ?? []),
                                                ...(project.tech.other ?? []),
                                            ].map((tech) => (
                                                <span
                                                    key={tech}
                                                    className="px-2.5 py-1 bg-brand-bg rounded-lg text-xs font-bold text-brand-muted border border-brand-primary/5"
                                                >
                                                    {tech}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Links */}
                                <div className="pt-6 border-t border-gray-100 flex flex-col gap-3">
                                    {project.links?.live && (
                                        <a
                                            href={project.links.live}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center justify-center gap-2 w-full py-3 bg-brand-primary text-white rounded-xl font-bold hover:bg-brand-primary/90 transition-all"
                                        >
                                            Visit Website
                                            <svg
                                                className="w-4 h-4"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                                                />
                                            </svg>
                                        </a>
                                    )}
                                    {project.links?.github && (
                                        <a
                                            href={project.links.github}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center justify-center gap-2 w-full py-3 bg-gray-900 text-white rounded-xl font-bold hover:bg-gray-800 transition-all"
                                        >
                                            GitHub
                                            <svg
                                                className="w-4 h-4"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                                                />
                                            </svg>
                                        </a>
                                    )}
                                    <Link
                                        href="/quote"
                                        className="flex items-center justify-center gap-2 w-full py-3 bg-white border-2 border-brand-primary text-brand-primary rounded-xl font-bold hover:bg-brand-bg transition-all"
                                    >
                                        상담 요청하기
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </aside>
                </div>
            </section>

            {/* Related Projects */}
            {relatedProjects.length > 0 && (
                <section className="max-w-7xl mx-auto px-6 lg:px-8 mt-20">
                    <h2 className="text-2xl font-bold text-brand-primary mb-8">
                        Related Projects
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {relatedProjects.map((rp) => {
                            const RPPattern =
                                patternMap[
                                    (rp.thumbnail?.pattern as keyof typeof patternMap) ||
                                        'Pattern1'
                                ] || Pattern1;
                            const techString = [
                                ...(rp.tech?.frontend || []),
                                ...(rp.tech?.backend || []),
                                ...(rp.tech?.database || []),
                                ...(rp.tech?.other || []),
                            ]
                                .slice(0, 4)
                                .join(' / ');
                            return (
                                <ProjectCard
                                    key={rp.id}
                                    pattern={RPPattern}
                                    imageUrl={rp.thumbnail?.imageUrl}
                                    tag={rp.tag ?? rp.category}
                                    title={rp.title}
                                    description={rp.description}
                                    tech={techString}
                                    href={`/portfolio/${rp.id}`}
                                />
                            );
                        })}
                    </div>
                </section>
            )}

            {/* Navigation */}
            <div className="max-w-7xl mx-auto px-6 lg:px-8 mt-20">
                <Link
                    href="/portfolio"
                    className="inline-flex items-center gap-2 text-brand-muted hover:text-brand-primary font-medium transition-colors"
                >
                    <svg
                        className="w-5 h-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M10 19l-7-7m0 0l7-7m-7 7h18"
                        />
                    </svg>
                    목록으로 돌아가기
                </Link>
            </div>
        </main>
    );
}
