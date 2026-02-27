'use client';

import { logger } from '@/lib/logger';
import { useEffect } from 'react';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        logger.error('Page Error:', error);
    }, [error]);

    return (
        <div className="min-h-screen bg-brand-bg flex items-center justify-center px-6">
            <div className="max-w-2xl w-full bg-white rounded-2xl shadow-lg p-8 lg:p-12">
                <div className="flex flex-col items-center text-center gap-6">
                    {/* Error Icon */}
                    <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center">
                        <svg
                            className="w-10 h-10 text-red-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            aria-hidden="true"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                            />
                        </svg>
                    </div>

                    {/* Error Message */}
                    <div>
                        <h1 className="text-3xl font-bold text-brand-primary mb-3">
                            페이지 로딩 실패
                        </h1>
                        <p className="text-brand-muted text-lg">
                            페이지를 불러오는 중 오류가 발생했습니다.
                            <br />
                            다시 시도하거나 홈으로 돌아가주세요.
                        </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 mt-4">
                        <button
                            onClick={() => reset()}
                            className="px-6 py-3 bg-brand-primary text-white font-bold rounded-xl hover:bg-brand-primary/90 transition-all"
                        >
                            다시 시도
                        </button>
                        <a
                            href="/"
                            className="px-6 py-3 bg-white text-brand-primary font-bold rounded-xl border-2 border-brand-primary hover:bg-brand-bg transition-all inline-block"
                        >
                            홈으로 이동
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}
