'use client';

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuote } from '../QuoteContext';

// Define scenarios for different project types
const PROJECT_SCENARIOS: Record<string, { label: string; tags: string[] }> = {
    'startup-mvp': {
        label: '어떤 종류의 서비스인가요?',
        tags: ['플랫폼(중개/매칭)', '커머스/마켓', '커뮤니티/SNS', 'SaaS/업무도구', '정보/콘텐츠', '지도/위치기반', 'AI/데이터', '금융/핀테크']
    },
    'homepage': {
        label: '웹사이트의 주 목적은 무엇인가요?',
        tags: ['기업/브랜드 홍보', '제품/서비스 소개', '상품 판매(커머스)', '고객문의/DB수집', '채용/인재영입', 'IR/투자정보', '뉴스룸/보도자료', '파트너/제휴']
    },
    'automation': {
        label: '어떤 업무를 자동화하고 싶으신가요?',
        tags: ['데이터 크롤링/수집', '엑셀/문서 자동화', 'SNS/마케팅 자동화', '지표/대시보드 구축', '매크로/RPA', '재고/발주 연동', '알림봇(Slack/카톡)', '정산/회계 자동화']
    },
    'trading': {
        label: '어떤 투자 상품을 다루시나요?',
        tags: ['국내 주식', '해외 주식', '가상화폐(코인)', '선물/옵션', 'FX/환율', 'DeFi/NFT']
    },
    'app': {
        label: '어떤 종류의 앱인가요?',
        tags: ['쇼핑몰/커머스', '배달/O2O', '지도/위치기반', '헬스케어/운동', '교육/강의', '금융/핀테크', '소셜/커뮤니티']
    },
    'default': {
        label: '프로젝트의 성격을 알려주세요',
        tags: ['신규 서비스 구축', '기존 서비스 리뉴얼', '유지보수/고도화', 'MVP 제작', '사내 시스템']
    }
};

const STOCK_EXCHANGES = ['키움증권', '한국투자증권', '이베스트', '나무(NH)', '미래에셋', '삼성증권', 'KB증권', '증권사 무관'];
const CRYPTO_EXCHANGES = ['업비트', '빗썸', '코인원', '바이낸스', '바이비트', '비트겟', '거래소 무관'];

