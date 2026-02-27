import React from 'react';
import BrochurePageLandscape from '../BrochurePageLandscape';
import { colors, borderRadius, shadows } from '../brochure-design-system';

export default function CommunicationPageLandscape() {
  const responsibilities = [
    { num: '01', title: '작업 범위 명확화', desc: '계약 전 기능 명세서로 범위를 명확히 정의합니다.' },
    { num: '02', title: '검수 기준', desc: '합의된 기능 명세 기준으로 검수를 진행합니다.' },
    { num: '03', title: '납품 후 책임', desc: '배포 후 1개월간 버그 수정 무상 지원합니다.' },
    { num: '04', title: '유지보수 옵션', desc: '장기 유지보수가 필요한 경우 별도 계약 가능합니다.' },
  ];

  return (
    <BrochurePageLandscape pageNumber={11} bgColor="white">
      <div className="h-full flex gap-8">
        {/* Left Section */}
        <div className="w-2/5 h-full flex flex-col justify-center">
          <span className="font-bold text-sm tracking-wider uppercase mb-3" style={{ color: colors.brand.primary }}>
            Communication
          </span>
          <h2 className="text-3xl font-bold leading-tight mb-4" style={{ color: colors.text.primary }}>
            소통 및 책임 범위
          </h2>
          {/* 따옴표 제거, CSS 스타일 적용 */}
          <p className="text-base mb-8" style={{ color: colors.text.secondary }}>
            <span className="font-bold" style={{ color: colors.brand.primary }}>문제가 생기지 않게</span> 계약 전부터 구조를 만듭니다.
          </p>

          {/* Communication Tools */}
          <div className="flex gap-4">
            <div className="flex-1 p-4 text-center" style={{ backgroundColor: colors.neutral.offWhite, borderRadius: borderRadius.xl }}>
              <div className="flex justify-center mb-2">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M6.194 14.644c0 1.16-.943 2.107-2.097 2.107S2 15.803 2 14.644c0-1.16.943-2.107 2.097-2.107h2.097v2.107zm1.055 0c0-1.16.943-2.107 2.097-2.107s2.097.947 2.097 2.107v5.249C11.443 21.053 10.5 22 9.346 22s-2.097-.947-2.097-2.107v-5.249z" fill="#E01E5A"/>
                  <path d="M9.346 6.107c-1.154 0-2.097-.947-2.097-2.107S8.192 2 9.346 2s2.097.947 2.097 2.107v2.107H9.346zm0 1.068c1.154 0 2.097.947 2.097 2.107s-.943 2.107-2.097 2.107H4.097C2.943 11.389 2 10.442 2 9.282s.943-2.107 2.097-2.107h5.249z" fill="#36C5F0"/>
                  <path d="M17.806 9.282c0-1.16.943-2.107 2.097-2.107S22 8.122 22 9.282s-.943 2.107-2.097 2.107h-2.097V9.282zm-1.055 0c0 1.16-.943 2.107-2.097 2.107s-2.097-.947-2.097-2.107V4.033C12.557 2.873 13.5 1.926 14.654 1.926s2.097.947 2.097 2.107v5.249z" fill="#2EB67D"/>
                  <path d="M14.654 17.819c1.154 0 2.097.947 2.097 2.107S15.808 22 14.654 22s-2.097-.947-2.097-2.107v-2.107h2.097v.033zm0-1.068c-1.154 0-2.097-.947-2.097-2.107s.943-2.107 2.097-2.107h5.249c1.154 0 2.097.947 2.097 2.107s-.943 2.107-2.097 2.107h-5.249z" fill="#ECB22E"/>
                </svg>
              </div>
              <h3 className="font-bold text-sm" style={{ color: colors.text.primary }}>Slack</h3>
              <p className="text-xs" style={{ color: colors.text.secondary }}>실시간 소통 및 빠른 피드백</p>
            </div>
            <div className="flex-1 p-4 text-center" style={{ backgroundColor: colors.neutral.offWhite, borderRadius: borderRadius.xl }}>
              <div className="flex justify-center mb-2">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M4 4.5A2.5 2.5 0 016.5 2h11A2.5 2.5 0 0120 4.5v15a2.5 2.5 0 01-2.5 2.5h-11A2.5 2.5 0 014 19.5v-15z" fill="#fff" stroke={colors.brand.dark} strokeWidth="1.5"/>
                  <path d="M8 7h8M8 11h8M8 15h5" stroke={colors.brand.dark} strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </div>
              <h3 className="font-bold text-sm" style={{ color: colors.text.primary }}>Notion</h3>
              <p className="text-xs" style={{ color: colors.text.secondary }}>진행 상황 및 문서 공유</p>
            </div>
          </div>
        </div>

        {/* Right Section - Responsibilities */}
        <div className="w-3/5 h-full flex flex-col justify-center">
          <h3 className="font-bold text-lg mb-4" style={{ color: colors.text.primary }}>책임 범위</h3>
          <div className="grid grid-cols-2 gap-4">
            {responsibilities.map((item, index) => (
              <div
                key={index}
                className="p-4"
                style={{
                  backgroundColor: colors.neutral.offWhite,
                  borderRadius: borderRadius.xl,
                }}
              >
                <div className="flex items-start gap-3">
                  <span className="font-bold text-sm shrink-0" style={{ color: colors.brand.primary }}>{item.num}</span>
                  <div>
                    <h4 className="font-bold text-sm mb-1" style={{ color: colors.text.primary }}>{item.title}</h4>
                    <p className="text-xs" style={{ color: colors.text.secondary }}>{item.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </BrochurePageLandscape>
  );
}
