'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import ScrollReveal from '@/components/ui/ScrollReveal';

export default function AboutContent() {
    return (
        <div className="w-full bg-brand-bg min-h-screen pt-24 pb-20 px-6 lg:px-8">
            <div className="max-w-7xl mx-auto flex flex-col gap-24">

                {/* Intro */}
                <ScrollReveal>
                    <div className="flex flex-col gap-6 items-start">
                        <h1 className="font-bold text-4xl lg:text-5xl text-brand-primary tracking-tight leading-tight">
                            We build<br />
                            High-Performance<br />
                            Business Logic.
                        </h1>
                        <p className="text-xl lg:text-2xl text-brand-text font-medium leading-relaxed break-keep mt-4">
                            카키스케치는 단순한 웹사이트를 넘어,<br />
                            비즈니스의 핵심 로직을 견고한 소프트웨어로 구현합니다.
                        </p>
                    </div>
                </ScrollReveal>

                {/* Mission / Value */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <ScrollReveal delay={100} className="h-full">
                        <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm hover:-translate-y-1 transition-transform h-full">
                            <h3 className="font-bold text-brand-primary text-xl mb-4">Scope Control</h3>
                            <p className="text-brand-muted leading-relaxed text-sm lg:text-base">
                                무작정 만들기보다 '무엇을 뺄지' 제안하여,<br />한정된 예산 내 핵심 기능에 집중합니다.
                            </p>
                        </div>
                    </ScrollReveal>
                    <ScrollReveal delay={200} className="h-full">
                        <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm hover:-translate-y-1 transition-transform h-full">
                            <h3 className="font-bold text-brand-primary text-xl mb-4">No Hype</h3>
                            <p className="text-brand-muted leading-relaxed text-sm lg:text-base">
                                화려한 용어 대신 실질적 가치에 집중하며,<br />지키지 못할 과장된 약속은 하지 않습니다.
                            </p>
                        </div>
                    </ScrollReveal>
                    <ScrollReveal delay={300} className="h-full">
                        <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm hover:-translate-y-1 transition-transform h-full">
                            <h3 className="font-bold text-brand-primary text-xl mb-4">Ownership</h3>
                            <p className="text-brand-muted leading-relaxed text-sm lg:text-base">
                                직접 쓸 수 있는 제품만 납품하며,<br />고객의 비즈니스를 깊이 고민합니다.
                            </p>
                        </div>
                    </ScrollReveal>
                </div>

                {/* Team */}
                <ScrollReveal delay={400}>
                    <div className="flex flex-col gap-12">
                        <h2 className="text-3xl font-bold text-brand-primary">Team</h2>
                        <div className="flex flex-col md:flex-row gap-12">
                            <div className="flex-1 flex flex-col gap-4">
                                <div className="w-full h-px bg-brand-primary/20 mb-2"></div>
                                <h3 className="text-2xl font-bold text-brand-primary">Engineering</h3>
                                <p className="text-brand-muted leading-relaxed">
                                    대용량 트래픽 처리 경험과 금융 데이터 시각화 노하우를 가진<br />
                                    시니어 개발자들이 프로젝트를 주도합니다.
                                </p>
                            </div>
                            <div className="flex-1 flex flex-col gap-4">
                                <div className="w-full h-px bg-brand-primary/20 mb-2"></div>
                                <h3 className="text-2xl font-bold text-brand-primary">Design & Product</h3>
                                <p className="text-brand-muted leading-relaxed">
                                    사용자 경험(UX) 중심의 설계와 깔끔한 UI 디자인으로<br />
                                    복잡한 비즈니스 로직을 직관적으로 풀어냅니다.
                                </p>
                            </div>
                        </div>
                    </div>
                </ScrollReveal>

                {/* CTA */}
                <ScrollReveal delay={500}>
                    <div className="bg-white p-12 rounded-3xl border border-gray-100 shadow-lg text-center flex flex-col items-center gap-8">
                        <h2 className="text-2xl lg:text-3xl font-bold text-brand-primary">
                            시작할 준비가 되셨나요?
                        </h2>
                        <p className="text-brand-muted text-lg">
                            가벼운 커피챗부터 구체적인 기획 상담까지,<br />
                            카키스케치는 언제나 열려있습니다.
                        </p>
                        <Link href="/contact?type=full" className="inline-flex items-center justify-center px-12 py-5 rounded-xl bg-brand-primary text-white font-bold text-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:scale-[0.98] transition-all">
                            Discovery 상담하기
                        </Link>
                    </div>
                </ScrollReveal>

            </div>
        </div>
    );
}
