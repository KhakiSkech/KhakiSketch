import { Metadata } from 'next';
import React from 'react';
import Link from 'next/link';

export const metadata: Metadata = {
  title: '개인정보처리방침',
  description: '카키스케치의 개인정보처리방침입니다.',
  openGraph: {
    title: '개인정보처리방침 | KhakiSketch',
    description: '카키스케치의 개인정보처리방침입니다.',
    images: [{ url: '/opengraph-image.webp', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: '개인정보처리방침 | KhakiSketch',
    description: '카키스케치의 개인정보처리방침입니다.',
    images: ['/opengraph-image.webp'],
  },
  alternates: {
    canonical: 'https://khakisketch.co.kr/privacy',
  },
};

export default function PrivacyPolicyPage() {
    return (
        <div className="w-full bg-brand-bg min-h-screen pt-24 pb-20 px-6 lg:px-8">
            <div className="max-w-3xl mx-auto flex flex-col gap-12">
                {/* Header */}
                <div className="flex flex-col gap-4">
                    <Link href="/" className="text-brand-muted text-sm hover:text-brand-primary transition-colors">
                        ← 홈으로
                    </Link>
                    <h1 className="font-bold text-3xl lg:text-4xl text-brand-primary tracking-tight">
                        개인정보처리방침
                    </h1>
                    <p className="text-brand-muted">최종 수정일: 2026-02-18</p>
                </div>

                {/* Content */}
                <div className="bg-white p-8 lg:p-12 rounded-2xl border border-gray-100 shadow-sm prose prose-gray max-w-none">
                    <section className="mb-10">
                        <h2 className="text-xl font-bold text-brand-primary mb-4">1. 개인정보의 수집 및 이용 목적</h2>
                        <p className="text-brand-text leading-relaxed mb-4">
                            카키스케치(이하 &quot;회사&quot;)는 다음의 목적을 위해 개인정보를 수집 및 이용합니다.
                        </p>
                        <ul className="list-disc list-inside text-brand-muted space-y-2">
                            <li>프로젝트 문의 및 상담 응대</li>
                            <li>견적서 및 제안서 발송</li>
                            <li>계약 체결 및 이행</li>
                            <li>서비스 관련 공지사항 전달</li>
                        </ul>
                    </section>

                    <section className="mb-10">
                        <h2 className="text-xl font-bold text-brand-primary mb-4">2. 수집하는 개인정보 항목</h2>
                        <p className="text-brand-text leading-relaxed mb-4">
                            회사는 문의 및 상담을 위해 아래와 같은 개인정보를 수집합니다.
                        </p>
                        <ul className="list-disc list-inside text-brand-muted space-y-2">
                            <li><strong>필수항목:</strong> 이름, 이메일, 연락처</li>
                            <li><strong>선택항목:</strong> 회사명/소속, 예산 범위, 희망 일정, 문의 내용</li>
                        </ul>
                    </section>

                    <section className="mb-10">
                        <h2 className="text-xl font-bold text-brand-primary mb-4">3. 개인정보의 보유 및 이용 기간</h2>
                        <p className="text-brand-text leading-relaxed">
                            수집된 개인정보는 문의 응대 완료 후 <strong>3년간</strong> 보유되며,
                            이후 지체 없이 파기됩니다. 단, 관계 법령에 따라 보존이 필요한 경우 해당 기간 동안 보관됩니다.
                        </p>
                    </section>

                    <section className="mb-10">
                        <h2 className="text-xl font-bold text-brand-primary mb-4">4. 개인정보의 제3자 제공</h2>
                        <p className="text-brand-text leading-relaxed">
                            회사는 원칙적으로 이용자의 개인정보를 제3자에게 제공하지 않습니다.
                            다만, 법령에 의거하거나 이용자의 별도 동의가 있는 경우에 한해 제공될 수 있습니다.
                        </p>
                    </section>

                    <section className="mb-10">
                        <h2 className="text-xl font-bold text-brand-primary mb-4">5. 개인정보의 파기</h2>
                        <p className="text-brand-text leading-relaxed">
                            회사는 개인정보 보유 기간이 경과하거나 처리 목적이 달성된 경우,
                            해당 개인정보를 지체 없이 파기합니다. 전자적 파일은 복구 불가능한 방법으로 삭제하며,
                            종이 문서는 분쇄하거나 소각합니다.
                        </p>
                    </section>

                    <section className="mb-10">
                        <h2 className="text-xl font-bold text-brand-primary mb-4">6. 정보주체의 권리</h2>
                        <p className="text-brand-text leading-relaxed mb-4">
                            이용자는 언제든지 다음의 권리를 행사할 수 있습니다.
                        </p>
                        <ul className="list-disc list-inside text-brand-muted space-y-2">
                            <li>개인정보 열람 요청</li>
                            <li>개인정보 정정 및 삭제 요청</li>
                            <li>개인정보 처리 정지 요청</li>
                        </ul>
                        <p className="text-brand-text leading-relaxed mt-4">
                            위 권리 행사는 아래 연락처를 통해 요청하실 수 있습니다.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-brand-primary mb-4">7. 개인정보 보호책임자</h2>
                        <div className="bg-gray-50 p-6 rounded-xl">
                            <p className="text-brand-text mb-2"><strong>이메일:</strong> songjc6561@gmail.com</p>
                            <p className="text-brand-text mb-2"><strong>전화:</strong> 043-288-4860</p>
                            <p className="text-brand-text"><strong>주소:</strong> 충청북도 청주시 상당구 용암북록 160번길 20(대화프라자), 202호</p>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
}
