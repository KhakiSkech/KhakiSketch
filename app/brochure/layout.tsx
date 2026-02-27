import type { Metadata } from "next";
import "./brochure.css";

export const metadata: Metadata = {
  title: "회사 소개서",
  description: "카키스케치 회사 소개서 - MVP 개발, 업무 자동화, 기업 홈페이지 제작 전문 스튜디오",
  openGraph: {
    title: "회사 소개서 | KhakiSketch",
    description: "카키스케치 회사 소개서 - MVP 개발, 업무 자동화, 기업 홈페이지 제작 전문 스튜디오",
    images: [{ url: "/opengraph-image.webp", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "회사 소개서 | KhakiSketch",
    description: "카키스케치 회사 소개서 - MVP 개발, 업무 자동화, 기업 홈페이지 제작 전문 스튜디오",
    images: ["/opengraph-image.webp"],
  },
  alternates: {
    canonical: "https://khakisketch.co.kr/brochure",
  },
};

export default function BrochureLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="brochure-wrapper">
      {children}
    </div>
  );
}
