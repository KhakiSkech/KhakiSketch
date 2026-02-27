'use client';

import { useState, FormEvent } from 'react';
import { useAuth } from '@/hooks/useAuth';
import NoiseTexture from '@/components/ui/NoiseTexture';

export default function AdminAuth(): React.ReactElement {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { signIn, error } = useAuth();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    if (!email.trim() || !password.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await signIn(email, password);
    } catch (err) {
      // Error is handled in useAuth
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-bg flex items-center justify-center p-4 relative">
      {/* Noise Texture */}
      <NoiseTexture />

      {/* Login Card */}
      <div className="relative z-10 w-full max-w-md">
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl shadow-brand-primary/5 border border-brand-primary/10 p-8 sm:p-10">
          {/* Header */}
          <div className="text-center mb-8">
            {/* Logo */}
            <div className="flex items-center justify-center gap-2 mb-6">
              <span className="w-2.5 h-2.5 rounded-full bg-brand-secondary" />
              <span className="font-bold text-xl text-brand-primary">KhakiSketch</span>
            </div>

            {/* Icon */}
            <div className="w-16 h-16 bg-gradient-to-br from-brand-primary to-brand-secondary rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-lg shadow-brand-primary/20">
              <svg
                className="w-8 h-8 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>

            <h1 className="text-2xl font-bold text-brand-primary">관리자 로그인</h1>
            <p className="text-brand-muted mt-2 text-sm">이메일과 비밀번호를 입력해주세요</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="email" className="sr-only">
                이메일
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="관리자 이메일"
                className="w-full px-5 py-4 bg-brand-bg border border-brand-primary/10 rounded-xl text-brand-text placeholder:text-brand-muted/50 focus:outline-none focus:ring-2 focus:ring-brand-secondary/30 focus:border-brand-secondary transition-all duration-300"
                autoFocus
                disabled={isSubmitting}
              />
            </div>

            <div>
              <label htmlFor="password" className="sr-only">
                비밀번호
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="비밀번호"
                className="w-full px-5 py-4 bg-brand-bg border border-brand-primary/10 rounded-xl text-brand-text placeholder:text-brand-muted/50 focus:outline-none focus:ring-2 focus:ring-brand-secondary/30 focus:border-brand-secondary transition-all duration-300"
                disabled={isSubmitting}
              />
            </div>

            {error && (
              <div className="flex items-center gap-2 bg-red-50 text-red-600 px-4 py-3 rounded-xl text-sm border border-red-100">
                <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={!email.trim() || !password.trim() || isSubmitting}
              className="w-full bg-brand-primary text-white py-4 rounded-xl font-medium hover:bg-brand-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center gap-2 group"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  로그인 중...
                </>
              ) : (
                <>
                  로그인
                  <svg className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </>
              )}
            </button>
          </form>

          {/* Footer */}
          <p className="text-center text-xs text-brand-muted mt-8">
            KhakiSketch Admin Panel
          </p>
        </div>

        {/* Decorative Element */}
        <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-br from-brand-secondary/5 to-brand-primary/5 rounded-full blur-3xl" />
      </div>
    </div>
  );
}
