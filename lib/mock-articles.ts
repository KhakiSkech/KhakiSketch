import { FirestoreArticle } from "@/types/admin";

export const MOCK_ARTICLES: FirestoreArticle[] = [
    {
        slug: "startup-mvp-guide-2024",
        title: "2024년 스타트업 MVP 개발 가이드: 실패하지 않는 전략",
        description: "초기 스타트업이 MVP(Minimum Viable Product)를 개발할 때 반드시 고려해야 할 핵심 요소와 기술 스택 선정 기준을 정리했습니다.",
        category: "GUIDE",
        publishedAt: "2024-01-10",
        readingTime: "5 min",
        tags: ["Startup", "MVP", "Development", "FastAPI"],
        featured: true,
        coverImage: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=1920&auto=format&fit=crop",
        content: `
      <h2>MVP란 무엇인가?</h2>
      <p>MVP는 최소한의 기능을 갖춘 제품을 의미합니다. 하지만 '최소한'의 기준은 비즈니스마다 다릅니다.</p>
      <h3>핵심 기능 정의하기</h3>
      <p>모든 기능을 다 넣으려 하지 마세요. 사용자가 겪는 가장 큰 고통을 해결해주는 하나의 기능에 집중해야 합니다.</p>
    `,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
    {
        slug: "why-python-fastapi",
        title: "왜 고성능 트레이딩 시스템에 Python FastAPI를 선택했나?",
        description: "기존 Node.js/Java 기반 시스템을 Python FastAPI와 C++ 모듈로 마이그레이션하며 얻은 성능 향상 경험기.",
        category: "INSIGHT",
        publishedAt: "2023-12-05",
        readingTime: "8 min",
        tags: ["Backend", "Python", "FastAPI", "Performance"],
        featured: true,
        coverImage: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1920&auto=format&fit=crop",
        content: "<p>Python은 느리다는 편견이 있습니다. 하지만...</p>",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
    {
        slug: "automation-case-study",
        title: "업무 자동화로 월 100시간 절약한 사례",
        description: "단순 반복 업무를 엑셀 매크로와 Python 스크립트로 자동화하여 업무 효율을 극대화한 실제 고객 사례입니다.",
        category: "CASE_STUDY",
        publishedAt: "2023-11-20",
        readingTime: "4 min",
        tags: ["Automation", "RPA", "Excel", "Python"],
        featured: false,
        coverImage: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1920&auto=format&fit=crop",
        content: "<p>많은 기업이 엑셀 업무에...</p>",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
    {
        slug: "khaki-sketch-launch",
        title: "Khaki Sketch 공식 런칭: 기술 중심의 스튜디오",
        description: "우리가 추구하는 가치와 앞으로 나아갈 방향에 대해 이야기합니다.",
        category: "NEWS",
        publishedAt: "2023-10-01",
        readingTime: "3 min",
        tags: ["Company", "News", "Vision"],
        featured: false,
        coverImage: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=1920&auto=format&fit=crop",
        content: "<p>안녕하세요, Khaki Sketch입니다...</p>",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    }
];
