export default function JsonLd() {
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: '카키스케치 KhakiSketch',
    alternateName: ['KhakiSketch', '카키스케치', '케이에스아이', 'KSI', '주식회사 케이에스아이'],
    url: 'https://khakisketch.co.kr',
    logo: 'https://khakisketch.co.kr/icon',
    description: '카키스케치(KhakiSketch, 주식회사 케이에스아이 KSI)는 스타트업 MVP 개발, 개발외주, SI, 비즈니스 자동화를 전문으로 하는 기술 스튜디오입니다. 예비창업패키지·초기창업패키지·청년창업사관학교 지원사업 개발 경험을 보유하고 있습니다.',
    foundingDate: '2024',
    founders: [
      {
        '@type': 'Person',
        name: '송재찬',
        jobTitle: 'Co-founder',
      },
    ],
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'KR',
    },
    sameAs: [
      'https://github.com/khakisketch',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer service',
      email: 'songjc6561@gmail.com',
      availableLanguage: ['Korean', 'English'],
    },
    knowsAbout: [
      '스타트업 MVP 개발',
      '개발외주',
      'SI',
      '시스템통합',
      'SW 개발',
      '소프트웨어 개발',
      '트레이딩 개발',
      '퀀트 개발',
      'React',
      'Next.js',
      'Python',
      'FastAPI',
      'Flutter',
      '업무 자동화',
    ],
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: '개발 서비스',
      itemListElement: [
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: '스타트업 MVP 개발',
            description: '예비창업패키지·초기창업패키지 지원사업 개발',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: '개발외주',
            description: '기업용 맞춤 시스템 개발',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'SI 시스템통합',
            description: '엔터프라이즈 솔루션 개발',
          },
        },
      ],
    },
  };

  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: '카키스케치 KhakiSketch',
    url: 'https://khakisketch.co.kr',
    description: '카키스케치(KhakiSketch) - 스타트업 MVP 개발, 개발외주, SI 전문 기술 스튜디오',
    keywords: ['카키스케치', 'KhakiSketch', 'khakisketch', 'KSI', '케이에스아이', '개발외주', '개발팀', 'SI', 'SW 개발', 'MVP 개발'],
    publisher: {
      '@type': 'Organization',
      name: '카키스케치 KhakiSketch',
      alternateName: '주식회사 케이에스아이',
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://khakisketch.co.kr/blog?q={search_term_string}',
      'query-input': 'required name=search_term_string',
    },
  };

  const serviceSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    serviceType: 'Software Development',
    provider: {
      '@type': 'Organization',
      name: '카키스케치 KhakiSketch',
      alternateName: '주식회사 케이에스아이 KSI',
    },
    areaServed: {
      '@type': 'Country',
      name: 'South Korea',
    },
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: '개발 서비스',
      itemListElement: [
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: '스타트업 MVP 개발',
            description: '예비창업패키지·초기창업패키지 지원사업 개발. 3~4개월 내 투자 유치용 MVP 완성',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: '개발외주',
            description: '기업용 맞춤 시스템 개발. React, Next.js, Python, FastAPI 전문',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'SI 시스템통합',
            description: '엔터프라이즈 솔루션 개발. 데이터 파이프라인, API 개발, 트레이딩 시스템',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: '비즈니스 자동화',
            description: '엑셀 업무를 웹 시스템으로 전환. 업무 프로세스 자동화',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: '기업 홈페이지',
            description: '반응형 기업 소개 웹사이트 제작. SEO 최적화',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: '트레이딩 개발',
            description: '퀀트 트레이딩 시스템, 알고리즘 트레이딩 개발. 백테스팅, 자동매매',
          },
        },
      ],
    },
  };

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: '프로젝트는 어떤 순서로 진행되나요?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: '1) 15~20분 무료 초기 상담 → 2) Discovery 세션(유료, 개발 계약 시 차감)으로 요구사항 정의서 작성 → 3) 견적 및 일정 확정 → 4) 개발 착수 및 주간 진행 공유 → 5) 테스트 및 피드백 반영 → 6) 배포 및 인수 순서로 진행됩니다.',
        },
      },
      {
        '@type': 'Question',
        name: '개발 기간은 얼마나 걸리나요?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'MVP 수준의 웹 서비스는 보통 2~4개월, 업무 자동화 시스템은 1~2개월 정도 소요됩니다. 정확한 기간은 Discovery 세션 후 요구사항 범위에 따라 산정됩니다.',
        },
      },
      {
        '@type': 'Question',
        name: '비용은 어떻게 산정되나요?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: '기능 단위로 공수를 산정하여 견적을 드립니다. Discovery 세션(20~30만원)을 통해 요구사항을 명확히 정리한 후, 상세 견적서를 제공합니다. Discovery 비용은 실제 개발 계약 시 전액 차감됩니다.',
        },
      },
      {
        '@type': 'Question',
        name: '어떤 기술 스택을 사용하나요?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: '프론트엔드는 React/Next.js + TypeScript, 백엔드는 Python/FastAPI 또는 Node.js, 데이터베이스는 PostgreSQL을 주로 사용합니다. 모바일 앱은 Flutter로 개발합니다.',
        },
      },
      {
        '@type': 'Question',
        name: '개발 완료 후 유지보수는 어떻게 되나요?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: '배포 후 1개월간 무상 버그 수정 기간을 제공합니다. 이후에는 월 단위 유지보수 계약 또는 건별 대응 중 선택 가능합니다. 소스코드와 문서는 모두 인수하시므로 다른 개발자가 이어받는 것도 가능합니다.',
        },
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
    </>
  );
}
