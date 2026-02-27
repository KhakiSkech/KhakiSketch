import React from 'react';
import Link from 'next/link';
import ServiceDetail from '@/components/ServiceDetail';
import { Pattern2 } from '@/components/ui/Patterns';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Business Web & Automation | 업무 자동화',
  description: '홈페이지·예약/문의·낶부 엑셀/장부를 하나의 업무용 웹툴로 통합. 수작업을 자동화하여 업무 효율을 높여드립니다.',
  keywords: ['업무 자동화', '웹툴 개발', '예약 시스템', '문의 관리', '엑셀 자동화', '업무 효율화'],
  openGraph: {
    title: 'Business Web & Automation | KhakiSketch',
    description: '홈페이지·예약/문의·낶부 엑셀/장부를 하나의 업무용 웹툴로 통합',
    type: 'website',
    images: [{ url: '/opengraph-image.webp', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Business Web & Automation | KhakiSketch',
    description: '홈페이지·예약/문의·낶부 엑셀/장부를 하나의 업무용 웹툴로 통합',
    images: ['/opengraph-image.webp'],
  },
  alternates: {
    canonical: 'https://khakisketch.co.kr/services/business-automation',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: '업무 자동화',
  description: '홈페이지·예약/문의·내부 엑셀/장부를 하나의 업무용 웹툴로 통합. 수작업을 자동화하여 업무 효율을 높여드립니다.',
  provider: {
    '@type': 'Organization',
    name: 'KhakiSketch',
    url: 'https://khakisketch.co.kr',
  },
  areaServed: 'KR',
  url: 'https://khakisketch.co.kr/services/business-automation',
};

export default function BusinessAutomationPage() {
    return (
        <>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <ServiceDetail
            title="Business Web & Automation"
            oneLiner={<>홈페이지·예약/문의·내부 엑셀/장부를<br /><strong>하나의 업무용 웹툴로 통합해 드립니다.</strong></>}
            targets={[
                <>조경·시설물·드론 등 <strong>현장 출장이 잦은 서비스 비즈니스</strong></>,
                <>상시 인원 3~30명 수준의 <strong>소규모·중소 기업</strong></>,
                <>홈페이지를 ‘명함’이 아니라 <strong>실제 업무 도구로 쓰고 싶은 팀</strong></>
            ]}
            problems={[
                <>예약·문의·현장 사진·자재 내역이 <strong>카톡·전화·엑셀에 제각각</strong> 흩어져 있습니다.</>,
                <>홈페이지는 있지만, <strong>회사 소개 외에는 아무 업무도 하지 않습니다.</strong></>,
                <>고객·현장·자재 정보를 한데 모은 <strong>실질적인 관리 화면이 없습니다.</strong></>,
                <>직원이 바뀔 때마다, <strong>이전 업무 맥락을 인수인계하기가 너무 어렵습니다.</strong></>
            ]}
            solutions={[
                <><strong>브랜드 신뢰를 올리는 랜딩 페이지</strong><br />서비스 특징·차별점을 정리해, 신규 고객이 “무슨 회사인지” 바로 이해하게 합니다.</>,
                <><strong>예약/문의·직원 일정을 한 화면에서 보는 시스템</strong><br />전화·카톡으로 흩어진 예약을 모으고, 담당자 배정까지 한 번에 처리합니다.</>,
                <><strong>고객·현장·자재·비용을 통합 관리하는 내부 어드민</strong><br />“누가, 언제, 어디서, 무엇을 했는지”를 기록·검색할 수 있습니다.</>,
                <><strong>월별 매출·작업량을 한눈에 보는 간단 리포트</strong><br />현장감으로만 파악하던 실적을 숫자로 확인하고, 다음 달 인력·장비 계획에 반영할 수 있습니다.</>
            ]}
            budgetPeriod="예산 300~800만 원 / 1~2개월"
            budgetNote={<span className="break-keep">* 기능 범위(예약/어드민/리포트 수준)와 기존 엑셀·장부 정리 상태에 따라 달라질 수 있으며,<br className="hidden lg:block" /> Discovery 설계 세션 이후 구체 견적을 제안드립니다.</span>}
            exampleImage={Pattern2}
            exampleTitle="조경 시공사 자재 관리 ERP"
            exampleDesc={
                <>
                    <span className="text-xs font-bold border border-brand-secondary text-brand-secondary px-2 py-0.5 rounded inline-block mb-2">BUSINESS TOOL / SAMPLE</span>
                    <span className="block text-brand-muted">
                        엑셀·전화로 관리하던 자재 발주를 웹 어드민으로 통합해,<br />
                        발주 실수·중복을 줄이고 업무 시간을 약 40% 단축한 구조입니다.
                    </span>
                </>
            }
            faqs={[
                {
                    question: "기존 홈페이지가 있는데, 그 위에 기능을 얹을 수 있나요?",
                    answer: <>네, 가능합니다.<br />다만 기존 사이트의 구조·호스팅 환경에 따라 개발 난이도가 크게 달라집니다.<br /><br /><strong>간단한 문의/예약 폼 추가 정도라면 기존 사이트 위에 얹는 방식</strong>을,<br /><strong>예약·고객·현장 관리를 전면 개편해야 하는 수준이라면 새 웹앱을 별도 구축하는 방식</strong>을 권장드립니다.</>
                },
                {
                    question: "워드프레스나 노코드와 무엇이 다른가요?",
                    answer: <>워드프레스/노코드는 <strong>‘페이지를 빨리 만드는 도구’</strong>에 가깝습니다.<br />카키스케치가 만드는 것은,<br /><br />• 고객·현장·예약·자재 등 <strong>데이터 구조를 처음부터 설계</strong>하고<br />• 실제 업무 순서에 맞춰 <strong>화면·버튼·권한을 맞춘 전용 웹앱</strong>입니다.<br /><br />즉, 보기 좋은 웹사이트가 아니라 <strong>회사 내부에서 오래 쓰는 업무용 소프트웨어</strong>를 만드는 것이 가장 큰 차이입니다.</>
                }
            ]}
            ctaLink="/contact?type=business-automation"
            ctaText="Discovery 상담하기"
            ctaNote={
                <>
                    프로젝트 범위가 애매하거나,<br className="hidden lg:block" />
                    “홈페이지만 만들지, 내부 웹툴까지 갈지” 고민 중이라면<br />
                    <Link href="/contact?type=discovery" className="underline hover:text-brand-primary font-bold">Discovery 설계 세션</Link>에서 기능·예산·일정을 먼저 정리하는 것을 권장드립니다.
                </>
            }
        />
        </>
    );
}
