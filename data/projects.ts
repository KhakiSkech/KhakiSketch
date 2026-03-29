import type { FirestoreProject } from '@/types/admin';

export type { FirestoreProject as Project } from '@/types/admin';

export const projects: FirestoreProject[] = [
  // ── Firestore 동기화 (2026-03-27) ──
  {
    id: 'binance-futures-선물-자동-매매-플랫폼',
    title: 'Binance Futures 선물 자동 매매 플랫폼',
    description: '비동기 처리 방식으로 Multi Bot 운용 환경을 구축하여 24/7 운용되는 트레이딩 플랫폼을 개발하였습니다.',
    category: 'TRADING',
    status: 'INTERNAL',
    featured: true,
    thumbnail: {
      imageUrl: 'https://firebasestorage.googleapis.com/v0/b/khakisketch-bf356.firebasestorage.app/o/images%2Fportfolio%2F1771682579801-_____2026-02-21_225414.webp?alt=media&token=46240fce-dacb-4d97-b999-f3b9679fdbc9',
    },
    content: '',
    createdAt: '2026-02-21T14:03:09.334Z',
    updatedAt: '2026-02-21T14:03:09.334Z',
  },
  {
    id: '건설업체-웹페이지-포트폴리오',
    title: '건설업체 웹페이지 포트폴리오',
    description: '충청권 대표 토목 종합건설사 오주건설(주)의 기업 홈페이지를 제작했습니다. 직접 콘텐츠를 운영할 수 있는 CMS 관리자 페이지를 함께 납품하였습니다.',
    category: 'MVP',
    period: '1개월, 2026.02 ~ 2026.03',
    teamSize: '1명',
    status: 'PUBLISHED',
    featured: true,
    thumbnail: {
      imageUrl: 'https://firebasestorage.googleapis.com/v0/b/khakisketch-bf356.firebasestorage.app/o/images%2Fportfolio%2F1774606347025-_____2026-03-27_191218.webp?alt=media&token=45eadc54-0fb5-44bd-a25e-049533705cbf',
    },
    content: '',
    createdAt: '2026-03-27T10:29:35.628Z',
    updatedAt: '2026-03-27T10:29:35.628Z',
  },
  // ── 기존 샘플 프로젝트 (빌드 시 정적 페이지 생성용) ──
  {
    id: 'crypto-dashboard',
    title: '다전략 암호화폐 리포트 대시보드',
    description: '전략별 수익률·MDD 실시간 시각화 및 포지션 모니터링',
    tag: 'UNPUBLISHED / PROTOTYPE',
    category: 'TRADING',
    period: '3개월',
    teamSize: '2명',
    status: 'PROTOTYPE',
    featured: true,
    thumbnail: {
      pattern: 'Pattern3',
    },
    content: '',
    overview:
      '자동매매 운영자를 위한 통합 모니터링 대시보드입니다. 여러 전략의 수익률, 낙폭, 포지션을 한 화면에서 실시간으로 추적할 수 있습니다. 리스크 관리와 성과 분석을 동시에 진행할 수 있도록 설계했습니다.',
    challenge: {
      title: '초기 문제점',
      items: [
        '여러 거래소의 데이터를 수동으로 수집하고 있었음',
        '전략별 성과를 정확히 파악할 수 없는 상태',
        '리스크 관리 기준이 일관되지 않음',
        '성과 리포트 작성에 매일 1시간 이상 소요',
      ],
    },
    solution: {
      title: '해결 방안',
      items: [
        {
          title: '멀티소스 데이터 통합',
          description: 'API를 통해 거래소 데이터를 자동 수집하고 정규화',
        },
        {
          title: '실시간 시각화',
          description: 'Recharts 기반 동적 차트로 수익률, MDD, 드로우다운 표시',
        },
        {
          title: '포지션 모니터링',
          description: '거래소별 보유 자산과 익스포저를 한눈에 파악',
        },
        {
          title: '자동 리포트 생성',
          description: '일일/주간 리포트를 자동으로 생성하여 슬랙으로 전송',
        },
      ],
    },
    result: {
      title: '달성한 성과',
      metrics: [
        { label: '일일 리포트 작성 시간', value: '1시간', unit: '→ 5분' },
        { label: '데이터 정확도', value: '100%', unit: '' },
        { label: '지원하는 거래소', value: '5개', unit: '' },
        { label: '동시 추적 전략', value: '20+', unit: '' },
      ],
      summary:
        '수익률 분석과 리스크 관리를 자동화하여 매매 운영자의 업무 효율을 크게 높였습니다.',
    },
    tech: {
      frontend: ['React', 'TypeScript', 'Recharts', 'Tailwind CSS'],
      backend: ['FastAPI', 'WebSocket'],
      database: ['PostgreSQL', 'Redis'],
      other: ['Docker', 'AWS EC2'],
    },
  },
  {
    id: 'landscape-erp',
    title: '조경 시공사 자재 관리 ERP',
    description: '엑셀 업무를 웹으로 전환하여 자재 발주 시간 40% 단축',
    tag: 'BUSINESS TOOL / SAMPLE',
    category: 'AUTOMATION',
    period: '2개월',
    teamSize: '1-2명',
    status: 'SAMPLE',
    featured: true,
    thumbnail: {
      pattern: 'Pattern2',
    },
    content: '',
    overview:
      '조경·시설물 시공사를 위한 통합 자재 관리 시스템입니다. 기존에 엑셀과 전화로 관리하던 자재 발주 프로세스를 웹 기반 시스템으로 전환했습니다. 재고 추적, 자동 발주, 비용 정산까지 한 번에 처리됩니다.',
    challenge: {
      title: '초기 문제점',
      items: [
        '자재 정보가 여러 엑셀 파일에 분산되어 있음',
        '발주 시마다 전화·카톡으로 소통하며 오류 발생',
        '재고 파악이 어려워 과주문/부족 발생',
        '월말 정산에 이틀 이상 소요',
        '직원 이직 시 업무 인수인계가 어려움',
      ],
    },
    solution: {
      title: '해결 방안',
      items: [
        {
          title: '통합 자재 DB',
          description: '모든 자재 정보를 한 시스템에 관리, 버전 충돌 제거',
        },
        {
          title: '자동 발주 시스템',
          description: '재고 기준에 따라 자동으로 발주 제안, 승인 프로세스 추가',
        },
        {
          title: '현장별 추적',
          description: '프로젝트별 자재 소비 현황을 실시간으로 모니터링',
        },
        {
          title: '자동 정산',
          description: '월별 거래 내역을 자동 집계하여 정산서 생성',
        },
      ],
    },
    result: {
      title: '달성한 성과',
      metrics: [
        { label: '자재 발주 시간', value: '40%', unit: '단축' },
        { label: '재고 오류율', value: '95%', unit: '감소' },
        { label: '월말 정산 시간', value: '2일', unit: '→ 30분' },
        { label: '업무 효율 개선', value: '주당 6시간', unit: '절감' },
      ],
      summary:
        '단순 자동화를 넘어 업무 프로세스 자체를 재설계하여 조직의 운영 효율을 획기적으로 개선했습니다.',
    },
    tech: {
      frontend: ['Next.js', 'React', 'TypeScript', 'Tailwind CSS'],
      backend: ['Supabase', 'PostgreSQL'],
      database: ['PostgreSQL (Supabase)'],
      other: ['Vercel', 'CSV Export'],
    },
  },
  {
    id: 'healthcare-mvp',
    title: '초기 창업팀 헬스케어 플랫폼',
    description: '3개월 만에 MVP 런칭 후 시드 투자 유치 성공',
    tag: 'STARTUP MVP / SAMPLE',
    category: 'MVP',
    period: '3개월',
    teamSize: '3명 팀',
    status: 'SAMPLE',
    featured: true,
    thumbnail: {
      pattern: 'Pattern1',
    },
    content: '',
    overview:
      '헬스케어 스타트업의 초기 MVP 개발 프로젝트입니다. "온라인 건강 상담 예약 및 연결" 핵심 기능에 집중하여 3개월 만에 시장에 출시하고 시드 투자를 유치했습니다. 빠른 출시 속도와 안정적인 운영이 핵심이었습니다.',
    challenge: {
      title: '초기 문제점',
      items: [
        '투자자에게 보여줄 수 있는 구체적인 프로덕트가 없음',
        '예산과 기간이 제한적 (3개월, 제한된 예산)',
        '핵심 기능이 무엇인지 불명확함',
        '초기 시장 반응을 빠르게 확인해야 함',
      ],
    },
    solution: {
      title: '해결 방안',
      items: [
        {
          title: '핵심 기능 집중',
          description: '예약 → 화상 상담 → 피드백 3단계 프로세스만 구현',
        },
        {
          title: '빠른 구축',
          description: 'React Native Web으로 모바일·웹 동시 지원',
        },
        {
          title: '안정적인 기반',
          description: 'Firebase로 인프라 구축, 초기 운영 비용 최소화',
        },
        {
          title: '결제 연동',
          description: 'Toss Payments로 즉시 실거래 가능하게 구성',
        },
      ],
    },
    result: {
      title: '달성한 성과',
      metrics: [
        { label: '개발 기간', value: '3개월', unit: '' },
        { label: '시드 투자 유치', value: 'O', unit: '' },
        { label: '초기 사용자', value: '200+', unit: '' },
        { label: '월간 거래액', value: '5천만원+', unit: '' },
      ],
      summary:
        '제한된 자원 속에서도 핵심에 집중하여 빠르게 시장 진출을 이루었고, 이를 통해 투자자의 신뢰를 얻었습니다.',
    },
    tech: {
      frontend: ['React Native (Web)', 'TypeScript', 'Redux'],
      backend: ['Firebase Functions', 'Firestore'],
      database: ['Firestore'],
      other: ['Toss Payments API', 'Twilio Video API'],
    },
  },
  {
    id: 'logistics-dashboard',
    title: '물류 기업 실시간 배송 추적 시스템',
    description: '차량 위치, 배송 상태를 실시간으로 모니터링하는 통합 대시보드',
    tag: 'BUSINESS TOOL / SAMPLE',
    category: 'AUTOMATION',
    period: '2.5개월',
    teamSize: '2-3명',
    status: 'SAMPLE',
    featured: false,
    thumbnail: {
      pattern: 'Pattern2',
    },
    content: '',
    overview:
      '중소 물류 기업을 위한 배송 관리 대시보드입니다. GPS 추적, 배송 상태 업데이트, 운전자 관리를 한 플랫폼에서 처리합니다. 고객에게 실시간 배송 추적 링크를 제공하여 신뢰도를 높였습니다.',
    challenge: {
      title: '초기 문제점',
      items: [
        '차량 위치를 관리할 시스템이 없어 문제 발생 시 대응이 어려움',
        '배송 상태를 고객에게 알려주는 방법이 비효율적 (전화)',
        '운전자 관리와 성과 평가 기준이 없음',
        '배송 데이터가 누적되지 않아 분석 불가',
      ],
    },
    solution: {
      title: '해결 방안',
      items: [
        {
          title: '실시간 GPS 추적',
          description: 'Google Maps API + WebSocket으로 차량 위치 실시간 업데이트',
        },
        {
          title: '배송 상태 자동 업데이트',
          description: '운전자 앱에서 상태 변경 시 자동으로 고객 알림',
        },
        {
          title: '운전자 성과 대시보드',
          description: '배송 완료율, 평균 시간, 만족도 점수 추적',
        },
        {
          title: '배송 데이터 분석',
          description: '월간 배송량, 지역별 통계, 트렌드 분석 리포트 제공',
        },
      ],
    },
    result: {
      title: '달성한 성과',
      metrics: [
        { label: '배송 추적 정확도', value: '99.8%', unit: '' },
        { label: '고객 만족도', value: '4.7/5', unit: '점' },
        { label: '배송 처리 속도', value: '25%', unit: '개선' },
        { label: '운전자 이탈율', value: '60%', unit: '감소' },
      ],
      summary:
        '데이터 기반 운영 체계를 도입하여 배송 품질과 팀 만족도를 동시에 개선했습니다.',
    },
    tech: {
      frontend: ['React', 'TypeScript', 'Mapbox', 'Chart.js', 'Tailwind CSS'],
      backend: ['Node.js/Express', 'WebSocket'],
      database: ['PostgreSQL'],
      other: ['Google Maps API', 'AWS'],
    },
  },
];

export function getProjectById(id: string): FirestoreProject | undefined {
  return projects.find((p) => p.id === id);
}

export function getFeaturedProjects(): FirestoreProject[] {
  return projects.filter((p) => p.featured);
}
