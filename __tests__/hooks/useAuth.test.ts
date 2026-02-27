import { describe, it, expect } from 'vitest';

// Test the isFirebaseError type guard (extracted logic from useAuth.ts)
function isFirebaseError(e: unknown): e is { code: string; message: string } {
    return typeof e === 'object' && e !== null && 'code' in e && 'message' in e;
}

describe('isFirebaseError type guard', () => {
    it('returns true for Firebase-like error objects', () => {
        const err = { code: 'auth/invalid-credential', message: 'Invalid credential' };
        expect(isFirebaseError(err)).toBe(true);
    });

    it('returns false for null', () => {
        expect(isFirebaseError(null)).toBe(false);
    });

    it('returns false for undefined', () => {
        expect(isFirebaseError(undefined)).toBe(false);
    });

    it('returns false for plain string', () => {
        expect(isFirebaseError('error string')).toBe(false);
    });

    it('returns false for object without code', () => {
        expect(isFirebaseError({ message: 'test' })).toBe(false);
    });

    it('returns false for object without message', () => {
        expect(isFirebaseError({ code: 'test' })).toBe(false);
    });

    it('returns true for Error-like object with code and message', () => {
        const err = new Error('test');
        (err as Error & { code: string }).code = 'auth/too-many-requests';
        expect(isFirebaseError(err)).toBe(true);
    });
});

describe('admin email whitelist logic (fallback)', () => {
    it('correctly checks if email is in admin list', () => {
        const ADMIN_EMAILS = ['admin@test.com', 'admin2@test.com'];
        expect(ADMIN_EMAILS.includes('admin@test.com')).toBe(true);
        expect(ADMIN_EMAILS.includes('user@test.com')).toBe(false);
        expect(ADMIN_EMAILS.includes('')).toBe(false);
    });

    it('handles empty admin list', () => {
        const ADMIN_EMAILS: string[] = [];
        expect(ADMIN_EMAILS.includes('admin@test.com')).toBe(false);
    });

    it('handles comma-separated email parsing', () => {
        const envValue = 'admin@test.com,admin2@test.com';
        const parsed = envValue.split(',');
        expect(parsed).toEqual(['admin@test.com', 'admin2@test.com']);
    });

    it('handles undefined env value', () => {
        const envValue = undefined as string | undefined;
        const parsed = envValue?.split(',') || [];
        expect(parsed).toEqual([]);
    });
});

// Custom Claims 기반 관리자 인증 로직 테스트
describe('Custom Claims admin logic', () => {
    // isAdmin 판단 로직을 순수 함수로 추출하여 테스트
    function resolveIsAdmin(
        hasAdminClaim: boolean,
        email: string,
        fallbackEmails: string[]
    ): boolean {
        return hasAdminClaim || fallbackEmails.includes(email);
    }

    it('admin claim이 true이면 관리자로 인식', () => {
        expect(resolveIsAdmin(true, 'any@test.com', [])).toBe(true);
    });

    it('admin claim이 false여도 폴백 이메일 목록에 있으면 관리자로 인식', () => {
        expect(resolveIsAdmin(false, 'admin@test.com', ['admin@test.com'])).toBe(true);
    });

    it('admin claim이 false이고 폴백 목록에도 없으면 관리자가 아님', () => {
        expect(resolveIsAdmin(false, 'user@test.com', ['admin@test.com'])).toBe(false);
    });

    it('admin claim이 true이면 폴백 목록 무관하게 관리자', () => {
        expect(resolveIsAdmin(true, 'admin@test.com', ['admin@test.com'])).toBe(true);
        expect(resolveIsAdmin(true, 'other@test.com', ['admin@test.com'])).toBe(true);
    });
});
