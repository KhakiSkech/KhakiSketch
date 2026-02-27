'use client';

/**
 * Firebase Auth 기반 관리자 인증 Hook
 * Custom Claims (admin: true) 기반 권한 확인 + 이메일 폴백 (마이그레이션 기간)
 */

import { useState, useEffect } from 'react';
import {
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    updatePassword,
    reauthenticateWithCredential,
    EmailAuthProvider,
    User,
} from 'firebase/auth';
import { getFirebaseAuth } from '@/lib/firebase';

interface UseAuthReturn {
    user: User | null;
    isLoading: boolean;
    isAdmin: boolean;
    error: string | null;
    signIn: (email: string, password: string) => Promise<void>;
    signOutUser: () => Promise<void>;
    changePassword: (currentPassword: string, newPassword: string) => Promise<void>;
}

// 마이그레이션 기간 폴백 - Custom Claims 배포 완료 후 제거 가능
const ADMIN_EMAILS_FALLBACK = process.env.NEXT_PUBLIC_ADMIN_EMAILS?.split(',') || [];

function isFirebaseError(e: unknown): e is { code: string; message: string } {
    return typeof e === 'object' && e !== null && 'code' in e && 'message' in e;
}

/**
 * Firebase Auth 기반 관리자 인증 Hook
 */
export function useAuth(): UseAuthReturn {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isAdmin, setIsAdmin] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const auth = getFirebaseAuth();

        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            setUser(currentUser);

            if (currentUser) {
                try {
                    // Custom Claims에서 admin 여부 확인
                    const tokenResult = await currentUser.getIdTokenResult(true);
                    const hasAdminClaim = tokenResult.claims.admin === true;
                    // 폴백: Claims 미설정 시 이메일 화이트리스트 확인
                    const inFallbackList = ADMIN_EMAILS_FALLBACK.includes(currentUser.email || '');
                    setIsAdmin(hasAdminClaim || inFallbackList);
                } catch {
                    // 토큰 갱신 실패 시 이메일 폴백
                    setIsAdmin(ADMIN_EMAILS_FALLBACK.includes(currentUser.email || ''));
                }
            } else {
                setIsAdmin(false);
            }

            setIsLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const signIn = async (email: string, password: string): Promise<void> => {
        try {
            setError(null);
            setIsLoading(true);
            const auth = getFirebaseAuth();
            const credential = await signInWithEmailAndPassword(auth, email, password);

            // Custom Claims 확인
            const tokenResult = await credential.user.getIdTokenResult(true);
            const hasAdminClaim = tokenResult.claims.admin === true;
            const inFallbackList = ADMIN_EMAILS_FALLBACK.includes(email);

            if (!hasAdminClaim && !inFallbackList) {
                await signOut(auth);
                throw new Error('관리자 권한이 없습니다.');
            }

            setIsAdmin(true);
        } catch (err: unknown) {
            const errorMessage = isFirebaseError(err)
                ? err.code === 'auth/invalid-credential'
                    ? '이메일 또는 비밀번호가 올바르지 않습니다.'
                    : err.code === 'auth/too-many-requests'
                        ? '너무 많은 로그인 시도가 있었습니다. 잠시 후 다시 시도해주세요.'
                        : err.message || '로그인에 실패했습니다.'
                : err instanceof Error && err.message === '관리자 권한이 없습니다.'
                    ? err.message
                    : '로그인에 실패했습니다.';

            setError(errorMessage);
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    const signOutUser = async (): Promise<void> => {
        try {
            const auth = getFirebaseAuth();
            await signOut(auth);
            setUser(null);
            setIsAdmin(false);
        } catch (err: unknown) {
            setError(isFirebaseError(err) ? err.message : '로그아웃에 실패했습니다.');
            throw err;
        }
    };

    const changePassword = async (currentPassword: string, newPassword: string): Promise<void> => {
        try {
            setError(null);
            const auth = getFirebaseAuth();
            const currentUser = auth.currentUser;

            if (!currentUser || !currentUser.email) {
                throw new Error('로그인된 사용자가 없습니다.');
            }

            // 현재 비밀번호로 재인증
            const credential = EmailAuthProvider.credential(currentUser.email, currentPassword);
            await reauthenticateWithCredential(currentUser, credential);

            // 새 비밀번호로 변경
            await updatePassword(currentUser, newPassword);
        } catch (err: unknown) {
            const errorMessage = isFirebaseError(err)
                ? err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential'
                    ? '현재 비밀번호가 올바르지 않습니다.'
                    : err.code === 'auth/weak-password'
                        ? '새 비밀번호가 너무 약합니다. 6자 이상 입력해주세요.'
                        : err.code === 'auth/too-many-requests'
                            ? '너무 많은 시도가 있었습니다. 잠시 후 다시 시도해주세요.'
                            : err.message || '비밀번호 변경에 실패했습니다.'
                : err instanceof Error
                    ? err.message
                    : '비밀번호 변경에 실패했습니다.';

            setError(errorMessage);
            throw new Error(errorMessage);
        }
    };

    return {
        user,
        isLoading,
        isAdmin,
        error,
        signIn,
        signOutUser,
        changePassword,
    };
}
