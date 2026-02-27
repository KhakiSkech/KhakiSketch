'use client';

import React from 'react';
import Link from 'next/link';
import ScrollReveal from '@/components/ui/ScrollReveal';

export default function ProcessContent() {
    return (
        <div className="w-full bg-brand-bg min-h-screen pt-24 pb-20">
            {/* Header Section */}
            <div className="w-full max-w-7xl mx-auto px-6 lg:px-8 flex flex-col gap-6 items-start mb-20">
                <ScrollReveal>
                    <h1 className="font-bold text-4xl lg:text-5xl text-brand-primary tracking-tight leading-tight">
                        Work Process
                    </h1>
                    <p className="text-xl lg:text-2xl text-brand-text font-medium leading-relaxed break-keep mt-6">
                        투명한 과정, 예측 가능한 결과.<br />
                        모든 과정은 클라이언트와 투명하게 공유됩니다.
                    </p>
                </ScrollReveal>
            </div>

            {/* Steps Section with Background Rhythm */}
            <div className="w-full bg-slate-50 border-y border-gray-100 py-20">
                <div className="max-w-7xl mx-auto px-6 lg:px-8 flex flex-col gap-16">

                    {/* STEP 01 */}
                    <ScrollReveal delay={100}>
                        <div className="flex flex-col md:flex-row gap-8 border-b border-gray-200 pb-12 last:border-0 last:pb-0">
                            <div className="w-full md:w-1/3">
                                <span className="text-brand-secondary font-bold text-lg mb-1 block">STEP 01</span>
                                <h3 className="text-2xl font-bold text-brand-primary">Discovery & 설계</h3>
                            </div>
                            <div className="w-full md:w-2/3 flex flex-col gap-4">
                                <p className="text-brand-primary text-xl font-bold leading-relaxed">"무엇을 만들지 정의합니다."</p>
                                <p className="text-brand-muted leading-relaxed break-keep">
                                    모호한 아이디어를 구체화하고, 핵심 기능(Must-have)과 현실적인 예산/일정을 확정합니다.
                                </p>
                                <ul className="bg-white p-6 rounded-xl border border-gray-200 space-y-2 text-sm text-brand-muted mt-2 shadow-sm">
                                    <li>• 기능 명세서 (Scope) 확정</li>
                                    <li>• 시안 제공 및 계약서 작성</li>
                                    <li>• 상세 견적 및 일정표 제공</li>
                                </ul>
                            </div>
                        </div>
                    </ScrollReveal>

                    {/* STEP 02 */}
                    <ScrollReveal delay={200}>
                        <div className="flex flex-col md:flex-row gap-8 border-b border-gray-200 pb-12 last:border-0 last:pb-0">
                            <div className="w-full md:w-1/3">
                                <span className="text-brand-secondary font-bold text-lg mb-1 block">STEP 02</span>
                                <h3 className="text-2xl font-bold text-brand-primary">디자인 & 개발</h3>
                            </div>
                            <div className="w-full md:w-2/3 flex flex-col gap-4">
                                <p className="text-brand-primary text-xl font-bold leading-relaxed">"눈에 보이는 제품을 만듭니다."</p>
                                <p className="text-brand-muted leading-relaxed break-keep">
                                    설계를 바탕으로 디자인과 개발을 진행하며, 주간 리포트로 상황을 투명하게 공유합니다.
                                </p>
                                <ul className="bg-white p-6 rounded-xl border border-gray-200 space-y-2 text-sm text-brand-muted mt-2 shadow-sm">
                                    <li>• Figma UI 디자인 컨펌</li>
                                    <li>• 프론트엔드/백엔드 개발</li>
                                    <li>• 주간 리포트 (진척률 공유)</li>
                                </ul>
                            </div>
                        </div>
                    </ScrollReveal>

                    {/* STEP 03 */}
                    <ScrollReveal delay={300}>
                        <div className="flex flex-col md:flex-row gap-8 border-b border-gray-200 pb-12 last:border-0 last:pb-0">
                            <div className="w-full md:w-1/3">
                                <span className="text-brand-secondary font-bold text-lg mb-1 block">STEP 03</span>
                                <h3 className="text-2xl font-bold text-brand-primary">테스트 & 배포</h3>
                            </div>
                            <div className="w-full md:w-2/3 flex flex-col gap-4">
                                <p className="text-brand-primary text-xl font-bold leading-relaxed">"완성도를 높이고 런칭합니다."</p>
                                <p className="text-brand-muted leading-relaxed break-keep">
                                    테스트 및 QA를 거쳐 결함을 제거하고, 실제 운영 환경에 안정적으로 배포합니다.
                                </p>
                            </div>
                        </div>
                    </ScrollReveal>

                    {/* STEP 04 */}
                    <ScrollReveal delay={400}>
                        <div className="flex flex-col md:flex-row gap-8">
                            <div className="w-full md:w-1/3">
                                <span className="text-brand-secondary font-bold text-lg mb-1 block">STEP 04</span>
                                <h3 className="text-2xl font-bold text-brand-primary">안정화 & 유지보수</h3>
                            </div>
                            <div className="w-full md:w-2/3 flex flex-col gap-4">
                                <p className="text-brand-primary text-xl font-bold leading-relaxed">"지속적인 성장을 돕습니다."</p>
                                <p className="text-brand-muted leading-relaxed break-keep">
                                    배포 후 1개월간 무상 유지보수(버그 수정)를 지원하며, 이후 필요 시 월 단위 계약이 가능합니다.
                                </p>
                            </div>
                        </div>
                    </ScrollReveal>
                </div>
            </div>

            {/* Communication & CTA */}
            <div className="w-full max-w-7xl mx-auto px-6 lg:px-8 py-20 flex flex-col gap-24">

                {/* Communication & Policy */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <ScrollReveal delay={500} className="h-full">
                        <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-lg hover:-translate-y-1 transition-transform duration-300 h-full">
                            <div className="flex items-center gap-3 mb-6">
                                <span className="text-2xl">💬</span>
                                <h3 className="font-bold text-brand-primary text-xl">커뮤니케이션</h3>
                            </div>
                            <ul className="space-y-4 text-brand-muted text-sm">
                                <li className="flex gap-3">
                                    <span className="text-brand-primary font-bold min-w-[60px] uppercase tracking-wide">채널</span>
                                    <span>Slack, Notion, Email 기본 사용<br />(카카오톡은 긴급 시에만)</span>
                                </li>
                                <li className="flex gap-3">
                                    <span className="text-brand-primary font-bold min-w-[60px] uppercase tracking-wide">공유</span>
                                    <span>매주 월요일 주간 리포트 발송<br />중요 의사결정 문서화 필수</span>
                                </li>
                            </ul>
                        </div>
                    </ScrollReveal>

                    <ScrollReveal delay={600} className="h-full">
                        <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-lg hover:-translate-y-1 transition-transform duration-300 h-full">
                            <div className="flex items-center gap-3 mb-6">
                                <span className="text-2xl">🔒</span>
                                <h3 className="font-bold text-brand-primary text-xl">정책 및 권한</h3>
                            </div>
                            <ul className="space-y-4 text-brand-muted text-sm">
                                <li className="flex gap-3">
                                    <span className="text-brand-primary font-bold min-w-[60px] uppercase tracking-wide">저작권</span>
                                    <span>잔금 완납 시 소스코드/산출물<br />클라이언트 100% 귀속</span>
                                </li>
                                <li className="flex gap-3">
                                    <span className="text-brand-primary font-bold min-w-[60px] uppercase tracking-wide">인프라</span>
                                    <span>클라이언트 명의 서버/계정 개설<br />(Lock-in 없는 인계)</span>
                                </li>
                            </ul>
                        </div>
                    </ScrollReveal>
                </div>

                <ScrollReveal delay={700}>
                    <div className="text-center">
                        <Link href="/contact?type=full" className="inline-flex items-center justify-center px-12 py-5 rounded-xl bg-brand-primary text-white font-bold text-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:scale-[0.98] transition-all">
                            프로젝트 문의하기
                        </Link>
                    </div>
                </ScrollReveal>

            </div>
        </div>
    );
}
