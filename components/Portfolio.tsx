'use client';

import React from 'react';
import { Pattern1, Pattern2, Pattern3 } from './ui/Patterns';
import ScrollReveal from './ui/ScrollReveal';
import ProjectCard from './ui/ProjectCard';
import { useFeaturedProjects } from '@/hooks/useProjects';
import { getProjectTechString } from '@/lib/utils';

const patternMap = {
  Pattern1,
  Pattern2,
  Pattern3,
};

export default function Portfolio() {
  const { projects, isLoading } = useFeaturedProjects();

  return (
    <section className="bg-brand-bg w-full py-20 lg:py-28" id="works">
      <div className="w-full max-w-7xl mx-auto px-6 lg:px-8 flex flex-col gap-12 items-start">
        <ScrollReveal>
          <div className="flex flex-col gap-6 items-start w-full">
            <h2 className="font-bold text-4xl lg:text-5xl text-brand-primary tracking-tight">
              Selected Works
            </h2>
            <p className="font-medium text-xl lg:text-2xl text-brand-primary/80 tracking-tight">
              다양한 산업 분야에서의 성공 사례입니다.
            </p>
          </div>
        </ScrollReveal>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-[450px] bg-white/60 rounded-2xl border border-brand-primary/5 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full">
            {projects.map((project, idx) => {
              const Pattern = patternMap[project.thumbnail.pattern as keyof typeof patternMap] || Pattern1;
              const techString = getProjectTechString(project.tech);

              return (
                <ScrollReveal key={project.id} delay={100 + idx * 100} className="h-full">
                  <ProjectCard
                    pattern={Pattern}
                    imageUrl={project.thumbnail.imageUrl}
                    tag={project.tag ?? ''}
                    title={project.title}
                    description={project.description}
                    tech={techString}
                    href={`/portfolio/${project.id}`}
                  />
                </ScrollReveal>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}

