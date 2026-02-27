// ===== 통합 타입 정의 =====
// 모든 타입의 단일 진입점

// 1. admin.ts의 모든 타입 re-export
export * from './admin';

// 2. 호환성을 위한 Type Alias
import { FirestoreProject, FirestoreArticle } from './admin';

export type Project = FirestoreProject;
export type Article = FirestoreArticle;

// 3. admin.ts에 없는 유틸리티 타입이 있다면 여기에 추가
// (현재는 admin.ts가 거의 모든 타입을 포함하므로 추가 정의 없음)
