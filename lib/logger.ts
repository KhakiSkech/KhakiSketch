/**
 * 환경별 로깅 유틸리티
 * - development: 모든 로그 출력
 * - production: error만 출력 (info, warn 무시)
 */

const isDev = process.env.NODE_ENV === 'development';

export const logger = {
  info: (...args: unknown[]) => {
    if (isDev) console.log(...args);
  },
  warn: (...args: unknown[]) => {
    if (isDev) console.warn(...args);
  },
  error: (...args: unknown[]) => {
    console.error(...args);
  },
};
