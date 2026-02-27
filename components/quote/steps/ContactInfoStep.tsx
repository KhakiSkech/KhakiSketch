'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useQuote } from '../QuoteContext';
import { createLead } from '@/lib/firestore-quotes';
import { logger } from '@/lib/logger';

// --- Assets & Data from BudgetTimelineStep ---
const budgetOptions = [
    { id: 'under_300', label: '300만원 이하', description: '소규모 프로젝트' },
    { id: '300_1000', label: '300~1,000만원', description: 'MVP 수준' },
    { id: '1000_3000', label: '1,000~3,000만원', description: '본격 서비스' },
    { id: 'over_3000', label: '3,000만원 이상', description: '대규모 시스템' },
    { id: 'undecided', label: '예산 미정', description: '조언 필요' },
];

const timelineOptions = [
    {
        id: '1month',
        label: '1개월 이내',
        icon: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
    },
    {
        id: '2-3months',
        label: '2~3개월',
        icon: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 00-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 01-2.448-2.448 14.9 14.9 0 01.06-.312m-2.24 2.39a4.493 4.493 0 00-1.757 4.306 4.493 4.493 0 004.306-1.758M16.5 9a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" /></svg>
    },
    {
        id: '3-6months',
        label: '3~6개월',
        icon: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
    },
    {
        id: 'over_6months',
        label: '6개월 이상',
        icon: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
    },
    {
        id: 'flexible',
        label: '일정 유연',
        icon: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
    },
];

// --- Assets & Data from ContactInfoStep ---
const contactPreferences = [
    {
        id: 'email',
        label: '이메일',
        icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
    },
    {
        id: 'phone',
        label: '전화',
        icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
    },
    {
        id: 'kakao',
        label: '카카오톡',
        icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
    },
];

// Budget ID to label mapping
const budgetLabels: Record<string, string> = {
    'under_300': '300만원 이하',
    '300_1000': '300~1,000만원',
    '1000_3000': '1,000~3,000만원',
    'over_3000': '3,000만원 이상',
    'undecided': '예산 미정',
};

// Confetti Component
function Confetti() {
    const colors = ['#87AC75', '#749965', '#263122', '#61DAFB', '#FF9900'];
    const confettiCount = 50;

    return (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {[...Array(confettiCount)].map((_, i) => {
                const randomColor = colors[Math.floor(Math.random() * colors.length)];
                const randomDelay = Math.random() * 0.5;
                const randomDuration = 2 + Math.random() * 2;
                const randomX = -100 + Math.random() * 200;
                const randomRotate = Math.random() * 720;

                return (
                    <motion.div
                        key={i}
                        className="absolute top-1/2 left-1/2 w-2 h-2 rounded-sm"
                        style={{ backgroundColor: randomColor }}
                        initial={{ x: 0, y: 0, opacity: 1, rotate: 0, scale: 1 }}
                        animate={{
                            x: randomX,
                            y: [0, -100, 100],
                            opacity: [1, 1, 0],
                            rotate: randomRotate,
                            scale: [1, 0.5, 0],
                        }}
                        transition={{
                            duration: randomDuration,
                            delay: randomDelay,
                            ease: 'easeOut',
                        }}
                    />
                );
            })}
        </div>
    );
}

