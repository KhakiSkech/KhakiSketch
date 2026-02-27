import React from 'react';
import Link from 'next/link';
import ServiceDetail from '@/components/ServiceDetail';
import { Pattern1 } from '@/components/ui/Patterns';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Startup MVP Studio | 스타트업 MVP 개발',
  description: '예비·초기창업 패키지 지원사업에 맞춘 MVP 개발. 3~4개월 내 실제 작동하는 제품으로 투자 IR, 데모데이 준비를 도와드립니다.',
  keywords: ['MVP 개발', '스타트업', '예비창업패키지', '초기창업패키지', '지원사업', '투자 IR'],
  openGraph: {
    title: 'Startup MVP Studio | KhakiSketch',
    description: '예비·초기창업 패키지 지원사업에 맞춘 MVP 개발',
    type: 'website',
    images: [{ url: '/opengraph-image.webp', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Startup MVP Studio | KhakiSketch',
    description: '예비·초기창업 패키지 지원사업에 맞춘 MVP 개발',
    images: ['/opengraph-image.webp'],
  },
  alternates: {
    canonical: 'https://khakisketch.co.kr/services/startup-mvp',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: '스타트업 MVP 개발',
  description: '예비·초기창업 패키지 지원사업에 맞춘 MVP 개발. 3~4개월 내 실제 작동하는 제품으로 투자 IR, 데모데이 준비를 도와드립니다.',
  provider: {
    '@type': 'Organization',
    name: 'KhakiSketch',
    url: 'https://khakisketch.co.kr',
  },
  areaServed: 'KR',
  url: 'https://khakisketch.co.kr/services/startup-mvp',
};

export default function StartupMVPPage() {
    return (
        <>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <ServiceDetail
            title="Startup MVP Studio"
            oneLiner={<>지원사업 예산/기간에 맞춰<br /><strong>‘기능을 줄이고도 성과가 나는 MVP’</strong>를 설계·개발합니다.</>}
            targets={[
                <>예비·초기창업 패키지 <strong>선정(또는 준비) 중인 팀</strong></>,
                <>시드/프리시드 단계에서 <strong>3~4개월 내 MVP가 필요한 팀</strong></>,
                <>아이디어는 있지만, <strong>기능 정의·일정·예산을 현실화할 파트너가 필요한 팀</strong></>
            ]}
            problems={[
                <>계획서의 기능이 많아 <strong>우선순위(필수/추가)가 정리되어 있지 않습니다.</strong></>,
                <>개발사와의 소통에서 <strong>요구사항이 문서로 남지 않아</strong> 범위가 계속 흔들립니다.</>,
                <>결과보고서/평가를 고려한 <strong>화면 구성·데이터 구조 설계가 뒤로 밀립니다.</strong></>
            ]}
            solutions={[
                <>기능을 줄여도 성과가 나게 <strong>핵심 흐름만 남깁니다</strong></>,
                <>개발 중간에도 확인 가능한 <strong>데모/스테이징 배포를 운영합니다</strong></>,
                <>운영을 위해 필요한 <strong>관리자·로그·기본 통계를 포함합니다</strong></>,
                <>지원사업 결과보고에 필요한 <strong>화면/기능 정리 문서를 함께 제공합니다</strong></>
            ]}
            budgetPeriod="예산 700~1,200만 원 / 3~4개월"
            budgetNote={
                <div className="text-sm leading-relaxed mt-2 text-white/90">
                    <p className="mb-1"><strong>포함:</strong> 핵심 기능 MVP + 관리자(기본) + 배포 + 기본 로그/모니터링</p>
                    <p className="mb-2"><strong>미포함(별도):</strong> 결제/정산, 복잡한 3rd API 연동, 고급 디자인 시스템 구축</p>
                    <p className="text-xs opacity-70">* 기능 범위와 외부 연동 난이도에 따라 Discovery 이후 확정됩니다.</p>
                </div>
            }
            exampleImage={Pattern1}
            exampleTitle="초기 창업팀 헬스케어 플랫폼 MVP"
            exampleDesc={
                <>
                    <span className="text-xs font-bold border border-brand-secondary text-brand-secondary px-2 py-0.5 rounded inline-block mb-2">MVP / STARTUP</span>
                    <span className="block text-brand-muted">
                        3개월 내 MVP 런칭: 예약/상담 신청 → 관리자 관리 → 리포트까지<br /><strong>핵심 흐름 구현</strong>을 통해 시장 검증 완료
                    </span>
                </>
            }
            faqs={[
                {
                    question: "아이디어만 있고 요구사항 정리가 안 됐는데도 시작할 수 있나요?",
                    answer: <>네, 괜찮습니다. 저희는 <strong>'Discovery 설계 세션'</strong>을 통해 대표님의 머릿속에 있는 아이디어를 구체적인 기능 명세와 화면 흐름으로 정리해드리는 것부터 시작합니다.</>
                },
                {
                    question: "웹으로 먼저 만들고, 나중에 앱으로 확장 가능한가요?",
                    answer: <>네, 가능합니다. 초기에는 <strong>비용 효율이 높은 모바일 웹(Web)</strong>으로 검증하고, 유저가 늘어나면 하이브리드 앱이나 네이티브 앱으로 확장하는 단계를 추천드립니다.</>
                },
                {
                    question: "지원사업 과업지시서/결과보고서용 정리 자료도 제공하나요?",
                    answer: <>네, 가능합니다. 지원사업 행정에 필요한 <strong>과업지시서, 산출물 내역서, 결과보고서 작성</strong>에 필요한 기술적 내용과 자료를 적극 지원해 드립니다.</>
                }
            ]}
            ctaLink="/contact?type=startup-mvp"
            ctaText="Discovery 상담하기"
            ctaNote={
                <>
                    지원사업 일정이 촉박하거나, 기능 범위가 흔들린다면<br />
                    <Link href="/contact?type=discovery" className="underline hover:text-brand-primary font-bold">Discovery 설계 세션</Link>에서 ‘필수 기능·일정·예산’을 먼저 고정합니다.
                </>
            }
        />
        </>
    );
}
