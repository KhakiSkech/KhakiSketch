'use client';

export default function SkipLink() {
  return (
    <a
      href="#main-content"
      className="skip-link sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-brand-primary focus:text-white focus:rounded-lg focus:font-bold focus:text-sm focus:shadow-lg"
    >
      본문으로 건너뛰기
    </a>
  );
}
