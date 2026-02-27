'use client';

import React from 'react';
import Link from 'next/link';
import ScrollReveal from '@/components/ui/ScrollReveal';
import { Pattern1, Pattern2, Pattern3 } from '@/components/ui/Patterns';
import RelatedProjects from '@/components/ui/RelatedProjects';
import { useProject, useProjects } from '@/hooks/useProjects';

const patternMap = {
  Pattern1,
  Pattern2,
  Pattern3,
};

interface ProjectDetailClientProps {
  id: string;
}

export default function ProjectDetailClient({ id }: ProjectDetailClientProps) {
  const { project, isLoading, error } = useProject(id);
  const { projects } = useProjects();

  if (isLoading) {
    return (
      <div className="w-full bg-brand-bg min-h-screen pt-24 pb-20 px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="h-8 bg-brand-primary/10 rounded-lg w-48 mb-8 animate-pulse" />
          <div className="h-[400px] bg-white/60 rounded-3xl mb-12 animate-pulse" />
          <div className="space-y-4">
            <div className="h-12 bg-brand-primary/10 rounded-lg w-3/4 animate-pulse" />
            <div className="h-6 bg-brand-primary/5 rounded-lg w-1/2 animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="w-full bg-brand-bg min-h-screen pt-32 pb-20 px-6 lg:px-8 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-brand-primary mb-4">프로젝트를 찾을 수 없습니다</h1>
          <p className="text-brand-muted text-lg mb-8">요청하신 프로젝트가 존재하지 않습니다.</p>
          <Link href="/portfolio" className="text-brand-primary font-bold hover:underline">
            포트폴리오로 돌아가기 →
          </Link>
        </div>
      </div>
    );
  }

  const Pattern = patternMap[project.thumbnail.pattern as keyof typeof patternMap];

  // 관련 프로젝트 추천 (같은 카테고리)
  const relatedProjects = projects
    .filter((p) => p.category === project.category && p.id !== project.id)
    .slice(0, 3);

  return (
    <div className="w-full bg-brand-bg min-h-screen">
      {/* Hero Section */}
      <section className="w-full pt-24 pb-12 lg:pb-20 px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Back Button */}
          <ScrollReveal>
            <Link href="/portfolio" className="back-link inline-flex items-center gap-2 text-brand-primary font-medium hover:gap-3 transition-all mb-8">
              <span>←</span>
              <span>포트폴리오로 돌아가기</span>
            </Link>
          </ScrollReveal>

          {/* Hero Image */}
          <ScrollReveal delay={100}>
            <div className="h-[400px] lg:h-[500px] w-full bg-gray-50 rounded-3xl overflow-hidden flex items-center justify-center mb-12 relative group shadow-lg hover:shadow-2xl transition-all duration-500">
              {/* Background Image or Pattern */}
              {project.thumbnail.imageUrl ? (
                <>
                  <img
                    src={project.thumbnail.imageUrl}
                    alt={project.title}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                </>
              ) : (
                Pattern && <Pattern />
              )}

              {/* Tag Badge */}
              <div className="absolute top-6 left-6 bg-black/60 backdrop-blur-md text-white px-4 py-2 rounded-full text-sm font-bold tracking-wide z-10">
                {project.tag}
              </div>

              {/* View Project Link (if live URL exists) */}
              {project.links?.live && (
                <a
                  href={project.links.live}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute bottom-6 right-6 bg-white/90 backdrop-blur-md text-brand-primary px-6 py-3 rounded-xl font-bold text-sm flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-white z-10"
                >
                  라이브 보기
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              )}
            </div>
          </ScrollReveal>

          {/* Header */}
          <ScrollReveal delay={150}>
            <div className="flex flex-col gap-6 mb-16">
              <div className="flex flex-wrap items-center gap-4 text-brand-muted font-medium">
                <span>{project.period}</span>
                <span>•</span>
                <span>{project.teamSize}</span>
                <span>•</span>
                <span className="bg-brand-primary/10 text-brand-primary px-3 py-1 rounded-full text-sm font-bold">
                  {project.category}
                </span>
              </div>
              <h1 className="text-4xl lg:text-5xl font-bold text-brand-primary leading-tight">
                {project.title}
              </h1>
              <p className="text-xl lg:text-2xl text-brand-text font-medium leading-relaxed">
                {project.description}
              </p>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Overview Section */}
      <section className="w-full py-16 lg:py-24 px-6 lg:px-8 border-t border-gray-100">
        <div className="max-w-6xl mx-auto">
          <ScrollReveal>
            <div className="flex flex-col gap-8">
              <h2 className="text-3xl lg:text-4xl font-bold text-brand-primary">프로젝트 개요</h2>
              <p className="text-lg lg:text-xl text-brand-text leading-relaxed break-keep">
                {project.overview}
              </p>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Challenge & Solution Section */}
      {(project.challenge || project.solution) && (
      <section className="w-full py-16 lg:py-24 px-6 lg:px-8 bg-white/50">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Challenge */}
            {project.challenge && (
            <ScrollReveal>
              <div className="flex flex-col gap-6">
                <h2 className="text-3xl font-bold text-brand-primary">❌ {project.challenge.title}</h2>
                <ul className="flex flex-col gap-4">
                  {project.challenge.items.map((item, idx) => (
                    <li
                      key={idx}
                      className="flex gap-3 p-4 bg-red-50 rounded-lg border border-red-200 hover:border-red-400 hover:shadow-md transition-all duration-300"
                    >
                      <span className="text-red-500 font-bold mt-0.5">•</span>
                      <span className="text-brand-text font-medium">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </ScrollReveal>
            )}

            {/* Solution */}
            {project.solution && (
            <ScrollReveal delay={100}>
              <div className="flex flex-col gap-6">
                <h2 className="text-3xl font-bold text-brand-primary">✅ {project.solution.title}</h2>
                <ul className="flex flex-col gap-4">
                  {project.solution.items.map((item, idx) => (
                    <li key={idx} className="solution-item p-4 bg-green-50 rounded-lg border border-green-200 hover:border-green-400 hover:shadow-md transition-all duration-300">
                      <h3 className="font-bold text-brand-primary mb-2">{item.title}</h3>
                      <p className="text-brand-text text-sm">{item.description}</p>
                    </li>
                  ))}
                </ul>
              </div>
            </ScrollReveal>
            )}
          </div>
        </div>
      </section>
      )}

      {/* Result Metrics Section */}
      {project.result && (
      <section className="w-full py-16 lg:py-24 px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <ScrollReveal>
            <h2 className="text-3xl lg:text-4xl font-bold text-brand-primary mb-12">📊 {project.result.title}</h2>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {project.result.metrics.map((metric, idx) => (
              <ScrollReveal key={idx} delay={idx * 50}>
                <div className="p-6 bg-gradient-to-br from-brand-primary/5 to-brand-secondary/5 rounded-2xl border border-gray-100 hover:border-brand-primary hover:shadow-lg transition-all duration-300">
                  <p className="text-brand-muted font-medium text-sm mb-3">{metric.label}</p>
                  <div className="flex items-baseline gap-2">
                    <p className="text-4xl font-bold text-brand-primary number-pop">{metric.value}</p>
                    {metric.unit && <p className="text-lg text-brand-secondary font-medium">{metric.unit}</p>}
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>

          <ScrollReveal delay={200}>
            <p className="text-lg text-brand-text leading-relaxed bg-brand-primary/5 p-6 rounded-2xl border border-brand-primary/20">
              {project.result.summary}
            </p>
          </ScrollReveal>
        </div>
      </section>
      )}

      {/* Tech Stack Section */}
      {project.tech && (
      <section className="w-full py-16 lg:py-24 px-6 lg:px-8 bg-white/50 border-t border-gray-100">
        <div className="max-w-6xl mx-auto">
          <ScrollReveal>
            <h2 className="text-3xl lg:text-4xl font-bold text-brand-primary mb-12">🛠️ 기술 스택</h2>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {project.tech.frontend && (
              <ScrollReveal delay={100}>
                <div className="flex flex-col gap-4">
                  <h3 className="font-bold text-brand-primary text-lg">Frontend</h3>
                  <div className="flex flex-wrap gap-2">
                    {project.tech.frontend.map((tech, idx) => (
                      <span key={idx} className="px-3 py-2 bg-brand-primary/10 text-brand-primary rounded-full text-sm font-medium hover:bg-brand-primary/20 transition-colors">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </ScrollReveal>
            )}
            {project.tech.backend && (
              <ScrollReveal delay={150}>
                <div className="flex flex-col gap-4">
                  <h3 className="font-bold text-brand-primary text-lg">Backend</h3>
                  <div className="flex flex-wrap gap-2">
                    {project.tech.backend.map((tech, idx) => (
                      <span key={idx} className="px-3 py-2 bg-brand-primary/10 text-brand-primary rounded-full text-sm font-medium hover:bg-brand-primary/20 transition-colors">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </ScrollReveal>
            )}
            {project.tech.database && (
              <ScrollReveal delay={200}>
                <div className="flex flex-col gap-4">
                  <h3 className="font-bold text-brand-primary text-lg">Database</h3>
                  <div className="flex flex-wrap gap-2">
                    {project.tech.database.map((tech, idx) => (
                      <span key={idx} className="px-3 py-2 bg-brand-primary/10 text-brand-primary rounded-full text-sm font-medium hover:bg-brand-primary/20 transition-colors">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </ScrollReveal>
            )}
            {project.tech.other && (
              <ScrollReveal delay={250}>
                <div className="flex flex-col gap-4">
                  <h3 className="font-bold text-brand-primary text-lg">Other</h3>
                  <div className="flex flex-wrap gap-2">
                    {project.tech.other.map((tech, idx) => (
                      <span key={idx} className="px-3 py-2 bg-brand-primary/10 text-brand-primary rounded-full text-sm font-medium hover:bg-brand-primary/20 transition-colors">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </ScrollReveal>
            )}
          </div>
        </div>
      </section>
      )}

      {/* Related Projects Section */}
      <RelatedProjects projects={relatedProjects} />

      {/* CTA Section */}
      <section className="w-full bg-brand-primary mt-16 lg:mt-24">
        <div className="max-w-5xl mx-auto px-6 lg:px-8 py-16 lg:py-20">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-12">
            <div className="flex flex-col gap-4 text-center lg:text-left">
              <h3 className="text-white font-bold text-2xl lg:text-3xl tracking-tight">
                이런 프로젝트가 필요하신가요?
              </h3>
              <p className="text-white/80 text-base lg:text-lg max-w-lg leading-relaxed">
                카키스케치는 당신의 비즈니스 문제를 기술로 해결하는 파트너입니다.
              </p>
            </div>
            <a
              href="/contact?type=startup-mvp"
              className="group inline-flex items-center gap-3 px-8 py-4 bg-white text-brand-primary font-bold text-lg rounded-xl hover:bg-brand-bg transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 cta-button"
            >
              무료 상담 신청하기
              <svg className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
