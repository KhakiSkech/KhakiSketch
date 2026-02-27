'use client';

import React from 'react';
import { useQuote } from '../QuoteContext';
import SelectionCard from '../ui/SelectionCard';

const projectTypes = [
    {
        id: 'startup-mvp',
        icon: (
            <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 00-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 01-2.448-2.448 14.9 14.9 0 01.06-.312m-2.24 2.39a4.493 4.493 0 00-1.757 4.306 4.493 4.493 0 004.306-1.758M16.5 9a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
            </svg>
        ),
        title: '스타트업 MVP',
        description: '빠른 시장 검증을 위한 핵심 기능 중심 개발. 3~4개월 내 런칭 목표.',
    },
    {
        id: 'homepage',
        icon: (
            <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
            </svg>
        ),
        title: '기업 홈페이지',
        description: '브랜드를 대표하는 전문 웹사이트. SEO 최적화 및 관리자 기능 포함.',
    },
    {
        id: 'automation',
        icon: (
            <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12a7.5 7.5 0 0015 0m-15 0a7.5 7.5 0 1115 0m-15 0H3m16.5 0H21m-1.5 0H12m-8.457 3.077l1.41-.513m14.095-5.13l1.41-.513M5.106 17.785l1.15-.964m11.49-9.642l1.149-.964M7.501 19.795l.75-1.3m7.5-12.99l.75-1.3m-6.063 16.658l.26-1.477m2.605-14.772l.26-1.477m0 17.726l-.26-1.477M10.698 4.614l-.26-1.477M16.5 19.794l-.75-1.299M7.5 4.205L12 12m6.894 5.785l-1.149-.964M6.256 7.178l-1.15-.964m15.352 8.864l-1.41-.513M4.954 9.435l-1.41-.514M12.002 12l-3.75 6.495" />
            </svg>
        ),
        title: '업무 자동화',
        description: '반복 업무를 시스템으로 전환. 데이터 수집, 리포트 생성, API 연동 등.',
    },
    {
        id: 'trading',
        icon: (
            <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
            </svg>
        ),
        title: '트레이딩/자동매매',
        description: '주식, 코인 자동매매 시스템. API 연동, 전략 백테스팅, 실시간 모니터링.',
    },
    {
        id: 'app',
        icon: (
            <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" />
            </svg>
        ),
        title: '앱 개발',
        description: 'iOS/Android 앱 또는 크로스플랫폼 앱. Flutter, React Native 활용.',
    },
    {
        id: 'other',
        icon: (
            <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
            </svg>
        ),
        title: '기타',
        description: '위에 해당하지 않는 프로젝트. 직접 설명해 주세요.',
    },
];

export default function ProjectTypeStep() {
    const { data, updateData, nextStep } = useQuote();

    const handleSelect = (typeId: string) => {
        updateData({ projectType: typeId });
    };

    const canProceed = data.projectType !== '';

    // Handle keyboard navigation
    React.useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Enter' && canProceed) {
                nextStep();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [canProceed, nextStep]);

    return (
        <div className="w-full max-w-4xl mx-auto px-4 pb-20">
            {/* Header */}
            <div className="text-center mb-12">
                <span className="inline-block px-4 py-1.5 rounded-full bg-brand-secondary/10 text-brand-secondary text-sm font-medium mb-4">
                    Step 1 of 4
                </span>
                <h1 className="text-3xl lg:text-4xl font-bold text-brand-primary mb-4">
                    어떤 프로젝트를 계획하고 계신가요?
                </h1>
                <p className="text-gray-500 text-lg">
                    가장 가까운 유형을 선택해 주세요. 상세 내용은 다음 단계에서 작성합니다.
                </p>
            </div>

            {/* Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
                {projectTypes.map((type) => (
                    <div key={type.id}>
                        <SelectionCard
                            icon={type.icon}
                            title={type.title}
                            description={type.description}
                            isSelected={data.projectType === type.id}
                            onClick={() => handleSelect(type.id)}
                        />
                    </div>
                ))}
            </div>

            {/* Other Input */}
            {data.projectType === 'other' && (
                <div className="mb-12">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        프로젝트 유형을 직접 입력해 주세요
                    </label>
                    <input
                        type="text"
                        value={data.projectTypeOther || ''}
                        onChange={(e) => updateData({ projectTypeOther: e.target.value })}
                        placeholder="예: AI 챗봇 개발, 데이터 분석 대시보드 등"
                        className="w-full h-12 px-4 rounded-xl border border-gray-200 bg-gray-100 focus:bg-white focus:border-brand-secondary focus:ring-2 focus:ring-brand-secondary/20 focus:outline-none transition-all"
                    />
                </div>
            )}

            {/* Navigation */}
            <div className="flex justify-end">
                <button
                    onClick={nextStep}
                    disabled={!canProceed}
                    className={`px-8 py-3 rounded-xl font-bold text-white transition-all duration-300 ${canProceed
                        ? 'bg-brand-primary hover:bg-brand-secondary shadow-lg hover:shadow-xl'
                        : 'bg-gray-300 cursor-not-allowed'
                        }`}
                >
                    다음 단계 →
                </button>
            </div>
        </div>
    );
}

