import { Suspense } from "react";
import dynamic from "next/dynamic";
import Hero from "@/components/Hero";
import Expertise from "@/components/Expertise";
import Portfolio from "@/components/Portfolio";
import Process from "@/components/Process";
import Comparison from "@/components/Comparison";
import Stats from "@/components/Stats";
import Testimonials from "@/components/Testimonials";
import TechStackMarqueeClient from "@/components/TechStackMarqueeClient";

// Lazy load below-fold components for better initial load performance
const FAQ = dynamic(() => import("@/components/FAQ"), {
  loading: () => (
    <section className="w-full py-16 lg:py-24">
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
    <section className="w-full py-16 lg:py-24">
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
      <Hero />
      <TechStackMarqueeClient />
      <Expertise />
      <Comparison />
      <Stats />
      <Process />
      <Portfolio />
      <Testimonials />
      <Suspense fallback={<section className="w-full py-16 lg:py-24"><div className="max-w-4xl mx-auto px-6 lg:px-8"><div className="animate-pulse space-y-4"><div className="h-8 bg-gray-200 rounded w-1/3 mx-auto" /><div className="h-32 bg-gray-100 rounded" /></div></div></section>}>
        <Contact />
      </Suspense>
      <Suspense fallback={<section className="w-full py-16 lg:py-24"><div className="max-w-4xl mx-auto px-6 lg:px-8"><div className="animate-pulse space-y-4"><div className="h-8 bg-gray-200 rounded w-1/3 mx-auto" /><div className="h-4 bg-gray-100 rounded w-2/3 mx-auto" /></div></div></section>}>
        <FAQ />
      </Suspense>
    </main>
  );
}