export default function ContactInfoStep() {
    const { data, updateData, prevStep, isSubmitting, setIsSubmitting, isComplete, setIsComplete } = useQuote();
    const [privacyAgreed, setPrivacyAgreed] = React.useState(false);

    const canSubmit =
        data.budget !== '' &&
        data.timeline !== '' &&
        data.name.trim() !== '' &&
        data.email.trim() !== '' &&
        data.phone.trim() !== '' &&
        data.preferredContact && data.preferredContact.length > 0 &&
        privacyAgreed &&
        !isSubmitting;

    // Handle keyboard navigation
    React.useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Enter' && canSubmit) {
                handleSubmit();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [canSubmit]);

    const handleSubmit = async () => {
        if (!canSubmit) return;

        setIsSubmitting(true);

        const summaryText = data.projectSummary ||
            `[${data.projectGoal || '목표 미정'}] ${data.projectTags?.join(', ') || ''}`;

        try {
            // 1. Firestore에 저장 (CRM)
            const leadResult = await createLead({
                projectType: data.projectType,
                projectTypeOther: data.projectTypeOther,
                projectName: data.projectName,
                projectSummary: data.projectSummary,
                projectDescription: data.projectDescription,
                projectGoal: data.projectGoal,
                projectTags: data.projectTags || [],
                referenceUrl: data.referenceUrl,
                isGovernmentFunded: data.isGovernmentFunded || false,
                targetExchanges: data.targetExchanges || [],
                platforms: data.platforms || [],
                currentStage: data.currentStage,
                features: data.features || [],
                techStack: data.techStack || [],
                budget: data.budget,
                timeline: data.timeline,
                customerName: data.name,
                company: data.company,
                email: data.email,
                phone: data.phone,
                preferredContact: data.preferredContact || [],
                status: 'NEW',
                priority: 'MEDIUM',
                source: 'WEBSITE',
                landingPage: typeof window !== 'undefined' ? window.location.href : '',
            });

            if (!leadResult.success) {
                logger.error('Failed to save lead:', leadResult.error);
                alert('견적 저장에 실패했습니다. 다시 시도해 주세요.');
                return;
            }

            // 2. 관리자 알림은 Firestore onCreate 트리거 (Cloud Functions)가 자동 처리

            // 3. 제출 완료
            logger.info('[Quote] Lead submitted successfully');
            setIsComplete(true);
        } catch (error) {
            logger.error('Submission Error:', error);
            alert('제출 중 오류가 발생했습니다. 다시 시도해 주세요.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const toggleContact = (id: string) => {
        const current = data.preferredContact || [];
        const updated = current.includes(id)
            ? current.filter(item => item !== id)
            : [...current, id];
        updateData({ preferredContact: updated });
    };

    // Success Screen
    if (isComplete) {
        // ... (Same as before, skipped for brevity in this task description but will include in file)
        return (
            <motion.div
                className="w-full max-w-4xl mx-auto px-4 text-center py-16 lg:py-24 relative"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
            >
                <Confetti />

                <motion.div
                    initial={{ scale: 0, rotate: -45 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.2 }}
                    className="w-24 h-24 rounded-3xl bg-brand-secondary/10 flex items-center justify-center mx-auto mb-8 shadow-inner"
                >
                    <div className="text-brand-secondary">
                        <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                </motion.div>

                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="text-4xl font-bold text-brand-primary mb-4 tracking-tight"
                >
                    견적 요청이 접수되었습니다!
                </motion.h2>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="text-gray-500 text-lg mb-10 break-keep max-w-md mx-auto"
                >
                    작성해주신 내용을 신중히 검토한 뒤,<br />
                    <strong>1~2영업일 내</strong>로 정성껏 답변드리겠습니다.
                </motion.p>

                {/* Summary Card */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="bg-white rounded-3xl p-8 text-left mb-10 shadow-xl border border-gray-100 relative overflow-hidden group"
                >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-brand-secondary/5 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-110 transition-transform" />

                    <h3 className="font-bold text-brand-primary text-xl mb-6 flex items-center gap-2">
                        요청 세부 내용
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8 text-sm">
                        <div>
                            <span className="block text-gray-400 mb-1 font-medium italic">프로젝트 유형</span>
                            <span className="text-brand-text font-bold">{data.projectType}</span>
                        </div>
                        <div>
                            <span className="block text-gray-400 mb-1 font-medium italic">예산 범위</span>
                            <span className="text-brand-text font-bold text-brand-secondary">{budgetLabels[data.budget] || data.budget}</span>
                        </div>
                        <div className="sm:col-span-2">
                            <span className="block text-gray-400 mb-1 font-medium italic">프로젝트 키워드</span>
                            <div className="flex flex-wrap gap-2 mt-1">
                                {data.projectTags?.map(tag => (
                                    <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs font-medium">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                    className="flex flex-col sm:flex-row items-center justify-center gap-4"
                >
                    <a
                        href="/"
                        className="w-full sm:w-auto px-10 py-4 bg-brand-primary text-white font-bold rounded-2xl hover:bg-brand-secondary transition-all duration-300 shadow-lg hover:shadow-xl active:scale-95 text-center"
                    >
                        홈으로 돌아가기
                    </a>
                </motion.div>
            </motion.div>
        );
    }

    return (
        <div className="w-full max-w-4xl mx-auto px-4 pb-20">
            {/* Header */}
            <div className="text-center mb-10">
                <span className="inline-block px-4 py-1.5 rounded-full bg-brand-secondary/10 text-brand-secondary text-sm font-medium mb-4">
                    Step 4 of 4
                </span>
                <h1 className="text-3xl lg:text-4xl font-bold text-brand-primary mb-4">
                    거의 다 왔습니다!
                </h1>
                <p className="text-gray-500 text-lg">상세 정보와 연락처를 남겨주시면 곧 연락드리겠습니다.</p>
            </div>

            {/* Combined Steps Container */}
            <div className="space-y-12 mb-10">

                {/* --- Section 1: Budget & Timeline --- */}
                <div className="space-y-8">
                    <h2 className="text-xl font-bold text-gray-800 border-l-4 border-brand-secondary pl-3">
                        예산 및 일정
                    </h2>

                    {/* Budget */}
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-3">
                            예상 예산 범위 <span className="text-red-500">*</span>
                        </label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                            {budgetOptions.map((option) => {
                                const isSelected = data.budget === option.id;
                                return (
                                    <button
                                        key={option.id}
                                        onClick={() => updateData({ budget: option.id })}
                                        className={`relative p-4 rounded-xl border-2 text-left transition-all duration-200 ${isSelected
                                            ? 'border-brand-secondary bg-brand-secondary/5 shadow-md -translate-y-0.5'
                                            : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
                                            }`}
                                    >
                                        <div className={`font-bold text-sm mb-1 ${isSelected ? 'text-brand-secondary' : 'text-gray-700'}`}>
                                            {option.label}
                                        </div>
                                        <div className="text-xs text-gray-400">{option.description}</div>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Timeline */}
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-3">
                            희망 런칭 시기 <span className="text-red-500">*</span>
                        </label>
                        <div className="flex flex-wrap gap-3">
                            {timelineOptions.map((option) => {
                                const isSelected = data.timeline === option.id;
                                return (
                                    <button
                                        key={option.id}
                                        onClick={() => updateData({ timeline: option.id })}
                                        className={`flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-bold transition-all duration-200 ${isSelected
                                            ? 'bg-brand-primary text-white shadow-md -translate-y-0.5'
                                            : 'bg-white border text-gray-600 border-gray-200 hover:bg-gray-50'
                                            }`}
                                    >
                                        <span className={isSelected ? 'text-white' : 'text-brand-secondary'}>{option.icon}</span>
                                        {option.label}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>

                <hr className="border-gray-100" />

                {/* --- Section 2: Contact Info --- */}
                <div className="space-y-8">
                    <h2 className="text-xl font-bold text-gray-800 border-l-4 border-brand-secondary pl-3">
                        기본 정보
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                이름 <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={data.name}
                                onChange={(e) => updateData({ name: e.target.value })}
                                placeholder="홍길동"
                                className="w-full h-12 px-4 rounded-xl border border-gray-200 bg-gray-100 focus:bg-white transition-all focus:ring-2 focus:ring-brand-secondary/20 focus:outline-none focus:border-brand-secondary"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                소속 (회사/팀명)
                            </label>
                            <input
                                type="text"
                                value={data.company || ''}
                                onChange={(e) => updateData({ company: e.target.value })}
                                placeholder="카키스케치"
                                className="w-full h-12 px-4 rounded-xl border border-gray-200 bg-gray-100 focus:bg-white focus:border-brand-secondary focus:ring-2 focus:ring-brand-secondary/20 focus:outline-none transition-all"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            이메일 <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="email"
                            value={data.email}
                            onChange={(e) => updateData({ email: e.target.value })}
                            placeholder="contact@example.com"
                            className="w-full h-12 px-4 rounded-xl border border-gray-200 bg-gray-100 focus:bg-white transition-all focus:ring-2 focus:ring-brand-secondary/20 focus:outline-none focus:border-brand-secondary"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            연락처 <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="tel"
                            value={data.phone}
                            onChange={(e) => updateData({ phone: e.target.value })}
                            placeholder="010-0000-0000"
                            className="w-full h-12 px-4 rounded-xl border border-gray-200 bg-gray-100 focus:bg-white transition-all focus:ring-2 focus:ring-brand-secondary/20 focus:outline-none focus:border-brand-secondary"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-3">
                            선호 연락 방식 <span className="text-red-500">*</span> ({data.preferredContact?.length > 0 ? `${data.preferredContact.length}개 선택됨` : '최소 1개 선택'})
                        </label>
                        <div className="flex flex-wrap gap-3">
                            {contactPreferences.map((pref) => {
                                const isSelected = data.preferredContact?.includes(pref.id);
                                return (
                                    <button
                                        key={pref.id}
                                        onClick={() => toggleContact(pref.id)}
                                        className={`flex items-center gap-2 px-6 py-3 rounded-2xl text-sm font-bold transition-all duration-300 ${isSelected
                                            ? 'bg-brand-secondary text-white shadow-lg -translate-y-0.5'
                                            : 'bg-white border-2 border-gray-100 text-gray-600 hover:border-brand-secondary/30'
                                            }`}
                                    >
                                        <span className={isSelected ? 'text-white' : 'text-brand-secondary'}>{pref.icon}</span>
                                        {pref.label}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* 개인정보 수집 동의 */}
                    <div className="mt-6 p-4 bg-gray-50 rounded-xl border border-gray-200">
                        <label className="flex items-start gap-3 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={privacyAgreed}
                                onChange={(e) => setPrivacyAgreed(e.target.checked)}
                                className="mt-1 w-5 h-5 rounded border-gray-300 text-brand-secondary focus:ring-brand-secondary/20"
                            />
                            <span className="text-sm text-gray-600 leading-relaxed">
                                <span className="font-semibold text-gray-700">[필수] 개인정보 수집 및 이용 동의</span>
                                <br />
                                수집 항목: 이름, 이메일, 연락처, 소속
                                <br />
                                수집 목적: 견적 상담 및 프로젝트 문의 응대
                                <br />
                                보유 기간: 상담 완료 후 1년 (또는 동의 철회 시)
                            </span>
                        </label>
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <div className="flex justify-between items-center">
                <button
                    onClick={prevStep}
                    disabled={isSubmitting}
                    className="group px-6 py-3 rounded-xl font-medium text-gray-500 hover:text-brand-primary transition-all duration-300 flex items-center gap-2 disabled:opacity-50"
                >
                    <svg className="w-5 h-5 transition-transform group-hover:-translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    이전으로
                </button>
                <button
                    onClick={handleSubmit}
                    disabled={!canSubmit}
                    className={`px-12 py-4 rounded-2xl font-bold text-white transition-all duration-300 shadow-lg ${canSubmit
                        ? 'bg-brand-secondary hover:bg-brand-primary hover:-translate-y-0.5 hover:shadow-xl active:scale-95'
                        : 'bg-gray-300 cursor-not-allowed'
                        }`}
                >
                    {isSubmitting ? (
                        <span className="flex items-center gap-2">
                            <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                            </svg>
                            전송 중...
                        </span>
                    ) : (
                        '견적 요청하기 🚀'
                    )}
                </button>
            </div>
        </div>
    );
}
