import { Metadata } from 'next';
import React from 'react';
import Link from 'next/link';

export const metadata: Metadata = {
  title: '이용약관',
  description: '카키스케치의 서비스 이용약관입니다.',
  openGraph: {
    title: '이용약관 | KhakiSketch',
    description: '카키스케치의 서비스 이용약관입니다.',
    images: [{ url: '/opengraph-image.webp', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: '이용약관 | KhakiSketch',
    description: '카키스케치의 서비스 이용약관입니다.',
    images: ['/opengraph-image.webp'],
  },
  alternates: {
    canonical: 'https://khakisketch.co.kr/terms',
  },
};

export default function TermsOfServicePage() {
    return (
        <div className="w-full bg-brand-bg min-h-screen pt-24 pb-20 px-6 lg:px-8">
            <div className="max-w-3xl mx-auto flex flex-col gap-12">
                {/* Header */}
                <div className="flex flex-col gap-4">
                    <Link href="/" className="text-brand-muted text-sm hover:text-brand-primary transition-colors">
                        ← 홈으로
                    </Link>
                    <h1 className="font-bold text-3xl lg:text-4xl text-brand-primary tracking-tight">
                        이용약관
                    </h1>
                    <p className="text-brand-muted">최종 수정일: 2026-02-18</p>
                </div>

                {/* Content */}
                <div className="bg-white p-8 lg:p-12 rounded-2xl border border-gray-100 shadow-sm prose prose-gray max-w-none">
                    <section className="mb-10">
                        <h2 className="text-xl font-bold text-brand-primary mb-4">제1조 (목적)</h2>
                        <p className="text-brand-text leading-relaxed">
                            본 약관은 카키스케치(이하 &quot;회사&quot;)가 제공하는 웹사이트 및 서비스의 이용에 관한
                            기본적인 사항을 규정함을 목적으로 합니다.
                        </p>
                    </section>

                    <section className="mb-10">
                        <h2 className="text-xl font-bold text-brand-primary mb-4">제2조 (정의)</h2>
                        <ul className="list-disc list-inside text-brand-muted space-y-2">
                            <li><strong>&quot;서비스&quot;</strong>란 회사가 제공하는 MVP 개발, 업무 자동화, 웹사이트 제작 등의 소프트웨어 개발 서비스를 말합니다.</li>
                            <li><strong>&quot;이용자&quot;</strong>란 본 약관에 따라 회사가 제공하는 서비스를 이용하는 고객을 말합니다.</li>
                            <li><strong>&quot;Discovery&quot;</strong>란 프로젝트의 기능, 범위, 일정을 구체화하는 사전 기획 단계를 말합니다.</li>
                        </ul>
                    </section>

                    <section className="mb-10">
                        <h2 className="text-xl font-bold text-brand-primary mb-4">제3조 (약관의 효력)</h2>
                        <p className="text-brand-text leading-relaxed">
                            본 약관은 회사 웹사이트에 게시하거나 기타의 방법으로 이용자에게 공지함으로써 효력이 발생합니다.
                            회사는 필요한 경우 관련 법령을 위배하지 않는 범위 내에서 본 약관을 변경할 수 있습니다.
                        </p>
                    </section>

                    <section className="mb-10">
                        <h2 className="text-xl font-bold text-brand-primary mb-4">제4조 (서비스의 내용)</h2>
                        <p className="text-brand-text leading-relaxed mb-4">
                            회사가 제공하는 서비스는 다음과 같습니다.
                        </p>
                        <ul className="list-disc list-inside text-brand-muted space-y-2">
                            <li>스타트업 MVP 개발</li>
                            <li>업무 자동화 시스템 구축</li>
                            <li>기업 홈페이지 제작</li>
                            <li>Discovery 설계 세션</li>
                            <li>기타 소프트웨어 개발 관련 서비스</li>
                        </ul>
                    </section>

                    <section className="mb-10">
                        <h2 className="text-xl font-bold text-brand-primary mb-4">제5조 (계약의 성립)</h2>
                        <p className="text-brand-text leading-relaxed">
                            서비스 이용 계약은 이용자의 문의 및 상담 후, 회사와 이용자 간 별도의 계약서 체결을 통해 성립됩니다.
                            웹사이트를 통한 문의는 계약 체결을 위한 상담 요청으로 간주되며, 이 자체가 계약 체결을 의미하지 않습니다.
                        </p>
                    </section>

                    <section className="mb-10">
                        <h2 className="text-xl font-bold text-brand-primary mb-4">제6조 (비용 및 결제)</h2>
                        <ul className="list-disc list-inside text-brand-muted space-y-2">
                            <li>서비스 비용은 프로젝트 범위에 따라 별도 협의 후 결정됩니다.</li>
                            <li>Discovery 세션 비용(20~30만 원)은 실제 개발 계약 체결 시 전액 차감됩니다.</li>
                            <li>결제 조건 및 일정은 계약서에 명시된 바에 따릅니다.</li>
                        </ul>
                    </section>

                    <section className="mb-10">
                        <h2 className="text-xl font-bold text-brand-primary mb-4">제7조 (지식재산권)</h2>
                        <p className="text-brand-text leading-relaxed">
                            프로젝트 결과물에 대한 지식재산권 귀속은 별도 계약서에 명시된 바에 따릅니다.
                            특별한 약정이 없는 경우, 최종 대금 지급 완료 시 결과물에 대한 권리는 이용자에게 이전됩니다.
                        </p>
                    </section>

                    <section className="mb-10">
                        <h2 className="text-xl font-bold text-brand-primary mb-4">제8조 (비밀유지)</h2>
                        <p className="text-brand-text leading-relaxed">
                            회사는 서비스 제공 과정에서 알게 된 이용자의 영업비밀 및 기술정보를
                            이용자의 사전 동의 없이 제3자에게 공개하거나 서비스 목적 외로 사용하지 않습니다.
                        </p>
                    </section>

                    <section className="mb-10">
                        <h2 className="text-xl font-bold text-brand-primary mb-4">제9조 (면책조항)</h2>
                        <ul className="list-disc list-inside text-brand-muted space-y-2">
                            <li>회사는 천재지변, 전쟁, 기타 불가항력으로 인해 서비스를 제공할 수 없는 경우 책임이 면제됩니다.</li>
                            <li>이용자의 귀책사유로 인한 서비스 장애에 대해 회사는 책임을 지지 않습니다.</li>
                            <li>회사는 이용자가 서비스를 이용하여 기대하는 수익을 얻지 못한 것에 대해 책임을 지지 않습니다.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-brand-primary mb-4">제10조 (분쟁 해결)</h2>
                        <p className="text-brand-text leading-relaxed mb-4">
                            본 약관에 명시되지 않은 사항은 관련 법령 및 상관례에 따르며,
                            서비스 이용과 관련하여 분쟁이 발생한 경우 회사 소재지 관할 법원을 제1심 관할 법원으로 합니다.
                        </p>
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
