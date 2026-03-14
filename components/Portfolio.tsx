'use client';

import React from 'react';
import Link from 'next/link';
import { Pattern1, Pattern2, Pattern3 } from './ui/Patterns';
import ProjectCard from './ui/ProjectCard';
import { useFeaturedProjects } from '@/hooks/useProjects';
import { getProjectTechString } from '@/lib/utils';
import ScrollDrivenSlider from './ui/ScrollDrivenSlider';

const patternMap = {
  Pattern1,
  Pattern2,
  Pattern3,
};

export default function Portfolio() {
  const { projects, isLoading } = useFeaturedProjects();

  const header = (
    <div className="flex flex-col gap-4 items-start">
      <span className="text-brand-secondary font-bold text-sm tracking-widest uppercase">
        Selected Works
      </span>
      <h2 className="font-bold text-3xl lg:text-4xl text-white tracking-tight leading-tight">
        실제 완성한 프로젝트
      </h2>
      <p className="text-lg text-white/70 leading-relaxed break-keep">
        다양한 산업 분야에서의 성공 사례입니다.
      </p>
    </div>
  );

  const darkBg = "bg-gradient-to-br from-[#1a2618] via-[#263122] to-[#2d4a25]";

  // Loading state
  if (isLoading) {
    return (
      <section className={`w-full py-20 lg:py-28 ${darkBg}`} id="works" aria-busy="true">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="mb-10">{header}</div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-[450px] bg-white/10 rounded-2xl animate-pulse" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Empty state
  if (projects.length === 0) {
    return (
      <section className={`w-full py-20 lg:py-28 ${darkBg}`} id="works">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="mb-10">{header}</div>
          <div className="text-center py-16">
            <p className="text-white/50 text-lg">프로젝트를 준비 중입니다.</p>
          </div>
        </div>
      </section>
    );
  }

  const cards = projects.map((project) => {
    const Pattern = patternMap[project.thumbnail.pattern as keyof typeof patternMap] || Pattern1;
    const techString = getProjectTechString(project.tech);

    return (
      <ProjectCard
        key={project.id}
        pattern={Pattern}
        imageUrl={project.thumbnail.imageUrl}
        tag={project.tag ?? ''}
        title={project.title}
        description={project.description}
        tech={techString}
        href={`/portfolio/${project.id}`}
      />
    );
  });

  const portfolioFooter = (
    <Link
      href="/quote"
      className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white text-brand-primary font-bold text-sm shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 group"
    >
      내 프로젝트도 만들어보기
      <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
      </svg>
    </Link>
  );

  return (
    <ScrollDrivenSlider
      id="works"
      bgColor={darkBg}
      header={header}
      cards={cards}
      footer={portfolioFooter}
      scrollHeight={projects.length + 0.5}
      darkMode
    />
  );
}
