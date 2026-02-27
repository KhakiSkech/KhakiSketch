'use client';

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    return (
        <html lang="ko">
            <body>
                <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
                    <div className="max-w-2xl w-full bg-white rounded-2xl shadow-lg p-8 lg:p-12">
                        <div className="flex flex-col items-center text-center gap-6">
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

                            <div>
                                <h1 className="text-3xl font-bold text-gray-900 mb-3">
                                    치명적인 오류 발생
                                </h1>
                                <p className="text-gray-600 text-lg">
                                    애플리케이션에서 치명적인 오류가 발생했습니다.
                                    <br />
                                    페이지를 새로고침해주세요.
                                </p>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-4 mt-4">
                                <button
                                    onClick={() => reset()}
                                    className="px-6 py-3 bg-gray-900 text-white font-bold rounded-xl hover:bg-gray-800 transition-all"
                                >
                                    새로고침
                                </button>
                                <a
                                    href="/"
                                    className="px-6 py-3 bg-white text-gray-900 font-bold rounded-xl border-2 border-gray-900 hover:bg-gray-50 transition-all inline-block"
                                >
                                    홈으로 이동
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </body>
        </html>
    );
}
