import React from 'react';
import BrochurePageLandscape from '../BrochurePageLandscape';
import { colors, borderRadius } from '../brochure-design-system';

export default function ContactPageLandscape() {
  const steps = [
    {
      step: '1',
      title: '이메일로 간단히 소개해주세요',
      desc: '어떤 서비스인지, 예상 일정/예산 범위',
    },
    {
      step: '2',
      title: '15~20분 무료 상담',
      desc: '가능 여부와 방향성을 확인합니다',
      highlight: true,
    },
    {
      step: '3',
      title: 'Discovery 세션 (유료)',
      desc: '기능/범위/일정을 구체화합니다',
    },
  ];

  return (
    <BrochurePageLandscape pageNumber={16} bgColor="brand">
      <div className="h-full flex">
        {/* Left Section */}
        <div className="w-1/2 h-full flex flex-col justify-center pr-8">
          <h2 className="text-4xl font-bold mb-3 leading-tight" style={{ color: colors.neutral.white }}>
            프로젝트,<br />이야기해볼까요?
          </h2>
          <p className="text-lg mb-6" style={{ color: colors.text.inverseMuted }}>
            부담 없이 첫 상담부터 시작하세요.
          </p>

          {/* 3-Step Process */}
          <div className="space-y-3">
            {steps.map((item, index) => (
              <div
                key={index}
                className="flex items-center gap-4 p-4"
                style={{
                  backgroundColor: item.highlight ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.08)',
                  borderRadius: borderRadius.xl,
                  border: item.highlight ? `2px solid ${colors.brand.primary}` : '2px solid transparent',
                }}
              >
                <div
                  className="w-10 h-10 flex items-center justify-center shrink-0"
                  style={{
                    backgroundColor: item.highlight ? colors.brand.primary : 'rgba(255,255,255,0.2)',
                    borderRadius: borderRadius.lg,
                  }}
                >
                  <span className="font-bold text-lg" style={{ color: colors.neutral.white }}>{item.step}</span>
                </div>
                <div>
                  <h3 className="font-bold text-sm" style={{ color: colors.neutral.white }}>
                    {item.title}
                    {item.highlight && <span style={{ color: colors.brand.primary }}> ← 지금 여기!</span>}
                  </h3>
                  <p className="text-xs mt-0.5" style={{ color: colors.text.inverseMuted }}>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <p className="text-xs mt-4" style={{ color: colors.text.inverseMuted }}>
            * Discovery 비용(20~30만 원)은 개발 계약 시 전액 차감됩니다.
          </p>
        </div>

        {/* Right Section - Contact Info */}
        <div
          className="w-1/2 h-full flex flex-col justify-center pl-8"
          style={{ borderLeft: '1px solid rgba(255,255,255,0.2)' }}
        >
          <div className="space-y-6">
            <div>
              <h3 className="text-xs uppercase tracking-wider mb-2" style={{ color: colors.text.inverseMuted }}>Email</h3>
              <p className="text-xl font-bold" style={{ color: colors.neutral.white }}>songjc6561@gmail.com</p>
            </div>
            <div>
              <h3 className="text-xs uppercase tracking-wider mb-2" style={{ color: colors.text.inverseMuted }}>Website</h3>
              <p className="text-xl font-bold" style={{ color: colors.neutral.white }}>khakisketch.com</p>
            </div>
          </div>

          {/* Logo */}
          <div
            className="mt-8 pt-6 flex items-center gap-3"
            style={{ borderTop: '1px solid rgba(255,255,255,0.2)' }}
          >
            <span className="w-4 h-4 rounded-full" style={{ backgroundColor: colors.brand.primary }}></span>
            <span className="font-bold text-2xl" style={{ color: colors.neutral.white }}>KhakiSketch</span>
          </div>
        </div>

        {/* Decorative */}
        <div
          className="absolute top-8 right-8 w-32 h-32 blur-3xl"
          style={{ backgroundColor: `${colors.brand.primary}33`, borderRadius: '50%' }}
        ></div>
        <div
          className="absolute bottom-12 left-[45%] w-24 h-24 blur-2xl"
          style={{ backgroundColor: `${colors.brand.primary}1a`, borderRadius: '50%' }}
        ></div>
      </div>
    </BrochurePageLandscape>
  );
}
