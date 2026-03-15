import React from 'react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-brand-primary w-full pt-20 pb-10 text-white">
      <div className="w-full max-w-7xl mx-auto px-6 lg:px-8 flex flex-col">
        <div className="flex flex-col lg:flex-row justify-between items-start gap-12 lg:gap-16">

          {/* Brand & Slogan */}
          <div className="flex flex-col gap-8 max-w-md">
            <div className="flex items-center gap-3">
              <img src="/logo.png" alt="KhakiSketch" width={40} height={40} className="w-10 h-10 object-contain brightness-0 invert" />
              <span className="font-bold text-2xl tracking-tight text-white">KhakiSketch</span>
            </div>
            <p className="font-medium text-white/70 text-lg leading-relaxed">
              웹(Web), 데이터(Data), 그리고 자동화(Automation).<br />
              소프트웨어의 명확함으로<br />
              비즈니스의 본질을 꿰뚫는 제품을 만듭니다.
            </p>
          </div>

          {/* Links */}
          <div className="flex flex-col sm:flex-row gap-16 lg:gap-24 w-full lg:w-auto">
            <div className="flex flex-col gap-6">
              <h3 className="font-bold text-white text-lg tracking-wide uppercase opacity-90">Services</h3>
              <div className="flex flex-col gap-4 font-medium text-white/60 text-base">
                <Link href="/services/startup-mvp" className="hover:text-brand-secondary transition-colors">Startup MVP</Link>
                <Link href="/services/business-automation" className="hover:text-brand-secondary transition-colors">Business Automation</Link>
                <Link href="/services/corporate-website" className="hover:text-brand-secondary transition-colors">Corporate Website</Link>
              </div>
            </div>

            <div className="flex flex-col gap-6">
              <h3 className="font-bold text-white text-lg tracking-wide uppercase opacity-90">Contact</h3>
              <div className="flex flex-col gap-4 font-medium text-white/60 text-base">
                <p>충청북도 청주시 상당구<br />용암북로 160번길 20(대화프라자), 202호</p>
                <a href="mailto:songjc6561@gmail.com" className="hover:text-brand-secondary transition-colors">songjc6561@gmail.com</a>
                <p>Tel. 043-288-4860<br />Fax. 043-288-4862</p>
              </div>
            </div>

            <div className="flex flex-col gap-6">
              <h3 className="font-bold text-white text-lg tracking-wide uppercase opacity-90">Company</h3>
              <div className="flex flex-col gap-4 font-medium text-white/60 text-base">
                <Link href="/about" className="hover:text-brand-secondary transition-colors">About Us</Link>
                <Link href="/process" className="hover:text-brand-secondary transition-colors">Work Process</Link>
                <Link href="/portfolio" className="hover:text-brand-secondary transition-colors">Portfolio</Link>
              </div>
            </div>
          </div>
        </div>

        {/* Footer CTA */}
        <div className="mt-16 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-6">
          <p className="text-white/60 text-sm">
            프로젝트가 필요하신가요? 15분 무료 상담으로 시작하세요.
          </p>
          <Link
            href="/quote"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-brand-secondary text-white font-bold text-sm hover:bg-brand-secondary/90 transition-all hover:-translate-y-0.5 shadow-md shadow-brand-secondary/25 shrink-0"
          >
            무료 상담 신청하기
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-6 text-white/40 text-sm">
          <p>© {new Date().getFullYear()} KhakiSketch. All rights reserved.</p>
          <div className="flex items-center gap-8">
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
            <a
              href="https://github.com/khakisketch"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors"
              aria-label="GitHub"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.604-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
