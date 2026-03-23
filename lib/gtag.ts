// GA4 커스텀 이벤트 헬퍼

export function trackEvent(
  eventName: string,
  params?: Record<string, string | number | boolean | undefined>
): void {
  if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
    window.gtag('event', eventName, params);
  }
}

// 포트폴리오 카드 클릭
export function trackPortfolioClick(projectId: string, title: string, category: string): void {
  trackEvent('portfolio_click', {
    project_id: projectId,
    project_title: title,
    category,
  });
}

// CTA 버튼 클릭
export function trackCtaClick(location: string, text: string): void {
  trackEvent('cta_click', {
    cta_location: location,
    cta_text: text,
  });
}

// 견적 폼 제출
export function trackQuoteSubmit(source: string, projectType: string): void {
  trackEvent('quote_submit', {
    source,
    project_type: projectType,
  });
}
