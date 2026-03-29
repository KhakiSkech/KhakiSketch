import type { Metadata } from "next";
import "./globals.css";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import JsonLd from "@/components/JsonLd";
import SkipLink from "@/components/SkipLink";
import ConditionalLayout from "@/components/ConditionalLayout";
import ErrorBoundary from "@/components/ErrorBoundary";
import NoiseTexture from "@/components/ui/NoiseTexture";
import UTMCapture from "@/components/UTMCapture";

// Google Analytics Measurement ID - 실제 ID로 교체 필요
const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || '';

export const metadata: Metadata = {
  metadataBase: new URL('https://khakisketch.co.kr'),
  title: {
    default: "카키스케치 KhakiSketch | 스타트업 MVP 개발 · 개발외주 · SI",
    template: "%s | 카키스케치 KhakiSketch",
  },
  description: "카키스케치는 스타트업 MVP, 업무 자동화, 기업 홈페이지를 전문으로 하는 개발 스튜디오입니다. 컴공 전공 개발자 2인이 재하청 없이 직접 개발합니다.",
  keywords: ["카키스케치", "KhakiSketch", "khakisketch", "KSI", "케이에스아이", "주식회사 케이에스아이", "개발외주", "개발팀", "SI", "시스템통합", "SW 개발", "소프트웨어 개발", "트레이딩 개발", "퀀트 개발", "MVP 개발", "스타트업 개발", "예비창업패키지", "초기창업패키지", "청년창업사관학교", "창업지원", "React", "Next.js", "Python", "FastAPI", "업무 자동화", "맞춤 시스템", "웹 개발", "앱 개발", "Flutter", "기업 홈페이지", "솔루션 개발", "데이터 파이프라인", "API 개발", "백엔드 개발", "프론트엔드 개발", "청주 개발업체", "충북 SI", "청주 웹 개발", "충청북도 소프트웨어", "홈페이지 제작 청주"],
  authors: [{ name: "KhakiSketch" }],
  creator: "KhakiSketch",
  publisher: "KhakiSketch",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/icon',
    apple: '/apple-icon',
  },
  openGraph: {
    title: "카키스케치 KhakiSketch | 스타트업 MVP 개발 · 개발외주 · SI",
    description: "카키스케치(KhakiSketch)는 스타트업 MVP 개발, 개발외주, SI, 비즈니스 자동화를 전문으로 하는 기술 스튜디오입니다. 예비창업패키지·초기창업패키지·청년창업사관학교 지원사업 개발 경험을 보유하고 있습니다.",
    url: "https://khakisketch.co.kr",
    siteName: "카키스케치 KhakiSketch",
    images: [
      {
        url: "/opengraph-image.webp",
        width: 1200,
        height: 630,
        alt: "KhakiSketch - 아이디어를 제품으로"
      }
    ],
    locale: "ko_KR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "카키스케치 KhakiSketch | 스타트업 MVP 개발 · 개발외주 · SI",
    description: "카키스케치(KhakiSketch)는 스타트업 MVP 개발, 개발외주, SI, 비즈니스 자동화를 전문으로 하는 기술 스튜디오입니다. 예비창업패키지·초기창업패키지·청년창업사관학교 지원사업 개발 경험을 보유하고 있습니다.",
    images: ["/opengraph-image.webp"],
  },
  verification: {
    // Google Search Console verification - 환경 변수에서 가져옴
    google: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION,
  },
  alternates: {
    canonical: 'https://khakisketch.co.kr',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <head>
        {/* Naver Search Advisor Verification */}
        {process.env.NEXT_PUBLIC_NAVER_VERIFICATION && (
          <meta name="naver-site-verification" content={process.env.NEXT_PUBLIC_NAVER_VERIFICATION} />
        )}
        <link rel="preconnect" href="https://cdn.jsdelivr.net" />
        <link rel="dns-prefetch" href="https://cdn.jsdelivr.net" />
        {/* Preload critical font files directly for faster loading */}
        <link rel="preload" as="font" type="font/woff2" crossOrigin="anonymous" href="https://cdn.jsdelivr.net/npm/pretendard@1.3.9/dist/web/static/woff2/Pretendard-Regular.woff2" />
        <link rel="preload" as="font" type="font/woff2" crossOrigin="anonymous" href="https://cdn.jsdelivr.net/npm/pretendard@1.3.9/dist/web/static/woff2/Pretendard-Bold.woff2" />
        <link rel="preload" href="https://cdn.jsdelivr.net/npm/pretendard@1.3.9/dist/web/static/woff2/Pretendard-Medium.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="preload" href="https://cdn.jsdelivr.net/npm/pretendard@1.3.9/dist/web/static/woff2/Pretendard-SemiBold.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        {/* Inline critical font-face with font-display: swap for FOUT prevention */}
        <style dangerouslySetInnerHTML={{
          __html: `
          @font-face {
            font-family: 'Pretendard';
            font-weight: 400;
            font-style: normal;
            font-display: swap;
            src: local('Pretendard Regular'), local('Pretendard-Regular'),
                 url('https://cdn.jsdelivr.net/npm/pretendard@1.3.9/dist/web/static/woff2/Pretendard-Regular.woff2') format('woff2');
          }
          @font-face {
            font-family: 'Pretendard';
            font-weight: 500;
            font-style: normal;
            font-display: swap;
            src: local('Pretendard Medium'), local('Pretendard-Medium'),
                 url('https://cdn.jsdelivr.net/npm/pretendard@1.3.9/dist/web/static/woff2/Pretendard-Medium.woff2') format('woff2');
          }
          @font-face {
            font-family: 'Pretendard';
            font-weight: 600;
            font-style: normal;
            font-display: swap;
            src: local('Pretendard SemiBold'), local('Pretendard-SemiBold'),
                 url('https://cdn.jsdelivr.net/npm/pretendard@1.3.9/dist/web/static/woff2/Pretendard-SemiBold.woff2') format('woff2');
          }
          @font-face {
            font-family: 'Pretendard';
            font-weight: 700;
            font-style: normal;
            font-display: swap;
            src: local('Pretendard Bold'), local('Pretendard-Bold'),
                 url('https://cdn.jsdelivr.net/npm/pretendard@1.3.9/dist/web/static/woff2/Pretendard-Bold.woff2') format('woff2');
          }
        `}} />
      </head>
      <body
        className="antialiased"
        style={{
          fontFamily: "var(--font-sans)",
        }}
      >
        {/* Google Analytics */}
        {GA_MEASUREMENT_ID && <GoogleAnalytics measurementId={GA_MEASUREMENT_ID} />}
        {/* UTM Parameter Capture for CRM Attribution */}
        <UTMCapture />
        {/* JSON-LD Structured Data for SEO */}
        <JsonLd />
        {/* Skip Link for Accessibility */}
        <SkipLink />
        {/* Global Noise Texture for Premium Finish */}
        <NoiseTexture />
        <ErrorBoundary>
          <ConditionalLayout>{children}</ConditionalLayout>
        </ErrorBoundary>
      </body>
    </html>
  );
}
