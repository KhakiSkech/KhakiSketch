import { FirestoreProject } from "@/types/admin";

export const MOCK_PROJECTS: FirestoreProject[] = [
    {
        id: "quant-forge-pro",
        title: "QuantForge Pro",
        description: "고성능 알고리즘 트레이딩 및 백테스팅 플랫폼. 전문 트레이더를 위한 초저지연 시세 처리.",
        tag: "Fintech",
        category: "TRADING",
        period: "2023.08 - 2024.01",
        teamSize: "4명 (BE 2, FE 1, DO 1)",
        thumbnail: {
            pattern: "Pattern1",
            imageUrl: "https://images.unsplash.com/photo-1611974765270-ca1258634369?q=80&w=1920&auto=format&fit=crop"
        },
        content: "# 프로젝트 개요\n\n주식 및 암호화폐 시장의 틱 데이터를 실시간으로 수집하고, 사용자가 정의한 알고리즘을 백테스팅하며 실제 매매까지 연동하는 통합 플랫폼입니다.",
        overview: "주식 및 암호화폐 시장의 틱 데이터를 실시간으로 수집하고, 사용자가 정의한 알고리즘을 백테스팅하며 실제 매매까지 연동하는 통합 플랫폼입니다.",
        challenge: {
            title: "대용량 실시간 데이터 처리와 백테스팅 속도",
            items: [
                "초당 수천 건의 틱 데이터 유실 없는 수집",
                "방대한 과거 데이터(Tick Level) 기반 초고속 백테스팅 엔진 필요",
                "주문 실행 지연 시간(Latency) 최소화"
            ]
        },
        solution: {
            title: "이벤트 기반 아키텍처와 최적화된 데이터 파이프라인",
            items: [
                { title: "TimescaleDB & Redis", description: "시계열 데이터 최적화 저장소 및 실시간 캐싱 계층 도입" },
                { title: "Event-Driven MSA", description: "Kafka를 활용한 데이터 수집/가공/주문 모듈 간 결합도 감소" },
                { title: "Cython Optimization", description: "핵심 백테스팅 연산 로직 C 레벨 최적화로 속도 50배 향상" }
            ]
        },
        result: {
            title: "기관 수준의 트레이딩 인프라 구축",
            metrics: [
                { label: "백테스팅 속도", value: "50x", unit: "배 향상" },
                { label: "주문 레이턴시", value: "50ms", unit: "미만" },
                { label: "데이터 처리량", value: "10k", unit: "TPS" }
            ],
            summary: "베타 테스트 기간 동안 100억 원 규모의 거래가 안정적으로 체결되었으며, 기존 솔루션 대비 백테스팅 시간을 98% 단축했습니다."
        },
        tech: {
            frontend: ["React", "TypeScript", "Recoil", "Chart.js"],
            backend: ["Python", "FastAPI", "Celery", "Pandas"],
            database: ["PostgreSQL", "TimescaleDB", "Redis"],
            other: ["AWS", "Docker", "Kubernetes", "Kafka"]
        },
        featured: true,
        status: "PUBLISHED",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
    {
        id: "edulink-lms",
        title: "EduLink LMS",
        description: "AI 기반 학습 분석 기능을 탑재한 차세대 교육 관리 시스템.",
        tag: "Edutech",
        category: "MVP",
        period: "2023.05 - 2023.11",
        teamSize: "3명 (Fullstack 2, Design 1)",
        thumbnail: {
            pattern: "Pattern2",
            imageUrl: "https://images.unsplash.com/photo-1501504905252-473c47e087f8?q=80\u0026w=1920\u0026auto=format\u0026fit=crop"
        },
        content: "# 프로젝트 개요\n\n온라인 강의 수강, 실시간 화상 수업, 과제 제출 및 AI 자동 채점 기능을 제공하는 올인원 LMS 플랫폼입니다.",
        overview: "온라인 강의 수강, 실시간 화상 수업, 과제 제출 및 AI 자동 채점 기능을 제공하는 올인원 LMS 플랫폼입니다.",
        challenge: {
            title: "실시간성 확보와 사용자 경험",
            items: [
                "WebRTC 기반 끊김 없는 화상 수업 환경 구축",
                "대규모 동시 접속자(수강신청 등) 트래픽 처리",
                "직관적인 강의 에디터 및 플레이어 UX"
            ]
        },
        solution: {
            title: "Serverless 아키텍처와 확장성 확보",
            items: [
                { title: "Next.js & Vercel", description: "Edge Network를 활용한 빠른 정적 콘텐츠 제공 및 SSR" },
                { title: "WebRTC SFU", description: "다자간 화상 회의를 위한 미디어 서버 구축 (Mediasoup)" },
                { title: "Firebase", description: "실시간 DB를 활용한 채팅 및 알림 기능 구현" }
            ]
        },
        result: {
            title: "안정적인 교육 서비스 런칭",
            metrics: [
                { label: "동시 접속", value: "5k+", unit: "명" },
                { label: "강의 완료율", value: "92%", unit: "" },
                { label: "시스템 가동률", value: "99.9%", unit: "" }
            ],
            summary: "런칭 첫 달 50개 기관 도입을 달성했으며, 사용자 만족도 4.8/5.0을 기록했습니다."
        },
        tech: {
            frontend: ["Next.js", "TailwindCSS", "Zustand"],
            backend: ["Node.js", "NestJS", "Prisma"],
            database: ["MySQL", "Redis"],
            other: ["Vercel", "AWS S3", "Firebase"]
        },
        featured: true,
        status: "PUBLISHED",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
    {
        id: "auto-matcher",
        title: "AutoMatcher",
        description: "기업용 엑셀/문서 데이터 자동 매칭 및 검증 자동화 솔루션.",
        tag: "Automation",
        category: "AUTOMATION",
        period: "2023.09 - 2023.10",
        teamSize: "1명",
        thumbnail: {
            pattern: "Pattern3",
            imageUrl: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1920&auto=format&fit=crop"
        },
        content: "# 프로젝트 개요\n\n매일 발생하는 수천 건의 주문 내역과 입금 내역을 자동으로 대조하고, 불일치 건을 찾아내 담당자에게 알림을 별내는 RPA 툴입니다.",
        overview: "매일 발생하는 수천 건의 주문 내역과 입금 내역을 자동으로 대조하고, 불일치 건을 찾아내 담당자에게 알림을 보내는 RPA 툴입니다.",
        challenge: {
            title: "반복 업무의 비효율성 제거",
            items: [
                "일 평균 3시간 소요되는 단순 대조 업무 자동화",
                "휴먼 에러(오기입, 누락) 원천 차단",
                "레거시 ERP 시스템과의 데이터 연동"
            ]
        },
        solution: {
            title: "Python 기반 데이터 처리 파이프라인",
            items: [
                { title: "Pandas Data Processing", description: "엑셀/CSV 데이터 고속 연산 및 퍼지 매칭 알고리즘 적용" },
                { title: "RPA (Selenium)", description: "웹 기반 뱅킹/ERP 사이트 자동 로그인 및 데이터 스크래핑" },
                { title: "Slack Webhook", description: "처리 결과 및 예외 상황 실시간 메신저 알림" }
            ]
        },
        result: {
            title: "업무 효율 90% 이상 향상",
            metrics: [
                { label: "업무 시간", value: "3h→10m", unit: "단축" },
                { label: "정확도", value: "100%", unit: "" },
                { label: "인건비 절감", value: "2.5M", unit: "원/월" }
            ],
            summary: "재무팀의 반복 업무를 완전히 자동화하여, 담당자가 고부가가치 분석 업무에 집중할 수 있게 되었습니다."
        },
        tech: {
            frontend: ["Electron", "React"],
            backend: ["Python"],
            database: ["SQLite"],
            other: ["Selenium", "Pandas"]
        },
        featured: true,
        status: "SAMPLE",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    }
];
