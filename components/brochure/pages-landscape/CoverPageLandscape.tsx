import React from 'react';
import BrochurePageLandscape from '../BrochurePageLandscape';
import { colors, borderRadius } from '../brochure-design-system';

export default function CoverPageLandscape() {
  return (
    <BrochurePageLandscape pageNumber={1} showPageNumber={false} bgColor="brand">
      <div className="h-full flex relative overflow-hidden">
        {/* Background Decorative Elements */}
        <div
          className="absolute top-[-50px] right-[-100px] w-[400px] h-[400px] rounded-full opacity-10"
          style={{ background: `radial-gradient(circle, ${colors.brand.primary} 0%, transparent 70%)` }}
        />
        <div
          className="absolute bottom-[-100px] left-[30%] w-[300px] h-[300px] rounded-full opacity-5"
          style={{ background: `radial-gradient(circle, ${colors.brand.primary} 0%, transparent 70%)` }}
        />

        {/* Grid Pattern Overlay */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                              linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: '40px 40px'
          }}
        />

        {/* Left Section - Main Content */}
        <div className="w-3/5 h-full flex flex-col justify-center pr-12 relative z-10">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-10">
            <div className="w-4 h-4 rounded-full" style={{ backgroundColor: colors.brand.primary }} />
            <span className="font-bold text-2xl tracking-tight" style={{ color: colors.neutral.white }}>KhakiSketch</span>
          </div>

          {/* Main Title - 한글 슬로건 */}
          <h1 className="text-[56px] font-bold leading-[1.1] mb-6">
            <span style={{ color: colors.neutral.white }}>아이디어를</span>
            <br />
            <span style={{ color: colors.brand.primary }}>제품으로.</span>
          </h1>

          {/* Tagline */}
          <p className="text-xl leading-relaxed mb-10" style={{ color: colors.text.inverseSecondary }}>
            비즈니스의 본질을 꿰뚫는 제품을 만드는
            <br />
            소프트웨어 스튜디오
          </p>

          {/* Divider */}
          <div className="w-16 h-[2px] mb-6" style={{ backgroundColor: colors.brand.primary }} />

          {/* Contact Info */}
          <div className="flex gap-8">
            <div>
              <p className="text-xs mb-1" style={{ color: colors.text.inverseMuted }}>Email</p>
              <p className="text-sm font-medium" style={{ color: colors.neutral.white }}>songjc6561@gmail.com</p>
            </div>
            <div>
              <p className="text-xs mb-1" style={{ color: colors.text.inverseMuted }}>Year</p>
              <p className="text-sm font-medium" style={{ color: colors.neutral.white }}>2025</p>
            </div>
          </div>
        </div>

        {/* Right Section - Visual Element */}
        <div className="w-2/5 h-full flex items-center justify-center relative z-10">
          {/* Abstract Visual */}
          <div className="relative">
            {/* Outer Ring */}
            <div
              className="w-[220px] h-[220px] rounded-full border-2 flex items-center justify-center"
              style={{ borderColor: `${colors.brand.primary}4D` }}
            >
              {/* Middle Ring */}
              <div
                className="w-[160px] h-[160px] rounded-full border flex items-center justify-center"
                style={{ borderColor: `${colors.brand.primary}33` }}
              >
                {/* Logo Circle */}
                <div
                  className="w-[100px] h-[100px] rounded-full flex items-center justify-center"
                  style={{ backgroundColor: `${colors.brand.primary}26` }}
                >
                  <div
                    className="w-[70px] h-[70px] rounded-full flex items-center justify-center"
                    style={{ backgroundColor: colors.brand.primary }}
                  >
                    <span className="text-3xl font-bold" style={{ color: colors.neutral.white }}>K</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Elements */}
            <div className="absolute top-[-20px] right-[-30px] w-3 h-3 rounded-full" style={{ backgroundColor: colors.brand.primary }} />
            <div className="absolute bottom-[20px] left-[-40px] w-2 h-2 rounded-full" style={{ backgroundColor: `${colors.brand.primary}80` }} />
            <div className="absolute top-[40%] right-[-50px] w-4 h-4 rounded-full" style={{ backgroundColor: `${colors.brand.primary}4D` }} />
          </div>

          {/* Service Tags - 한글화 */}
          <div className="absolute bottom-8 right-0 flex flex-col gap-2 items-end">
            {['MVP 개발', '업무 자동화', '맞춤 시스템'].map((tag, i) => (
              <div
                key={i}
                className="px-3 py-1 text-xs"
                style={{
                  backgroundColor: `${colors.brand.primary}26`,
                  color: colors.text.inverseSecondary,
                  borderRadius: borderRadius.full,
                }}
              >
                {tag}
              </div>
            ))}
          </div>
        </div>
      </div>
    </BrochurePageLandscape>
  );
}
