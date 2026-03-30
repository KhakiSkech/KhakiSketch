/**
 * 공통 유틸리티 함수
 */

import type { ProjectTech } from '@/types/admin';

/**
 * 타임아웃과 함께 Promise 실행
 * clearTimeout을 포함하여 메모리 누수 방지
 */
export function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  let timeoutId: ReturnType<typeof setTimeout>;
  const timeout = new Promise<never>((_, reject) => {
    timeoutId = setTimeout(() => reject(new Error('Timeout')), ms);
  });
  return Promise.race([promise, timeout]).finally(() => {
    clearTimeout(timeoutId);
  });
}

/**
 * 제목 기반 slug 생성
 * articles와 projects 모두에서 사용
 */
export function generateSlug(title: string, maxLength: number = 80): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9가-힣\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .substring(0, maxLength);
}

/**
 * HTML 콘텐츠가 실질적으로 비어있는지 확인
 * TipTap은 빈 에디터에서 '<p></p>' 등을 반환하므로 태그 제거 후 판별
 */
export function isContentEmpty(html: string): boolean {
  const stripped = html.replace(/<[^>]*>/g, '').trim();
  return stripped.length === 0;
}

/**
 * ProjectTech에서 기술 스택 문자열 생성
 * 모든 카테고리(frontend, backend, database, other)를 통합하여 반환
 */
export function getProjectTechString(tech?: ProjectTech, maxItems: number = 4): string {
  if (!tech) return '';
  return [
    ...(tech.frontend || []),
    ...(tech.backend || []),
    ...(tech.database || []),
    ...(tech.other || []),
  ].slice(0, maxItems).join(' / ');
}
