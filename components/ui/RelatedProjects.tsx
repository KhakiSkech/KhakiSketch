'use client';

import React from 'react';
import ScrollReveal from './ScrollReveal';
import ProjectCard from './ProjectCard';
import { Pattern1, Pattern2, Pattern3 } from './Patterns';

const patternMap = {
  Pattern1,
  Pattern2,
  Pattern3,
};

interface RelatedProject {
  id: string;
  tag?: string;
  title: string;
  description: string;
  tech?: {
    frontend?: string[];
  };
  thumbnail: {
    pattern?: string;
  };
}

interface RelatedProjectsProps {
  projects: RelatedProject[];
}

export default function RelatedProjects({ projects }: RelatedProjectsProps) {
  if (projects.length === 0) {
    return null;
  }

  return (
    <section className="w-full py-16 lg:py-24 px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <ScrollReveal>
          <h2 className="text-3xl lg:text-4xl font-bold text-brand-primary mb-12">관련 프로젝트</h2>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((relatedProject, idx) => {
            const RelatedPattern = patternMap[(relatedProject.thumbnail?.pattern as keyof typeof patternMap) || 'Pattern1'];
            return (
              <ScrollReveal key={relatedProject.id} delay={idx * 100}>
                <ProjectCard
                  pattern={RelatedPattern}
                  tag={relatedProject.tag || 'Project'}
                  title={relatedProject.title}
                  description={relatedProject.description}
                  tech={relatedProject.tech?.frontend?.join(' / ')}
                  href={`/portfolio/${relatedProject.id}`}
                />
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
