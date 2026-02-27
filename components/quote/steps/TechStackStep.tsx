'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuote } from '../QuoteContext';

// Icons
const Icons = {
    web: <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>,
    app: <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>,
    admin: <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
    pc: <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M21 2h.01M7 11h10v-.01M7 11a2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H9a2 2 0 01-2-2v-8z" /><path strokeLinecap="round" strokeLinejoin="round" d="M5 20l-2 2h18l-2-2" /></svg>,
    idea: <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>,
    planning: <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>,
    designDone: <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" /></svg>,
    basic: <svg className="w-9 h-9" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>,
    premium: <svg className="w-9 h-9" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>,
    check: <svg className="w-9 h-9" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
};

// 1. Platform Options
const PLATFORMS = [
    { id: 'web', label: '반응형 웹', icon: Icons.web, desc: 'PC/모바일 웹' },
    { id: 'app', label: '모바일 앱', icon: Icons.app, desc: 'iOS & Android' },
    { id: 'admin', label: '관리자 페이지', icon: Icons.admin, desc: '데이터/회원 관리' },
    { id: 'pc', label: 'PC 프로그램', icon: Icons.pc, desc: 'Windows/Mac' },
];

// 2. Dynamic Features
const FEATURES_BY_TYPE: Record<string, { label: string; items: string[] }> = {
    'startup-mvp': {
        label: 'MVP 필수 기능',
        items: ['소셜 로그인', '결제 시스템', '푸시 알림', '채팅/메시지', '위치 기반(지도)', '파일 업로드', '구독 모델', '약관/정책 관리']
    },
    'homepage': {
        label: '홈페이지 기능',
        items: ['다국어 지원', '반응형 디자인', '관리자 게시판', '문의 폼(이메일)', '채용 공고 관리', 'SEO 최적화', '방문자 통계', '팝업/배너 관리']
    },
    'automation': {
        label: '자동화 기능',
        items: ['데이터 크롤링', '엑셀 연동', '스케줄링(예약)', '알림 발송(톡/슬랙)', 'PDF 리포트', 'OpenAPI 연동', '로그 모니터링', '자동 백업']
    },
    'trading': {
        label: '트레이딩 기능',
        items: ['실시간 시세', '매수/매도 주문', '백테스팅 엔진', '조건검색식', '수익률 차트', '텔레그램 알림', '자동 매매', '포트폴리오']
    },
    'app': {
        label: '앱 전용 기능',
        items: ['앱 스토어 배포', '카메라/앨범', '블루투스', '인앱 결제', '생체 인증', '오프라인 모드', 'QR/바코드 스캔', '딥링크(URL스킴)']
    },
    'default': {
        label: '일반적인 기능',
        items: ['회원가입/로그인', '게시판/커뮤니티', '관리자 대시보드', '검색 기능', '이미지 업로드', '알림 시스템', '결제 연동', '로그 분석']
    }
};

const TECH_STACK_OPTIONS = [
    { id: 'react', label: 'React/Next.js' },
    { id: 'flutter', label: 'Flutter' },
    { id: 'python', label: 'Python' },
    { id: 'nodejs', label: 'Node.js' },
    { id: 'aws', label: 'AWS' },
];

