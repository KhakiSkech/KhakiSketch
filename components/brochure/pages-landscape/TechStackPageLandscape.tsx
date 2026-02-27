import React from 'react';
import BrochurePageLandscape from '../BrochurePageLandscape';
import { colors, borderRadius, shadows } from '../brochure-design-system';

export default function TechStackPageLandscape() {
  const benefits = [
    {
      icon: '👥',
      title: '인력 풀이 넓습니다',
      desc: 'React, Next.js 등 주류 기술을 사용합니다. 나중에 다른 개발자를 구하기 쉽습니다.',
      color: '#3B82F6',
    },
    {
      icon: '📖',
      title: '문서화가 잘 됩니다',
      desc: 'TypeScript 기반으로 코드 자체가 문서 역할을 합니다. 인수인계가 수월합니다.',
      color: '#10B981',
    },
    {
      icon: '🔓',
      title: '종속되지 않습니다',
      desc: '표준 기술만 사용하여 특정 업체에 묶이지 않습니다. 언제든 다른 개발사로 이전 가능합니다.',
      color: '#8B5CF6',
    },
    {
      icon: '🛠️',
      title: '유지보수가 쉽습니다',
      desc: '컴포넌트 기반 구조로 부분 수정이 가능합니다. 기능 추가/변경 비용이 낮습니다.',
      color: '#F59E0B',
    },
  ];

  const techStack = [
    { category: 'Frontend', items: ['React', 'Next.js', 'TypeScript', 'Tailwind'] },
    { category: 'Backend', items: ['Node.js', 'Python', 'FastAPI'] },
    { category: 'Database', items: ['PostgreSQL', 'Supabase', 'Firebase'] },
    { category: 'Infra', items: ['AWS', 'Vercel', 'Docker'] },
  ];

  return (
    <BrochurePageLandscape pageNumber={12} bgColor="white">
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="flex items-end justify-between mb-5">
          <div>
            <span className="font-bold text-xs tracking-wider uppercase" style={{ color: colors.brand.primary }}>Tech Stack</span>
            <h2 className="text-3xl font-bold mt-1" style={{ color: colors.text.primary }}>왜 이 기술을 쓰나요?</h2>
          </div>
          <p className="text-sm" style={{ color: colors.text.secondary }}>고객에게 유리한 기술만 선택합니다.</p>
        </div>

        {/* Main Content - Two Columns */}
        <div className="flex-1 flex gap-6">
          {/* Left - Benefits */}
          <div className="flex-1 grid grid-cols-2 gap-4">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="p-4"
                style={{
                  backgroundColor: colors.neutral.offWhite,
                  borderRadius: borderRadius.xl,
                  borderLeft: `4px solid ${benefit.color}`,
                }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xl">{benefit.icon}</span>
                  <h3 className="font-bold text-sm" style={{ color: colors.text.primary }}>{benefit.title}</h3>
                </div>
                <p className="text-xs leading-relaxed" style={{ color: colors.text.secondary }}>
                  {benefit.desc}
                </p>
              </div>
            ))}
          </div>

          {/* Right - Tech List (Compact) */}
          <div
            className="w-56 p-4"
            style={{
              backgroundColor: colors.brand.dark,
              borderRadius: borderRadius['2xl'],
            }}
          >
            <h3 className="text-xs font-bold mb-4" style={{ color: colors.neutral.white }}>사용 기술</h3>
            <div className="space-y-4">
              {techStack.map((category, index) => (
                <div key={index}>
                  <p className="text-[10px] mb-2" style={{ color: colors.brand.primary }}>{category.category}</p>
                  <div className="flex flex-wrap gap-1">
                    {category.items.map((item, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-1 text-[10px]"
                        style={{
                          backgroundColor: 'rgba(255,255,255,0.1)',
                          color: colors.text.inverseSecondary,
                          borderRadius: borderRadius.md,
                        }}
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </BrochurePageLandscape>
  );
}
