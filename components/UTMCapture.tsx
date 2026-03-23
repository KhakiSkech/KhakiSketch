'use client';

import { useEffect } from 'react';

const UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign'] as const;

export default function UTMCapture() {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const params = new URLSearchParams(window.location.search);
    const hasUtm = UTM_KEYS.some((key) => params.has(key));

    if (!hasUtm) return;

    // First-touch: 이미 값이 있으면 덮어쓰지 않음
    const existing = sessionStorage.getItem('utm_source');
    if (existing) return;

    for (const key of UTM_KEYS) {
      const value = params.get(key);
      if (value) {
        sessionStorage.setItem(key, value);
      }
    }
  }, []);

  return null;
}