export default function RequirementsStep() {
    const { data, updateData, nextStep, prevStep } = useQuote();
    const [showTechStack, setShowTechStack] = useState(false);

    const featureConfig = FEATURES_BY_TYPE[data.projectType] || FEATURES_BY_TYPE['default'];

    const togglePlatform = (id: string) => {
        const current = data.platforms || [];
        const updated = current.includes(id)
            ? current.filter(p => p !== id)
            : [...current, id];
        updateData({ platforms: updated });
    };

    const toggleFeature = (item: string) => {
        const current = data.features || [];
        const updated = current.includes(item)
            ? current.filter(f => f !== item)
            : [...current, item];
        updateData({ features: updated });
    };

    const toggleTech = (id: string) => {
        const current = data.techStack || [];
        const updated = current.includes(id)
            ? current.filter(t => t !== id)
            : [...current, id];
        updateData({ techStack: updated });
    };

    const canProceed = (data.platforms && data.platforms.length > 0) || (data.features && data.features.length > 0);

    // Initial Setup: Auto-select platform and default design level
    useEffect(() => {
        // 1. Default Design Level
        if (!data.designLevel) {
            updateData({ designLevel: 'basic' });
        }

        // 2. Intelligent Platform Pre-selection (Only if empty)
        if (!data.platforms || data.platforms.length === 0) {
            let defaultPlatform: string[] = [];

            if (data.projectType === 'app' || data.projectType === 'startup-mvp') {
                defaultPlatform = ['app'];
            } else if (data.projectType === 'homepage') {
                defaultPlatform = ['web'];
            } else if (data.projectType === 'automation') {
                defaultPlatform = ['pc'];
            } else {
                defaultPlatform = ['web']; // Default to web
            }

            if (defaultPlatform.length > 0) {
                updateData({ platforms: defaultPlatform });
            }
        }
    }, [data.projectType, data.designLevel, data.platforms, updateData]);

    return (
        <div className="w-full max-w-4xl mx-auto px-4 pb-20">
            {/* Header */}
            <div className="text-center mb-10">
                <span className="inline-block px-4 py-1.5 rounded-full bg-brand-secondary/10 text-brand-secondary text-sm font-medium mb-4">
                    Step 3 of 4
                </span>
                <h1 className="text-3xl lg:text-4xl font-bold text-brand-primary mb-4">
                    어떤 형태와 기능이 필요하신가요?
                </h1>
                <p className="text-gray-500 text-lg">
                    추천된 플랫폼이 맞는지 확인하고, 필요한 기능을 선택해 주세요.
                </p>
            </div>

            <div className="space-y-12 mb-12">

                {/* 1. Platforms */}
                <div>
                    <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                        1. 서비스 플랫폼 <span className="text-brand-secondary text-sm font-normal">(자동 선택됨, 변경 가능)</span>
                    </h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {PLATFORMS.map(p => {
                            const isSelected = data.platforms?.includes(p.id);
                            return (
                                <button
                                    key={p.id}
                                    onClick={() => togglePlatform(p.id)}
                                    className={`flex flex-col items-center justify-center gap-2 p-4 rounded-2xl border-2 transition-all duration-200 ${isSelected
                                        ? 'border-brand-primary bg-brand-primary/5 text-brand-primary shadow-md'
                                        : 'border-gray-100 bg-white text-gray-500 hover:border-gray-200 hover:bg-gray-50'
                                        }`}
                                >
                                    <span className="filter drop-shadow-sm">{p.icon}</span>
                                    <div className="text-center">
                                        <div className="font-bold text-sm lg:text-base">{p.label}</div>
                                        <div className="text-xs text-gray-400 mt-1">{p.desc}</div>
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </div>

                <hr className="border-gray-100" />

                {/* 2. Current Project Stage */}
                <div>
                    <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                        2. 현재 준비 상태 <span className="text-brand-secondary text-sm font-normal">(필수)</span>
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {[
                            { id: 'idea', label: '아이디어만 있어요', sub: '기획+디자인+개발 필요', icon: Icons.idea },
                            { id: 'planning', label: '기획서는 있어요', sub: '디자인+개발 필요', icon: Icons.planning },
                            { id: 'design_done', label: '디자인까지 있어요', sub: '개발만 의뢰', icon: Icons.designDone },
                        ].map(stage => (
                            <button
                                key={stage.id}
                                onClick={() => updateData({ currentStage: stage.id })}
                                className={`p-4 rounded-xl border text-left transition-all ${data.currentStage === stage.id
                                    ? 'bg-brand-primary text-white border-brand-primary shadow-lg ring-2 ring-brand-primary/20'
                                    : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50 hover:border-gray-300'
                                    }`}
                            >
                                <div className={`mb-2 ${data.currentStage === stage.id ? 'text-white' : 'text-brand-secondary'}`}>
                                    {stage.icon}
                                </div>
                                <div className="font-bold">{stage.label}</div>
                                <div className={`text-xs mt-1 ${data.currentStage === stage.id ? 'text-blue-100' : 'text-gray-400'}`}>
                                    {stage.sub}
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* 3. Design Quality (Conditionally Rendered) */}
                <AnimatePresence mode='wait'>
                    {data.currentStage !== 'design_done' ? (
                        <motion.div
                            key="design-options"
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="overflow-hidden"
                        >
                            <hr className="border-gray-100 mb-12" />
                            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                                3. 디자인 퀄리티 선택
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div
                                    onClick={() => updateData({ designLevel: 'basic' })}
                                    className={`cursor-pointer rounded-2xl p-6 border-2 transition-all duration-200 flex items-start gap-4 ${data.designLevel === 'basic'
                                        ? 'border-brand-secondary bg-brand-secondary/5 ring-1 ring-brand-secondary'
                                        : 'border-gray-200 bg-white hover:border-gray-300'
                                        }`}
                                >
                                    <div className="text-brand-secondary">{Icons.basic}</div>
                                    <div>
                                        <h3 className={`font-bold text-lg mb-1 ${data.designLevel === 'basic' ? 'text-brand-secondary' : 'text-gray-700'}`}>기본형 (템플릿 활용)</h3>
                                        <p className="text-sm text-gray-500 leading-relaxed mb-2">
                                            깔끔하고 빠른 제작이 가능합니다.<br />
                                            합리적인 비용으로 MVP를 제작할 때 추천합니다.
                                        </p>
                                        <span className="inline-block px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded font-bold">비용 절약</span>
                                    </div>
                                </div>

                                <div
                                    onClick={() => updateData({ designLevel: 'premium' })}
                                    className={`cursor-pointer rounded-2xl p-6 border-2 transition-all duration-200 flex items-start gap-4 ${data.designLevel === 'premium'
                                        ? 'border-brand-primary bg-brand-primary/5 ring-1 ring-brand-primary'
                                        : 'border-gray-200 bg-white hover:border-gray-300'
                                        }`}
                                >
                                    <div className="text-brand-primary">{Icons.premium}</div>
                                    <div>
                                        <h3 className={`font-bold text-lg mb-1 ${data.designLevel === 'premium' ? 'text-brand-primary' : 'text-gray-700'}`}>고급형 (전문 디자이너)</h3>
                                        <p className="text-sm text-gray-500 leading-relaxed mb-2">
                                            전담 디자이너가 투입되어 브랜딩을 구축합니다.<br />
                                            차별화된 UI/UX가 중요한 서비스에 적합합니다.
                                        </p>
                                        <span className="inline-block px-2 py-1 bg-brand-primary/10 text-brand-primary text-xs rounded font-bold">전문가 배정 (+비용)</span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="design-done-msg"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="mt-12 mb-4 bg-green-50 p-6 rounded-2xl border border-green-100 flex items-center gap-4"
                        >
                            <div className="text-green-600">{Icons.check}</div>
                            <div>
                                <h3 className="font-bold text-green-800">디자인이 준비되어 있으시군요!</h3>
                                <p className="text-green-600 text-sm">보유하신 디자인 파일을 토대로 꼼꼼하게 개발해 드립니다. (Figma, Zeplin 등)</p>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <hr className="border-gray-100" />

                {/* 4. Features (Dynamic Checkbox) */}
                <div>
                    <h2 className="text-xl font-bold text-gray-800 mb-4">
                        4. {featureConfig.label} <span className="text-sm font-normal text-brand-secondary ml-2">(필요한 것만 체크)</span>
                    </h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {featureConfig.items.map(item => (
                            <button
                                key={item}
                                onClick={() => toggleFeature(item)}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl border text-left transition-all duration-200 ${data.features.includes(item)
                                    ? 'bg-brand-primary text-white border-brand-primary shadow-sm'
                                    : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
                                    }`}
                            >
                                <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${data.features.includes(item) ? 'bg-white border-white' : 'bg-white border-gray-300'
                                    }`}>
                                    {data.features.includes(item) && <div className="w-2.5 h-2.5 rounded-sm bg-brand-primary" />}
                                </div>
                                <span className="text-sm font-medium">{item}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* 4. Tech Stack (Advanced Toggle) */}
                <div className="pt-4">
                    <button
                        onClick={() => setShowTechStack(!showTechStack)}
                        className="flex items-center gap-2 text-gray-500 hover:text-gray-800 text-sm font-medium transition-colors"
                    >
                        {showTechStack ? '▼ 기술 스택 설정 닫기' : '▶ 개발자가 이신가요? 기술 스택 직접 선택하기'}
                    </button>

                    <AnimatePresence>
                        {showTechStack && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="overflow-hidden mt-4"
                            >
                                <div className="p-6 bg-gray-50 rounded-2xl border border-gray-200">
                                    <p className="text-sm text-gray-500 mb-4">선호하는 프레임워크나 언어가 있다면 알려주세요.</p>
                                    <div className="flex flex-wrap gap-2">
                                        {TECH_STACK_OPTIONS.map(tech => (
                                            <button
                                                key={tech.id}
                                                onClick={() => toggleTech(tech.id)}
                                                className={`px-3 py-1.5 rounded-lg text-sm font-bold border transition-all ${data.techStack.includes(tech.id)
                                                    ? 'bg-gray-800 text-white border-gray-800'
                                                    : 'bg-white text-gray-500 border-gray-300 hover:border-gray-400'
                                                    }`}
                                            >
                                                {tech.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
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
