'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createBillingClient } from '@/lib/firestore-billing-clients';

interface FormData {
  companyName: string;
  contactName: string;
  phone: string;
  email: string;
  taxEmail: string;
  businessRegNo: string;
  companyType: string;
  companyCategory: string;
  memo: string;
}

const INITIAL_FORM: FormData = {
  companyName: '',
  contactName: '',
  phone: '',
  email: '',
  taxEmail: '',
  businessRegNo: '',
  companyType: '',
  companyCategory: '',
  memo: '',
};

export default function NewBillingClientClient(): React.ReactElement {
  const router = useRouter();
  const [form, setForm] = useState<FormData>(INITIAL_FORM);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const handleChange = (field: keyof FormData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const validate = (): string | null => {
    if (!form.companyName.trim()) return '회사명을 입력해주세요.';
    if (!form.contactName.trim()) return '담당자명을 입력해주세요.';
    if (!form.phone.trim()) return '전화번호를 입력해주세요.';
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationError = validate();
    if (validationError) {
      setFormError(validationError);
      return;
    }

    setIsSubmitting(true);
    setFormError(null);

    const result = await createBillingClient({
      ...form,
      bankCode: '',
      bankAccountNo: '',
      paypleBillingKey: '',
      status: 'active',
    });

    if (result.success && result.data) {
      router.push(`/admin/billing/clients/${result.data}`);
    } else {
      setFormError(result.error ?? '고객 등록에 실패했습니다.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl">
      {/* Header */}
      <div>
        <Link
          href="/admin/billing/clients"
          className="text-sm text-brand-muted hover:text-brand-primary transition-colors flex items-center gap-1"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          고객 목록으로
        </Link>
        <h1 className="text-2xl font-bold text-brand-primary mt-2">새 고객 등록</h1>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white/80 backdrop-blur-sm rounded-2xl border border-brand-primary/10 p-6 space-y-6">
        {formError && (
          <div className="px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">
            {formError}
          </div>
        )}

        {/* Required Fields */}
        <div>
          <h2 className="text-sm font-bold text-brand-muted uppercase tracking-wide mb-4">기본 정보 *필수</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-brand-text mb-1.5">
                회사명 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={form.companyName}
                onChange={(e) => handleChange('companyName', e.target.value)}
                placeholder="(주)예시회사"
                className="w-full px-3 py-2 bg-brand-bg border border-brand-primary/10 rounded-xl text-brand-text placeholder:text-brand-muted/50 focus:outline-none focus:ring-2 focus:ring-brand-secondary/30 focus:border-brand-secondary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-brand-text mb-1.5">
                담당자명 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={form.contactName}
                onChange={(e) => handleChange('contactName', e.target.value)}
                placeholder="홍길동"
                className="w-full px-3 py-2 bg-brand-bg border border-brand-primary/10 rounded-xl text-brand-text placeholder:text-brand-muted/50 focus:outline-none focus:ring-2 focus:ring-brand-secondary/30 focus:border-brand-secondary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-brand-text mb-1.5">
                전화번호 <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                placeholder="010-0000-0000"
                className="w-full px-3 py-2 bg-brand-bg border border-brand-primary/10 rounded-xl text-brand-text placeholder:text-brand-muted/50 focus:outline-none focus:ring-2 focus:ring-brand-secondary/30 focus:border-brand-secondary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-brand-text mb-1.5">이메일</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => handleChange('email', e.target.value)}
                placeholder="example@company.com"
                className="w-full px-3 py-2 bg-brand-bg border border-brand-primary/10 rounded-xl text-brand-text placeholder:text-brand-muted/50 focus:outline-none focus:ring-2 focus:ring-brand-secondary/30 focus:border-brand-secondary"
              />
            </div>
          </div>
        </div>

        {/* Tax / Business Info */}
        <div>
          <h2 className="text-sm font-bold text-brand-muted uppercase tracking-wide mb-4">세금계산서 / 사업자 정보</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-brand-text mb-1.5">세금계산서 이메일</label>
              <input
                type="email"
                value={form.taxEmail}
                onChange={(e) => handleChange('taxEmail', e.target.value)}
                placeholder="tax@company.com"
                className="w-full px-3 py-2 bg-brand-bg border border-brand-primary/10 rounded-xl text-brand-text placeholder:text-brand-muted/50 focus:outline-none focus:ring-2 focus:ring-brand-secondary/30 focus:border-brand-secondary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-brand-text mb-1.5">사업자등록번호</label>
              <input
                type="text"
                value={form.businessRegNo}
                onChange={(e) => handleChange('businessRegNo', e.target.value)}
                placeholder="000-00-00000"
                className="w-full px-3 py-2 bg-brand-bg border border-brand-primary/10 rounded-xl text-brand-text placeholder:text-brand-muted/50 focus:outline-none focus:ring-2 focus:ring-brand-secondary/30 focus:border-brand-secondary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-brand-text mb-1.5">업태</label>
              <input
                type="text"
                value={form.companyType}
                onChange={(e) => handleChange('companyType', e.target.value)}
                placeholder="서비스업"
                className="w-full px-3 py-2 bg-brand-bg border border-brand-primary/10 rounded-xl text-brand-text placeholder:text-brand-muted/50 focus:outline-none focus:ring-2 focus:ring-brand-secondary/30 focus:border-brand-secondary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-brand-text mb-1.5">종목</label>
              <input
                type="text"
                value={form.companyCategory}
                onChange={(e) => handleChange('companyCategory', e.target.value)}
                placeholder="소프트웨어 개발"
                className="w-full px-3 py-2 bg-brand-bg border border-brand-primary/10 rounded-xl text-brand-text placeholder:text-brand-muted/50 focus:outline-none focus:ring-2 focus:ring-brand-secondary/30 focus:border-brand-secondary"
              />
            </div>
          </div>
        </div>

        {/* Memo */}
        <div>
          <label className="block text-sm font-medium text-brand-text mb-1.5">메모</label>
          <textarea
            value={form.memo}
            onChange={(e) => handleChange('memo', e.target.value)}
            rows={3}
            placeholder="내부 메모..."
            className="w-full px-3 py-2 bg-brand-bg border border-brand-primary/10 rounded-xl text-brand-text placeholder:text-brand-muted/50 focus:outline-none focus:ring-2 focus:ring-brand-secondary/30 focus:border-brand-secondary resize-none"
          />
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2.5 bg-brand-secondary text-white rounded-xl text-sm font-medium hover:bg-brand-secondary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isSubmitting ? '등록 중...' : '고객 등록'}
          </button>
          <Link
            href="/admin/billing/clients"
            className="px-6 py-2.5 bg-brand-primary/10 text-brand-primary rounded-xl text-sm font-medium hover:bg-brand-primary/20 transition-colors"
          >
            취소
          </Link>
        </div>
      </form>
    </div>
  );
}
