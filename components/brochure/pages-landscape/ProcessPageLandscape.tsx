import React from 'react';
import BrochurePageLandscape from '../BrochurePageLandscape';
import { colors, borderRadius, shadows } from '../brochure-design-system';

export default function ProcessPageLandscape() {
  const steps = [
    {
      num: '01',
      title: 'Discovery & 설계',
      desc: '모호한 아이디어를 구체화하고, 핵심 기능과 예산/일정을 확정합니다.',
      tasks: ['요구사항 분석', '기능 우선순위 정리', '일정 및 예산 확정'],
    },
    {
      num: '02',
      title: '디자인 & 개발',
      desc: '설계를 바탕으로 구현하며, 주간 리포트로 상황을 투명하게 공유합니다.',
      tasks: ['UI/UX 설계', '프론트/백엔드 개발', '주간 진행 리포트'],
    },
    {
      num: '03',
      title: '테스트 & 배포',
      desc: '테스트 및 QA를 거쳐 결함을 제거하고, 안정적인 운영 환경에 배포합니다.',
      tasks: ['QA 테스트', '버그 수정', '배포 및 모니터링'],
    },
    {
      num: '04',
      title: '안정화 & 유지보수',
      desc: '배포 후 1개월간 무상 유지보수 지원, 이후 전문적인 관리 계약이 가능합니다.',
      tasks: ['1개월 무상 유지보수', '운영 매뉴얼 제공', '유지보수 계약 옵션'],
    },
  ];

  return (
    <BrochurePageLandscape pageNumber={10} bgColor="light">
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="mb-4">
          <span className="font-bold text-sm tracking-wider uppercase" style={{ color: colors.brand.primary }}>Work Process</span>
          <h2 className="text-2xl font-bold mt-1" style={{ color: colors.text.primary }}>투명한 과정, 예측 가능한 결과.</h2>
          <p className="text-sm mt-1" style={{ color: colors.text.secondary }}>모든 과정은 클라이언트와 투명하게 공유됩니다.</p>
        </div>

        {/* Process Steps */}
        <div className="flex-1 flex gap-4">
          {steps.map((step, index) => (
            <div
              key={index}
              className="flex-1 p-5 flex flex-col"
              style={{
                backgroundColor: colors.neutral.white,
                borderRadius: borderRadius.xl,
                boxShadow: shadows.sm,
              }}
            >
              <div className="flex items-center gap-2 mb-3">
                <span className="font-bold text-lg" style={{ color: colors.brand.primary }}>{step.num}</span>
                <h3 className="font-bold text-sm" style={{ color: colors.text.primary }}>{step.title}</h3>
              </div>
              <p className="text-xs leading-relaxed mb-3" style={{ color: colors.text.secondary }}>{step.desc}</p>
              <ul className="mt-auto space-y-1">
                {step.tasks.map((task, tIndex) => (
                  <li key={tIndex} className="text-xs flex items-center gap-2" style={{ color: colors.text.secondary }}>
                    <span className="w-1 h-1 rounded-full" style={{ backgroundColor: colors.brand.primary }}></span>
                    {task}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Footer */}
        <p className="text-xs mt-4 text-center" style={{ color: colors.text.secondary }}>
          Slack과 Notion을 통해 실시간으로 소통합니다.
        </p>
      </div>
    </BrochurePageLandscape>
  );
}
