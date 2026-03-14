'use client';

import { useState, useEffect } from 'react';
import { getBillingSettings, updateBillingSettings } from '@/lib/firestore-billing-settings';
import type { BillingSettings } from '@/types/billing';

const DEFAULT_SETTINGS: BillingSettings = {
  reminderDaysBefore: 3,
  firstNoticeDaysAfter: 3,
  secondNoticeDaysAfter: 5,
  maxRetryCount: 1,
  bankName: '',
  bankAccount: '',
  bankHolder: '',
  contactPhone: '',
  solapiSendPhone: '',
  useAlimtalk: false,
  paypleIsSandbox: true,
  popbillIsSandbox: true,
  autoIssueTaxInvoice: false,
  supplierRegNo: '',
  supplierName: '',
  supplierCeo: '',
  supplierType: '',
  supplierCategory: '',
  updatedAt: '',
};

export default function BillingSettingsClient(): React.ReactElement {
  const [settings, setSettings] = useState<BillingSettings>(DEFAULT_SETTINGS);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    setIsLoading(true);
    setError(null);

    const result = await getBillingSettings();
    if (result.success && result.data) {
      setSettings(result.data);
    } else {
      setError(result.error ?? '설정을 불러오는데 실패했습니다.');
    }

    setIsLoading(false);
  };

  const handleChange = <K extends keyof BillingSettings>(field: K, value: BillingSettings[K]) => {
    setSettings((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    setError(null);
    setSaveSuccess(false);

    const { updatedAt: _updatedAt, ...rest } = settings;
    const result = await updateBillingSettings(rest);

    if (result.success) {
      setSaveSuccess(true);
      await loadSettings();
      setTimeout(() => setSaveSuccess(false), 3000);
    } else {
      setError(result.error ?? '저장에 실패했습니다.');
    }

    setIsSaving(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-64 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin w-10 h-10 border-3 border-brand-primary border-t-transparent rounded-full" />
          <p className="text-brand-muted">로딩 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-3xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-brand-primary">과금 설정</h1>
          <p className="text-brand-muted text-sm mt-1">
            {settings.updatedAt
              ? `마지막 수정: ${new Date(settings.updatedAt).toLocaleString('ko-KR')}`
              : '설정을 구성해주세요.'}
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="px-6 py-2.5 bg-brand-secondary text-white rounded-xl text-sm font-medium hover:bg-brand-secondary/90 disabled:opacity-50 transition-colors self-start"
        >
          {isSaving ? '저장 중...' : '설정 저장'}
        </button>
      </div>

      {error && (
        <div className="px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">
          {error}
        </div>
      )}
      {saveSuccess && (
        <div className="px-4 py-3 bg-green-50 border border-green-200 rounded-xl text-sm text-green-700">
          설정이 저장되었습니다.
        </div>
      )}

      {/* 독촉 정책 */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-brand-primary/10 p-6 space-y-4">
        <h2 className="text-lg font-bold text-brand-primary">독촉 정책</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-brand-text mb-1.5">사전안내 (D-N일)</label>
            <input
              type="number"
              min="1"
              value={settings.reminderDaysBefore}
              onChange={(e) => handleChange('reminderDaysBefore', Number(e.target.value))}
              className="w-full px-3 py-2 bg-brand-bg border border-brand-primary/10 rounded-xl text-brand-text focus:outline-none focus:ring-2 focus:ring-brand-secondary/30 focus:border-brand-secondary"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-brand-text mb-1.5">1차 독촉 (D+N일)</label>
            <input
              type="number"
              min="1"
              value={settings.firstNoticeDaysAfter}
              onChange={(e) => handleChange('firstNoticeDaysAfter', Number(e.target.value))}
              className="w-full px-3 py-2 bg-brand-bg border border-brand-primary/10 rounded-xl text-brand-text focus:outline-none focus:ring-2 focus:ring-brand-secondary/30 focus:border-brand-secondary"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-brand-text mb-1.5">2차 독촉 (D+N일)</label>
            <input
              type="number"
              min="1"
              value={settings.secondNoticeDaysAfter}
              onChange={(e) => handleChange('secondNoticeDaysAfter', Number(e.target.value))}
              className="w-full px-3 py-2 bg-brand-bg border border-brand-primary/10 rounded-xl text-brand-text focus:outline-none focus:ring-2 focus:ring-brand-secondary/30 focus:border-brand-secondary"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-brand-text mb-1.5">CMS 재시도 횟수</label>
            <input
              type="number"
              min="0"
              max="5"
              value={settings.maxRetryCount}
              onChange={(e) => handleChange('maxRetryCount', Number(e.target.value))}
              className="w-full px-3 py-2 bg-brand-bg border border-brand-primary/10 rounded-xl text-brand-text focus:outline-none focus:ring-2 focus:ring-brand-secondary/30 focus:border-brand-secondary"
            />
          </div>
        </div>
      </div>

      {/* 입금 계좌 */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-brand-primary/10 p-6 space-y-4">
        <h2 className="text-lg font-bold text-brand-primary">입금 계좌</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-brand-text mb-1.5">은행명</label>
            <input
              type="text"
              value={settings.bankName}
              onChange={(e) => handleChange('bankName', e.target.value)}
              placeholder="국민은행"
              className="w-full px-3 py-2 bg-brand-bg border border-brand-primary/10 rounded-xl text-brand-text focus:outline-none focus:ring-2 focus:ring-brand-secondary/30 focus:border-brand-secondary"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-brand-text mb-1.5">계좌번호</label>
            <input
              type="text"
              value={settings.bankAccount}
              onChange={(e) => handleChange('bankAccount', e.target.value)}
              placeholder="000-000-000000"
              className="w-full px-3 py-2 bg-brand-bg border border-brand-primary/10 rounded-xl text-brand-text focus:outline-none focus:ring-2 focus:ring-brand-secondary/30 focus:border-brand-secondary"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-brand-text mb-1.5">예금주</label>
            <input
              type="text"
              value={settings.bankHolder}
              onChange={(e) => handleChange('bankHolder', e.target.value)}
              placeholder="(주)카키스케치"
              className="w-full px-3 py-2 bg-brand-bg border border-brand-primary/10 rounded-xl text-brand-text focus:outline-none focus:ring-2 focus:ring-brand-secondary/30 focus:border-brand-secondary"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-brand-text mb-1.5">문의 전화번호</label>
            <input
              type="tel"
              value={settings.contactPhone}
              onChange={(e) => handleChange('contactPhone', e.target.value)}
              placeholder="010-0000-0000"
              className="w-full px-3 py-2 bg-brand-bg border border-brand-primary/10 rounded-xl text-brand-text focus:outline-none focus:ring-2 focus:ring-brand-secondary/30 focus:border-brand-secondary"
            />
          </div>
        </div>
      </div>

      {/* 공급자 정보 */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-brand-primary/10 p-6 space-y-4">
        <h2 className="text-lg font-bold text-brand-primary">공급자 정보 (세금계산서)</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-brand-text mb-1.5">사업자등록번호</label>
            <input
              type="text"
              value={settings.supplierRegNo}
              onChange={(e) => handleChange('supplierRegNo', e.target.value)}
              placeholder="000-00-00000"
              className="w-full px-3 py-2 bg-brand-bg border border-brand-primary/10 rounded-xl text-brand-text focus:outline-none focus:ring-2 focus:ring-brand-secondary/30 focus:border-brand-secondary"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-brand-text mb-1.5">상호</label>
            <input
              type="text"
              value={settings.supplierName}
              onChange={(e) => handleChange('supplierName', e.target.value)}
              placeholder="(주)카키스케치"
              className="w-full px-3 py-2 bg-brand-bg border border-brand-primary/10 rounded-xl text-brand-text focus:outline-none focus:ring-2 focus:ring-brand-secondary/30 focus:border-brand-secondary"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-brand-text mb-1.5">대표자</label>
            <input
              type="text"
              value={settings.supplierCeo}
              onChange={(e) => handleChange('supplierCeo', e.target.value)}
              placeholder="홍길동"
              className="w-full px-3 py-2 bg-brand-bg border border-brand-primary/10 rounded-xl text-brand-text focus:outline-none focus:ring-2 focus:ring-brand-secondary/30 focus:border-brand-secondary"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-brand-text mb-1.5">업태</label>
            <input
              type="text"
              value={settings.supplierType}
              onChange={(e) => handleChange('supplierType', e.target.value)}
              placeholder="서비스업"
              className="w-full px-3 py-2 bg-brand-bg border border-brand-primary/10 rounded-xl text-brand-text focus:outline-none focus:ring-2 focus:ring-brand-secondary/30 focus:border-brand-secondary"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-brand-text mb-1.5">종목</label>
            <input
              type="text"
              value={settings.supplierCategory}
              onChange={(e) => handleChange('supplierCategory', e.target.value)}
              placeholder="소프트웨어 개발"
              className="w-full px-3 py-2 bg-brand-bg border border-brand-primary/10 rounded-xl text-brand-text focus:outline-none focus:ring-2 focus:ring-brand-secondary/30 focus:border-brand-secondary"
            />
          </div>
        </div>
      </div>

      {/* 알림 설정 */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-brand-primary/10 p-6 space-y-4">
        <h2 className="text-lg font-bold text-brand-primary">알림 설정 (Solapi)</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-brand-text mb-1.5">발신번호</label>
            <input
              type="tel"
              value={settings.solapiSendPhone}
              onChange={(e) => handleChange('solapiSendPhone', e.target.value)}
              placeholder="010-0000-0000"
              className="w-full px-3 py-2 bg-brand-bg border border-brand-primary/10 rounded-xl text-brand-text focus:outline-none focus:ring-2 focus:ring-brand-secondary/30 focus:border-brand-secondary"
            />
          </div>
        </div>
        <div className="space-y-3">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={settings.useAlimtalk}
              onChange={(e) => handleChange('useAlimtalk', e.target.checked)}
              className="w-4 h-4 accent-brand-secondary"
            />
            <span className="text-sm text-brand-text">알림톡 사용 (체크 해제 시 SMS)</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={settings.autoIssueTaxInvoice}
              onChange={(e) => handleChange('autoIssueTaxInvoice', e.target.checked)}
              className="w-4 h-4 accent-brand-secondary"
            />
            <span className="text-sm text-brand-text">세금계산서 자동 발행 (출금 성공 시)</span>
          </label>
        </div>
      </div>

      {/* API 연동 상태 */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-brand-primary/10 p-6 space-y-4">
        <h2 className="text-lg font-bold text-brand-primary">API 연동 상태</h2>
        <p className="text-sm text-brand-muted">API 시크릿 키는 Firebase Secret Manager로 관리됩니다. 변경은 Firebase CLI를 사용하세요.</p>
        <div className="space-y-3">
          {[
            { label: '페이플 (Payple)', key: 'paypleIsSandbox' as const, sandboxField: 'paypleIsSandbox' as const },
            { label: '팝빌 (Popbill)', key: 'popbillIsSandbox' as const, sandboxField: 'popbillIsSandbox' as const },
          ].map(({ label, sandboxField }) => (
            <div key={label} className="flex items-center justify-between p-4 bg-brand-bg rounded-xl">
              <div>
                <p className="font-medium text-brand-text">{label}</p>
                <label className="flex items-center gap-2 mt-1 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings[sandboxField] as boolean}
                    onChange={(e) => handleChange(sandboxField, e.target.checked)}
                    className="w-3.5 h-3.5 accent-brand-secondary"
                  />
                  <span className="text-xs text-brand-muted">샌드박스 모드</span>
                </label>
              </div>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-500">
                시크릿 별도 관리
              </span>
            </div>
          ))}
          <div className="flex items-center justify-between p-4 bg-brand-bg rounded-xl">
            <div>
              <p className="font-medium text-brand-text">Solapi</p>
              <p className="text-xs text-brand-muted mt-0.5">SOLAPI_API_KEY / SOLAPI_API_SECRET</p>
            </div>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-500">
              시크릿 별도 관리
            </span>
          </div>
        </div>
      </div>

      {/* Save Button Bottom */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="px-8 py-2.5 bg-brand-secondary text-white rounded-xl text-sm font-medium hover:bg-brand-secondary/90 disabled:opacity-50 transition-colors"
        >
          {isSaving ? '저장 중...' : '설정 저장'}
        </button>
      </div>
    </div>
  );
}
