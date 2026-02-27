import React from 'react';
import BrochurePageLandscape from '../BrochurePageLandscape';
import { colors, borderRadius, shadows } from '../brochure-design-system';

export default function ServicesPageLandscape() {
  const services = [
    {
      title: 'Startup MVP Studio',
      subtitle: '예비·초기창업 / 스타트업',
      checklist: [
        '투자 IR / 데모데이가 3~4개월 내에 있다',
        '지원사업 선정 후 개발이 필요하다',
        '아이디어는 있지만 기획이 막막하다',
      ],
      price: '700~1,500만 원',
      duration: '3~4개월',
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
          <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
        </svg>
      ),
      color: colors.brand.primary,
    },
    {
      title: 'Business Web & Automation',
      subtitle: '성장하는 기업 / 서비스업',
      checklist: [
        '엑셀이나 수기로 관리하는 업무가 있다',
        '온라인 예약이나 문의 시스템이 필요하다',
        '브랜드 웹사이트가 필요하다',
      ],
      price: '300~800만 원',
      duration: '1~2개월',
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
          <line x1="8" y1="21" x2="16" y2="21" />
          <line x1="12" y1="17" x2="12" y2="21" />
        </svg>
      ),
      color: colors.brand.dark,
    },
    {
      title: 'Custom Internal Systems',
      subtitle: '기성 SaaS로 해결 안 되는 팀',
      checklist: [
        '노션·시트로는 우리 방식에 안 맞는다',
        '외부 공개 없이 사내용으로만 쓰고 싶다',
        '기존 툴에서 원하는 기능이 없다',
      ],
      price: '400만 원~',
      duration: '협의',
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 3v3m0 12v3M3 12h3m12 0h3" />
          <circle cx="12" cy="12" r="4" />
        </svg>
      ),
      color: colors.brand.medium,
    },
  ];

  return (
    <BrochurePageLandscape pageNumber={5} bgColor="white">
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="flex items-end justify-between mb-5">
          <div>
            <span className="font-bold text-xs tracking-wider uppercase" style={{ color: colors.brand.primary }}>Services</span>
            <h2 className="text-3xl font-bold mt-1" style={{ color: colors.text.primary }}>어떤 상황인가요?</h2>
          </div>
          <p className="text-xs" style={{ color: colors.text.muted }}>해당되는 항목이 많은 서비스를 추천드립니다.</p>
        </div>

        {/* Service Cards - Checklist Style */}
        <div className="flex-1 flex gap-5">
          {services.map((service, index) => (
            <div
              key={index}
              className="flex-1 overflow-hidden flex flex-col"
              style={{
                boxShadow: shadows.lg,
                borderRadius: borderRadius['2xl'],
              }}
            >
              {/* Header with Icon */}
              <div
                className="h-20 flex items-center justify-between px-4"
                style={{ backgroundColor: service.color }}
              >
                <div>
                  <span className="text-[9px] uppercase tracking-wider" style={{ color: 'rgba(255,255,255,0.6)' }}>{service.subtitle}</span>
                  <h3 className="font-bold text-base mt-0.5" style={{ color: colors.neutral.white }}>{service.title}</h3>
                </div>
                <div
                  className="w-12 h-12 flex items-center justify-center"
                  style={{
                    backgroundColor: 'rgba(255,255,255,0.15)',
                    borderRadius: borderRadius.xl,
                  }}
                >
                  {service.icon}
                </div>
              </div>

              {/* Checklist Content */}
              <div className="flex-1 p-4 flex flex-col" style={{ backgroundColor: colors.neutral.white }}>
                <p className="text-[10px] font-medium mb-3" style={{ color: colors.text.muted }}>
                  이런 분들께 추천드려요
                </p>
                <ul className="space-y-2 flex-1">
                  {service.checklist.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <div
                        className="w-4 h-4 rounded flex items-center justify-center shrink-0 mt-0.5"
                        style={{ border: `1.5px solid ${service.color}` }}
                      >
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke={service.color} strokeWidth="3">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      </div>
                      <span className="text-xs leading-relaxed" style={{ color: colors.text.secondary }}>
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>

                {/* Price Section */}
                <div
                  className="mt-3 pt-3 flex justify-between items-center"
                  style={{ borderTop: `1px solid ${colors.neutral.gray200}` }}
                >
                  <div>
                    <p className="text-[9px]" style={{ color: colors.text.muted }}>예산</p>
                    <p className="text-sm font-bold" style={{ color: service.color }}>{service.price}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[9px]" style={{ color: colors.text.muted }}>기간</p>
                    <p className="text-sm font-medium" style={{ color: colors.text.primary }}>{service.duration}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </BrochurePageLandscape>
  );
}
