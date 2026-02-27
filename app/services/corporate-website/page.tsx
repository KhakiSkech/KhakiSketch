import React from 'react';
import Link from 'next/link';
import ServiceDetail from '@/components/ServiceDetail';
import { Pattern3 } from '@/components/ui/Patterns';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Corporate Website | 기업 홈페이지 제작',
  description: '브랜드 신뢰를 높이는 깔끔하고 빠른 기업 소개 웹사이트. 반응형 디자인, SEO 최적화, 관리자 페이지까지 제공합니다.',
  keywords: ['기업 홈페이지', '웹사이트 제작', '반응형 웹', '기업 소개', '브랜드 사이트'],
  openGraph: {
    title: 'Corporate Website | KhakiSketch',
    description: '브랜드 신뢰를 높이는 깔끔하고 빠른 기업 소개 웹사이트',
    type: 'website',
    images: [{ url: '/opengraph-image.webp', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Corporate Website | KhakiSketch',
    description: '브랜드 신뢰를 높이는 깔끔하고 빠른 기업 소개 웹사이트',
    images: ['/opengraph-image.webp'],
  },
  alternates: {
    canonical: 'https://khakisketch.co.kr/services/corporate-website',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: '기업 홈페이지 제작',
  description: '브랜드 신뢰를 높이는 깔끔하고 빠른 기업 소개 웹사이트. 반응형 디자인, SEO 최적화, 관리자 페이지까지 제공합니다.',
  provider: {
    '@type': 'Organization',
    name: 'KhakiSketch',
    url: 'https://khakisketch.co.kr',
  },
  areaServed: 'KR',
  url: 'https://khakisketch.co.kr/services/corporate-website',
};

export default function CorporateWebsitePage() {
    return (
        <>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <ServiceDetail
            title="Corporate Website"
            oneLiner={<>브랜드 신뢰를 높이는<br /><strong>깔끔하고 빠른 기업 소개 웹사이트</strong>를 만듭니다.</>}
            targets={[
                <>기존 홈페이지가 <strong>오래되어 리뉴얼이 필요한 기업</strong></>,
                <>처음으로 <strong>공식 웹사이트를 만들려는 팀</strong></>,
                <><strong>모바일 대응이 안 되는</strong> 기존 사이트를 교체하려는 기업</>
            ]}
            problems={[
                <>홈페이지가 <strong>모바일에서 깨지거나 느리게 로딩</strong>됩니다.</>,
                <>회사 소개가 <strong>오래된 정보 그대로</strong> 방치되어 있습니다.</>,
                <>검색엔진에서 <strong>회사명을 쳐도 잘 안 나옵니다.</strong></>,
                <>문의 폼이 없거나 <strong>문의가 와도 알림을 못 받습니다.</strong></>
            ]}
            solutions={[
                <><strong>반응형 디자인</strong><br />PC, 태블릿, 모바일 모든 화면에서 깔끔하게 보입니다.</>,
                <><strong>빠른 로딩 속도</strong><br />최신 기술로 제작하여 방문자 이탈을 줄입니다.</>,
                <><strong>기본 SEO 적용</strong><br />검색엔진 최적화로 회사명 검색 시 상위 노출됩니다.</>,
                <><strong>문의 폼 + 알림 연동</strong><br />문의가 들어오면 이메일로 바로 알림을 받습니다.</>
            ]}
            budgetPeriod="예산 150~400만 원 / 2~4주"
            budgetNote={
                <div className="text-sm leading-relaxed mt-2 text-white/90">
                    <p className="mb-1"><strong>포함:</strong> 5~7페이지 구성, 반응형 디자인, 기본 SEO, 문의 폼</p>
                    <p className="mb-2"><strong>미포함(별도):</strong> 복잡한 애니메이션, 다국어 지원, 회원 기능</p>
                    <p className="text-xs opacity-70">* 페이지 수와 콘텐츠 양에 따라 견적이 달라집니다.</p>
                </div>
            }
            exampleImage={Pattern3}
            exampleTitle="기업 브랜딩 웹사이트"
            exampleDesc={
                <>
                    <span className="text-xs font-bold border border-brand-secondary text-brand-secondary px-2 py-0.5 rounded inline-block mb-2">CORPORATE / SAMPLE</span>
                    <span className="block text-brand-muted">
                        회사 소개, 서비스 안내, 포트폴리오, 문의 페이지로 구성된<br />
                        <strong>깔끔한 기업 소개 사이트</strong> 예시입니다.
                    </span>
                </>
            }
            faqs={[
                {
                    question: "기존 도메인을 그대로 사용할 수 있나요?",
                    answer: <>네, 가능합니다. 기존에 사용하시던 <strong>도메인과 이메일을 그대로 유지</strong>하면서 웹사이트만 새로 제작할 수 있습니다.</>
                },
                {
                    question: "제작 후 직접 수정할 수 있나요?",
                    answer: <>텍스트나 이미지 같은 <strong>간단한 콘텐츠 수정은 직접 가능</strong>하도록 안내드립니다. 구조적인 변경이 필요한 경우 별도 유지보수 계약이나 건별 요청으로 진행됩니다.</>
                },
                {
                    question: "호스팅과 유지비용은 얼마인가요?",
                    answer: <>호스팅 비용은 <strong>월 1~3만 원 수준</strong>이며, 트래픽이 적은 기업 사이트는 무료 호스팅도 가능합니다. 유지보수는 별도 계약 또는 건별 대응으로 진행됩니다.</>
                }
            ]}
            ctaLink="/contact?type=corporate-website"
            ctaText="프로젝트 문의하기"
            ctaNote={
                <>
                    어떤 페이지 구성이 좋을지 고민이시라면<br />
                    <Link href="/contact?type=discovery" className="underline hover:text-brand-primary font-bold">Discovery 설계 세션</Link>에서 사이트맵과 콘텐츠 구조를 함께 정리해 드립니다.
                </>
            }
        />
        </>
    );
}
