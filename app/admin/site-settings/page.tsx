'use client';

import { useState } from 'react';
import StatsEditor from '@/components/admin/StatsEditor';
import FAQEditor from '@/components/admin/FAQEditor';
import TestimonialsEditor from '@/components/admin/TestimonialsEditor';
import PricingEditor from '@/components/admin/PricingEditor';

type TabKey = 'stats' | 'faq' | 'testimonials' | 'pricing';

interface Tab {
  key: TabKey;
  label: string;
  icon: React.ReactNode;
}

const TABS: Tab[] = [
  {
    key: 'stats',
    label: '통계',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
        />
      </svg>
    ),
  },
  {
    key: 'faq',
    label: 'FAQ',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
  },
  {
    key: 'testimonials',
    label: '고객 후기',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
        />
      </svg>
    ),
  },
  {
    key: 'pricing',
    label: '가격표',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
  },
];

export default function SiteSettingsPage(): React.ReactElement {
  const [activeTab, setActiveTab] = useState<TabKey>('stats');

  const renderContent = (): React.ReactElement => {
    switch (activeTab) {
      case 'stats':
        return <StatsEditor />;
      case 'faq':
        return <FAQEditor />;
      case 'testimonials':
        return <TestimonialsEditor />;
      case 'pricing':
        return <PricingEditor />;
      default:
        return <StatsEditor />;
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-brand-primary">Site Settings</h1>
        <p className="text-brand-muted text-sm mt-1">사이트 콘텐츠를 관리합니다</p>
      </div>

      {/* Tabs */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-brand-primary/10">
        {/* Tab Navigation */}
        <div className="flex border-b border-brand-primary/10 overflow-x-auto">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 px-6 py-4 text-sm font-medium transition-colors whitespace-nowrap ${
                activeTab === tab.key
                  ? 'text-brand-primary border-b-2 border-brand-primary -mb-px'
                  : 'text-brand-muted hover:text-brand-text'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="p-6">{renderContent()}</div>
      </div>
    </div>
  );
}
