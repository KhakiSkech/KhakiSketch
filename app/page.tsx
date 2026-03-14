import dynamic from "next/dynamic";
import Hero from "@/components/Hero";
import Expertise from "@/components/Expertise";
import Portfolio from "@/components/Portfolio";
import Process from "@/components/Process";
import Comparison from "@/components/Comparison";
import Stats from "@/components/Stats";
import Testimonials from "@/components/Testimonials";
import TechStackMarqueeClient from "@/components/TechStackMarqueeClient";
import MidCta from "@/components/MidCta";

// Lazy load below-fold components for better initial load performance
const FAQ = dynamic(() => import("@/components/FAQ"), {
  loading: () => (
    <section className="w-full py-14 lg:py-20">
      <div className="max-w-4xl mx-auto px-6 lg:px-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/3 mx-auto"></div>
          <div className="h-4 bg-gray-100 rounded w-2/3 mx-auto"></div>
        </div>
      </div>
    </section>
  ),
});

const Contact = dynamic(() => import("@/components/Contact"), {
  loading: () => (
    <section className="w-full py-14 lg:py-20">
      <div className="max-w-4xl mx-auto px-6 lg:px-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/3 mx-auto"></div>
          <div className="h-32 bg-gray-100 rounded"></div>
        </div>
      </div>
    </section>
  ),
});

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      {/* 1. Hook — 문제 제기 */}
      <Hero />
      <TechStackMarqueeClient />

      {/* 2. Problem → Solution */}
      <Comparison />

      {/* 3. 신뢰 구축 (숫자 → 후기를 서비스 설명보다 먼저) */}
      <Stats />
      <Testimonials />

      {/* 4. 서비스 & 프로세스 */}
      <Expertise />
      <MidCta />
      <Process />

      {/* 5. 증거 */}
      <Portfolio />

      {/* 6. 반론 해소 & 전환 */}
      <FAQ />
      <Contact />
    </main>
  );
}
