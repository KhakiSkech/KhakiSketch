import React from 'react';
import Link from 'next/link';

interface FAQItem {
    question: string;
    answer: string;
}

interface ServiceDetailProps {
    title: string;
    oneLiner: string | React.ReactNode;
    targets: (string | React.ReactNode)[];
    problems: (string | React.ReactNode)[];
    solutions: (string | React.ReactNode)[];
    budgetPeriod: string;
    budgetNote?: string | React.ReactNode;
    pricingNote?: string | React.ReactNode;
    exampleImage?: React.ElementType; // Using generic Pattern for now
    exampleTitle?: string;
    exampleDesc?: string | React.ReactNode;
    faqs: { question: string; answer: string | React.ReactNode }[];
    ctaLink: string;
    ctaText: string;
    ctaNote?: string | React.ReactNode;
}

export default function ServiceDetail({
    title,
    oneLiner,
    targets,
    problems,
    solutions,
    budgetPeriod,
    budgetNote,
    pricingNote,
    exampleImage: ExamplePattern,
    exampleTitle,
    exampleDesc,
    faqs,
    ctaLink,
    ctaText,
    ctaNote
}: ServiceDetailProps) {
    return (
        <div className="w-full bg-brand-bg min-h-screen pt-24 pb-20 px-6 lg:px-8">
            <div className="max-w-4xl mx-auto flex flex-col gap-24">

                {/* 1. Header */}
                <div className="flex flex-col gap-6 items-start animate-fade-in-up">
                    <Link href="/#services" className="back-link text-brand-muted text-sm hover:text-brand-primary transition-colors">
                        <span className="back-arrow">←</span> Back to Services
                    </Link>
                    <h1 className="font-bold text-4xl lg:text-5xl text-brand-primary tracking-tight leading-tight">
                        {title}
                    </h1>
                    <p className="text-xl lg:text-2xl text-brand-text font-medium leading-relaxed break-keep">
                        {oneLiner}
                    </p>
                </div>

                {/* 2. Target Audience */}
                <div className="flex flex-col gap-6 animate-fade-in-left delay-100">
                    <h2 className="text-2xl font-bold text-brand-primary">이런 팀을 위해 준비했습니다</h2>
                    <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
                        <ul className="space-y-4">
                            {targets.map((target, idx) => (
                                <li key={idx} className="target-item flex gap-3 items-start text-lg text-brand-text font-medium py-2">
                                    <span className="target-check text-brand-secondary mt-1">✔</span>
                                    {target}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* 3. Problems */}
                <div className="flex flex-col gap-6 animate-fade-in-right delay-200">
                    <h2 className="text-2xl font-bold text-brand-primary">보통 이런 문제를 겪고 계시죠?</h2>
                    <div className="grid gap-4">
                        {problems.map((prob, idx) => (
                            <div key={idx} className="problem-card bg-red-50/50 p-6 rounded-xl border border-red-100 text-brand-text font-medium cursor-default">
                                <span className="problem-emoji inline-block">😥</span> {prob}
                            </div>
                        ))}
                    </div>
                </div>

                {/* 4. Solutions */}
                <div className="flex flex-col gap-6 animate-fade-in-left delay-300">
                    <h2 className="text-2xl font-bold text-brand-primary">카키스케치는 이렇게 해결합니다</h2>
                    <div className="bg-white p-8 rounded-2xl border border-brand-primary/10 shadow-sm">
                        <ul className="space-y-6">
                            {solutions.map((sol, idx) => (
                                <li key={idx} className="solution-item flex gap-4 items-start cursor-default">
                                    <div className="solution-number w-6 h-6 rounded-full bg-brand-primary text-white flex items-center justify-center font-bold text-xs mt-0.5 shrink-0">
                                        {idx + 1}
                                    </div>
                                    <span className="solution-text text-lg text-brand-primary font-bold leading-relaxed">{sol}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* 5. Budget & Period */}
                <div className="flex flex-col gap-6 animate-scale-in delay-400">
                    <h2 className="text-2xl font-bold text-brand-primary">예산 및 기간 가이드</h2>
                    <div className="bg-brand-primary text-white p-8 rounded-2xl shadow-lg flex flex-col md:flex-row gap-8 items-center justify-between">
                        <div className="flex flex-col gap-2">
                            <span className="text-brand-secondary font-bold text-sm tracking-wider uppercase">Estimated Cost</span>
                            <span className="text-2xl lg:text-3xl font-bold">{budgetPeriod}</span>
                            {budgetNote && <div className="text-white/80 text-sm mt-1">{budgetNote}</div>}
                        </div>
                        {pricingNote && (
                            <div className="text-right">
                                <p className="text-white/90 font-medium text-sm break-keep max-w-xs">{pricingNote}</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* 6. Example (Optional) */}
                {(ExamplePattern || exampleTitle) && (
                    <div className="flex flex-col gap-6 animate-fade-in-up delay-500">
                        <h2 className="text-2xl font-bold text-brand-primary">실제 구현 예시</h2>
                        <div className="example-card bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
                            {ExamplePattern && (
                                <div className="example-image h-48 lg:h-64 bg-gray-50 flex items-center justify-center relative overflow-hidden">
                                    <ExamplePattern />
                                </div>
                            )}
                            <div className="p-8">
                                {exampleTitle && <h3 className="font-bold text-xl text-brand-primary mb-2">{exampleTitle}</h3>}
                                {exampleDesc && <p className="text-brand-muted">{exampleDesc}</p>}
                            </div>
                        </div>
                    </div>
                )}

                {/* 7. FAQ */}
                <div className="flex flex-col gap-6 animate-fade-in-up delay-600">
                    <h2 className="text-2xl font-bold text-brand-primary">자주 묻는 질문</h2>
                    <div className="flex flex-col gap-4">
                        {faqs.map((faq, idx) => (
                            <details key={idx} className="faq-item group bg-white rounded-xl border border-gray-200 overflow-hidden">
                                <summary className="flex cursor-pointer items-center justify-between gap-4 p-6 font-bold text-brand-primary marker:content-none">
                                    Q. {faq.question}
                                    <span className="faq-arrow">▼</span>
                                </summary>
                                <div className="faq-content px-6 pb-6 pt-2 text-brand-muted leading-relaxed whitespace-pre-line">
                                    A. {faq.answer}
                                </div>
                            </details>
                        ))}
                    </div>
                </div>

                {/* 8. CTA */}
                <div className="mt-12 text-center animate-scale-in delay-700">
                    <Link href={ctaLink} className="cta-button inline-flex items-center justify-center px-12 py-5 rounded-xl bg-brand-primary text-white font-bold text-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:scale-[0.98]">
                        {ctaText}
                    </Link>
                    <div className="mt-4 text-brand-muted text-sm">
                        {ctaNote ? ctaNote : (
                            <>프로젝트 범위가 불확실하다면, <Link href="/contact?type=discovery" className="underline hover:text-brand-primary font-bold">Discovery 설계 세션</Link>부터 시작하세요.</>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