export default function ProjectDetailsStep() {
    const { data, updateData, nextStep, prevStep } = useQuote();

    const scenario = PROJECT_SCENARIOS[data.projectType] || PROJECT_SCENARIOS['default'];

    // Handle tag toggling
    const toggleTag = (tag: string) => {
        const currentTags = data.projectTags || [];
        const newTags = currentTags.includes(tag)
            ? currentTags.filter(t => t !== tag)
            : [...currentTags, tag];
        updateData({ projectTags: newTags });
    };

    const toggleExchange = (ex: string) => {
        const current = data.targetExchanges || [];
        const updated = current.includes(ex)
            ? current.filter(e => e !== ex)
            : [...current, ex];
        updateData({ targetExchanges: updated });
    }

    // Proceed if at least one tag is selected
    const canProceed = data.projectTags && data.projectTags.length > 0;

    // Handle keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Enter' && canProceed && (e.target as HTMLElement).tagName !== 'TEXTAREA') {
                nextStep();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [canProceed, nextStep]);

    // Check trading categories
    const isStockRelated = data.projectTags?.some(t => ['국내 주식', '해외 주식', '선물/옵션', 'FX/환율'].includes(t));
    const isCryptoRelated = data.projectTags?.some(t => ['가상화폐(코인)', 'DeFi/NFT', '선물/옵션'].includes(t));
    // If nothing selected yet, show both or neither? Show both for exploration if trading type
    const showAllExchanges = !data.projectTags || data.projectTags.length === 0;

    return (
        <div className="w-full max-w-4xl mx-auto px-4 pb-20">
            {/* Header */}
            <div className="text-center mb-10">
                <span className="inline-block px-4 py-1.5 rounded-full bg-brand-secondary/10 text-brand-secondary text-sm font-medium mb-4">
                    Step 2 of 4
                </span>
                <h1 className="text-3xl lg:text-4xl font-bold text-brand-primary mb-4">
                    어떤 서비스와 목표를 생각하시나요?
                </h1>
                <p className="text-gray-500 text-lg">
                    해당하는 항목을 선택해 주시면 저희가 프로젝트를 이해하는 데 큰 도움이 됩니다.
                </p>
            </div>

            <div className="space-y-8 mb-12">
                {/* 1. Category Tags (Scenario based) */}
                <div>
                    <label className="block text-lg font-bold text-gray-800 mb-4">
                        {scenario.label} <span className="text-sm font-normal text-brand-secondary ml-2">(복수 선택 가능)</span>
                    </label>
                    <div className="flex flex-wrap gap-3 mb-3">
                        {scenario.tags.map(tag => (
                            <button
                                key={tag}
                                onClick={() => toggleTag(tag)}
                                className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-200 ${data.projectTags?.includes(tag)
                                    ? 'bg-brand-secondary text-white shadow-md transform scale-105'
                                    : 'bg-white border border-gray-200 text-gray-600 hover:border-brand-secondary/50 hover:bg-gray-50'
                                    }`}
                            >
                                {tag}
                            </button>
                        ))}

                        {/* 'Other' Tag Option */}
                        <button
                            onClick={() => toggleTag('기타')}
                            className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-200 ${data.projectTags?.includes('기타')
                                ? 'bg-gray-800 text-white shadow-md transform scale-105'
                                : 'bg-white border border-gray-200 text-gray-500 hover:border-gray-400 hover:bg-gray-50'
                                }`}
                        >
                            기타
                        </button>
                    </div>
                </div>

                {/* --- Trading Exclusive: Exchange Selection --- */}
                {data.projectType === 'trading' && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="space-y-6 bg-gray-50 p-6 rounded-2xl border border-gray-200"
                    >
                        <h3 className="font-bold text-gray-800 flex items-center gap-2">
                            <svg className="w-5 h-5 text-brand-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
                            연동 희망 거래소/증권사 <span className="text-sm font-normal text-gray-500">(중복 선택 가능)</span>
                        </h3>

                        {/* Stock Exchanges */}
                        {(isStockRelated || showAllExchanges) && (
                            <div>
                                <h4 className="text-sm font-semibold text-gray-600 mb-3 ml-1">증권사 (OpenAPI 등)</h4>
                                <div className="flex flex-wrap gap-2">
                                    {STOCK_EXCHANGES.map(ex => (
                                        <button
                                            key={ex}
                                            onClick={() => toggleExchange(ex)}
                                            className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-all ${data.targetExchanges?.includes(ex)
                                                ? 'bg-brand-primary text-white border-brand-primary shadow-sm'
                                                : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                                                }`}
                                        >
                                            {ex}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Crypto Exchanges */}
                        {(isCryptoRelated || showAllExchanges) && (
                            <div>
                                <h4 className="text-sm font-semibold text-gray-600 mb-3 ml-1">가상화폐 거래소</h4>
                                <div className="flex flex-wrap gap-2">
                                    {CRYPTO_EXCHANGES.map(ex => (
                                        <button
                                            key={ex}
                                            onClick={() => toggleExchange(ex)}
                                            className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-all ${data.targetExchanges?.includes(ex)
                                                ? 'bg-brand-primary text-white border-brand-primary shadow-sm'
                                                : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                                                }`}
                                        >
                                            {ex}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                        <p className="text-xs text-gray-400 mt-2">
                            ※ 아직 정하지 않으셨다면 '무관'을 선택해 주세요. 최적의 API를 추천해 드립니다.
                        </p>
                    </motion.div>
                )}


                {/* Government Funding Question (Only for Startup MVP) */}
                {data.projectType === 'startup-mvp' && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-5 bg-brand-primary/5 rounded-2xl border border-brand-primary/10 flex flex-col sm:flex-row items-start sm:items-center gap-4"
                    >
                        <div className="text-gray-400">
                            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                            </svg>
                        </div>
                        <div className="flex-1">
                            <h3 className="font-bold text-gray-800 text-base">정부지원사업(예창패/초창패 등) 프로젝트인가요?</h3>
                            <p className="text-xs text-gray-500 mt-1">지원금 사용 시, 행정 처리 및 서류 작업을 도와드립니다.</p>
                        </div>
                        <div className="flex bg-white rounded-lg p-1 border border-gray-200">
                            <button
                                onClick={() => updateData({ isGovernmentFunded: true })}
                                className={`px-4 py-2 rounded-md text-sm font-bold transition-all ${data.isGovernmentFunded
                                    ? 'bg-brand-secondary text-white shadow-sm'
                                    : 'text-gray-500 hover:bg-gray-50'
                                    }`}
                            >
                                네
                            </button>
                            <button
                                onClick={() => updateData({ isGovernmentFunded: false })}
                                className={`px-4 py-2 rounded-md text-sm font-bold transition-all ${!data.isGovernmentFunded
                                    ? 'bg-gray-800 text-white shadow-sm'
                                    : 'text-gray-500 hover:bg-gray-50'
                                    }`}
                            >
                                아니요
                            </button>
                        </div>
                    </motion.div>
                )}

                <hr className="border-gray-100" />

                {/* 3. Detailed Info (Description & Link) */}
                <div>
                    <div className="mb-6">
                        <label className="block text-sm font-bold text-gray-700 mb-2">
                            추가 요청사항 <span className="text-gray-400 font-normal">(선택)</span>
                        </label>
                        <textarea
                            value={data.projectDescription}
                            onChange={(e) => updateData({ projectDescription: e.target.value })}
                            placeholder="위 선택지에서 다루지 못한 특별한 기능이나 요청사항이 있다면 자유롭게 적어주세요."
                            rows={4}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-100 focus:bg-white focus:border-brand-secondary focus:ring-2 focus:ring-brand-secondary/20 focus:outline-none transition-all resize-none"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">
                            참고 레퍼런스 <span className="text-gray-400 font-normal">(선택)</span>
                        </label>
                        <input
                            type="url"
                            value={data.referenceUrl || ''}
                            onChange={(e) => updateData({ referenceUrl: e.target.value })}
                            placeholder="https://..."
                            className="w-full h-12 px-4 rounded-xl border border-gray-200 bg-gray-100 focus:bg-white focus:border-brand-secondary focus:ring-2 focus:ring-brand-secondary/20 focus:outline-none transition-all"
                        />
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <div className="flex justify-between items-center">
                <button
                    onClick={prevStep}
                    className="group px-6 py-3 rounded-xl font-medium text-gray-500 hover:text-brand-primary transition-all duration-300 flex items-center gap-2"
                >
                    <svg className="w-5 h-5 transition-transform group-hover:-translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    이전으로
                </button>
                <button
                    onClick={nextStep}
                    disabled={!canProceed}
                    className={`px-10 py-4 rounded-2xl font-bold text-white transition-all duration-300 shadow-lg ${canProceed
                        ? 'bg-brand-primary hover:bg-brand-secondary hover:-translate-y-0.5 hover:shadow-xl active:scale-95'
                        : 'bg-gray-300 cursor-not-allowed'
                        }`}
                >
                    다음 단계
                </button>
            </div>
        </div>
    );
}
