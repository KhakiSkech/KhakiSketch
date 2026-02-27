'use client';

import SearchBox from '@/components/ui/SearchBox';
import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import ScrollReveal from '@/components/ui/ScrollReveal';
import ProjectCard from '@/components/ui/ProjectCard';
import { Pattern1, Pattern2, Pattern3 } from '@/components/ui/Patterns';
import { useProjects } from '@/hooks/useProjects';
import { ProjectCategory } from '@/types/admin';
import { getProjectTechString } from '@/lib/utils';

const patternMap = {
  Pattern1,
  Pattern2,
  Pattern3,
};

const CATEGORIES: { id: ProjectCategory | 'ALL'; label: string }[] = [
  { id: 'ALL', label: 'All Work' },
  { id: 'TRADING', label: 'Trading System' },
  { id: 'MVP', label: 'Startup MVP' },
  { id: 'AUTOMATION', label: 'Automation & RPA' },
  { id: 'PROTOTYPE', label: 'Prototypes' },
];

export default function PortfolioContent() {
  const { projects, isLoading } = useProjects();
  const [activeCategory, setActiveCategory] = useState<ProjectCategory | 'ALL'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredProjects = useMemo(() => {
    return projects.filter((p) => {
      const matchCategory = activeCategory === 'ALL' || p.category === activeCategory;
      const term = searchQuery.toLowerCase();
      const matchSearch =
        p.title.toLowerCase().includes(term) ||
        p.description.toLowerCase().includes(term) ||
        p.tag?.toLowerCase().includes(term) ||
        p.tech?.frontend?.some((t) => t.toLowerCase().includes(term)) ||
        p.tech?.backend?.some((t) => t.toLowerCase().includes(term));

      return matchCategory && matchSearch;
    });
  }, [projects, activeCategory, searchQuery]);

  if (isLoading) {
    return (
      <div className="w-full bg-brand-bg min-h-screen pt-32 pb-20 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col gap-16">
          <div className="flex flex-col gap-6 items-start">
            <div className="h-12 bg-brand-primary/10 rounded-lg w-64 animate-pulse" />
            <div className="h-8 bg-brand-primary/5 rounded-lg w-96 animate-pulse" />
          </div>
          <div className="w-full h-12 bg-white rounded-xl animate-pulse" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-[400px] bg-white/60 rounded-2xl border border-brand-primary/5 animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-brand-bg min-h-screen pt-32 pb-20 px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex flex-col gap-12">

        {/* Header */}
        <ScrollReveal>
          <div className="flex flex-col gap-6 items-start max-w-2xl">
            <span className="text-brand-secondary font-bold text-sm tracking-[0.2em] uppercase">
              Portfolio
            </span>
            <h1 className="font-bold text-4xl lg:text-5xl text-brand-primary tracking-tight leading-tight">
              Selected Works
            </h1>
            <p className="text-xl text-brand-text font-medium leading-relaxed break-keep">
              다양한 기술적 난제를 해결한 성공 사례들입니다.<br />
              고성능 트레이딩 시스템부터 확장 가능한 웹 플랫폼까지, 우리의 기술력을 확인해보세요.
            </p>
          </div>
        </ScrollReveal>

        {/* Filters & Search - Sticky Header compatible */}
        <ScrollReveal delay={100} className="w-full sticky top-24 z-30 transition-all duration-300">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between bg-white/80 backdrop-blur-md p-4 rounded-2xl border border-brand-primary/5 shadow-sm">
            {/* Category Tags */}
            <div className="flex flex-wrap gap-2 justify-center lg:justify-start">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-4 py-2 rounded-xl text-sm font-bold transition-all duration-200 ${activeCategory === cat.id
                    ? 'bg-brand-primary text-white shadow-md'
                    : 'bg-transparent text-brand-muted hover:bg-gray-100'
                    }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Search Input */}
            <SearchBox
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="기술 스택, 프로젝트명 검색..."
              resultsCount={filteredProjects.length}
              className="w-full lg:w-80"
            />
          </div>
        </ScrollReveal>

        {/* Portfolio Grid */}
        <div className="w-full min-h-[400px]">
          {filteredProjects.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 opacity-50">
              <svg className="w-16 h-16 text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-lg font-bold text-gray-400">조건에 맞는 프로젝트가 없습니다.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full">
              {filteredProjects.map((project, idx) => {
                const Pattern = patternMap[(project.thumbnail?.pattern as keyof typeof patternMap) || 'Pattern1'];
                return (
                  <ScrollReveal key={project.id} delay={idx * 100} className="h-full">
                    <ProjectCard
                      pattern={Pattern}
                      imageUrl={project.thumbnail?.imageUrl}
                      tag={project.tag ?? ''}
                      title={project.title}
                      description={project.description}
                      tech={getProjectTechString(project.tech)}
                      href={`/portfolio/${project.id}`}
                    />
                  </ScrollReveal>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer Note */}
        <ScrollReveal delay={300}>
          <div className="bg-white p-8 lg:p-12 rounded-[2rem] border border-brand-primary/5 shadow-sm text-center mt-8">
            <h3 className="font-bold text-2xl text-brand-primary mb-4">
              더 많은 레퍼런스가 궁금하신가요?
            </h3>
            <p className="text-brand-muted mb-8 leading-relaxed max-w-2xl mx-auto">
              보안 서약(NDA)으로 인해 홈페이지에 공개하지 못한 프로젝트가 많습니다.<br />
              상담 시, 귀사의 도메인과 유사한 실제 구축 사례를 시연해 드릴 수 있습니다.
            </p>
            <div className="flex justify-center">
              <Link href="/quote" className="group inline-flex items-center gap-3 px-8 py-4 bg-brand-primary text-white font-bold text-lg rounded-xl hover:bg-brand-primary/90 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5">
                프로젝트 상담 요청하기
                <svg className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          </div>
        </ScrollReveal>

      </div>
    </div>
  );
}
