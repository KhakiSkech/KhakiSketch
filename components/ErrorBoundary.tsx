'use client';

import { logger } from '@/lib/logger';
import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
    children: ReactNode;
    fallback?: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
    errorInfo: ErrorInfo | null;
}

/**
 * React Error Boundary
 * 하위 컴포넌트 트리에서 발생하는 JavaScript 에러를 캐치하고 폴백 UI를 표시
 */
class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            hasError: false,
            error: null,
            errorInfo: null,
        };
    }

    static getDerivedStateFromError(error: Error): Partial<State> {
        return { hasError: true };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        logger.error('Error Boundary caught an error:', error, errorInfo);

        this.setState({
            error,
            errorInfo,
        });
    }

    handleReset = () => {
        this.setState({
            hasError: false,
            error: null,
            errorInfo: null,
        });
    };

    render() {
        if (this.state.hasError) {
            // 커스텀 폴백 UI가 제공된 경우
            if (this.props.fallback) {
                return this.props.fallback;
            }

            // 기본 폴백 UI
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
                                    문제가 발생했습니다
                                </h1>
                                <p className="text-brand-muted text-lg">
                                    죄송합니다. 예상치 못한 오류가 발생했습니다.
                                    <br className="hidden sm:block" />
                                    페이지를 새로고침하거나 잠시 후 다시 시도해주세요.
                                </p>
                            </div>

                            {/* Error Details (개발 환경에서만 표시) */}
                            {process.env.NODE_ENV === 'development' && this.state.error && (
                                <details className="w-full mt-4 p-4 bg-gray-50 rounded-lg text-left">
                                    <summary className="cursor-pointer font-bold text-brand-primary mb-2">
                                        에러 상세 정보 (개발 모드)
                                    </summary>
                                    <pre className="text-xs text-red-600 overflow-auto max-h-60 whitespace-pre-wrap break-words">
                                        {this.state.error.toString()}
                                        {'\n\n'}
                                        {this.state.errorInfo?.componentStack}
                                    </pre>
                                </details>
                            )}

                            {/* Action Buttons */}
                            <div className="flex flex-col sm:flex-row gap-4 mt-4">
                                <button
                                    onClick={this.handleReset}
                                    className="px-6 py-3 bg-brand-primary text-white font-bold rounded-xl hover:bg-brand-primary/90 transition-all"
                                >
                                    다시 시도
                                </button>
                                <button
                                    onClick={() => (window.location.href = '/')}
                                    className="px-6 py-3 bg-white text-brand-primary font-bold rounded-xl border-2 border-brand-primary hover:bg-brand-bg transition-all"
                                >
                                    홈으로 이동
                                </button>
                            </div>

                            {/* Support Link */}
                            <p className="text-sm text-brand-muted mt-4">
                                문제가 계속되면{' '}
                                <a
                                    href="/contact"
                                    className="text-brand-secondary font-bold hover:underline"
                                >
                                    고객 지원
                                </a>
                                으로 문의해주세요.
                            </p>
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
