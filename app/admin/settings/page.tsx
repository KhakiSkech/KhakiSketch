'use client';

import { logger } from '@/lib/logger';
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { getNotificationSettings, updateNotificationSettings, type NotificationSettings } from '@/lib/firestore-settings';

export default function AdminSettingsPage(): React.ReactElement {
  const { changePassword } = useAuth();

  // 비밀번호 변경 상태
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordChanging, setPasswordChanging] = useState(false);
  const [passwordResult, setPasswordResult] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  // 알림 설정 상태
  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>({
    recipientEmails: [],
    smtp: { host: '', port: 587, user: '', from: '' },
  });
  const [newEmail, setNewEmail] = useState('');
  const [notificationLoading, setNotificationLoading] = useState(true);
  const [notificationSaving, setNotificationSaving] = useState(false);
  const [notificationResult, setNotificationResult] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  // 알림 설정 로드
  useEffect(() => {
    async function loadSettings() {
      try {
        const settings = await getNotificationSettings();
        setNotificationSettings(settings);
      } catch (error) {
        logger.error('알림 설정 로드 실패:', error);
      } finally {
        setNotificationLoading(false);
      }
    }
    loadSettings();
  }, []);

  // 비밀번호 변경 핸들러
  const handleChangePassword = async (): Promise<void> => {
    setPasswordResult(null);

    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordResult({ type: 'error', text: '모든 필드를 입력해주세요.' });
      return;
    }
    if (newPassword.length < 6) {
      setPasswordResult({ type: 'error', text: '새 비밀번호는 6자 이상이어야 합니다.' });
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordResult({ type: 'error', text: '새 비밀번호가 일치하지 않습니다.' });
      return;
    }

    setPasswordChanging(true);
    try {
      await changePassword(currentPassword, newPassword);
      setPasswordResult({ type: 'success', text: '비밀번호가 변경되었습니다.' });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      const message = err instanceof Error ? err.message : '비밀번호 변경에 실패했습니다.';
      setPasswordResult({ type: 'error', text: message });
    } finally {
      setPasswordChanging(false);
    }
  };

  // 알림 이메일 추가
  const handleAddEmail = (): void => {
    const email = newEmail.trim().toLowerCase();
    if (!email) return;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setNotificationResult({ type: 'error', text: '유효한 이메일 주소를 입력해주세요.' });
      return;
    }
    if (notificationSettings.recipientEmails.includes(email)) {
      setNotificationResult({ type: 'error', text: '이미 추가된 이메일입니다.' });
      return;
    }
    setNotificationSettings((prev) => ({
      ...prev,
      recipientEmails: [...prev.recipientEmails, email],
    }));
    setNewEmail('');
    setNotificationResult(null);
  };

  // 알림 이메일 삭제
  const handleRemoveEmail = (email: string): void => {
    setNotificationSettings((prev) => ({
      ...prev,
      recipientEmails: prev.recipientEmails.filter((e) => e !== email),
    }));
  };

  // 알림 설정 저장
  const handleSaveNotification = async (): Promise<void> => {
    setNotificationSaving(true);
    setNotificationResult(null);
    try {
      const result = await updateNotificationSettings(notificationSettings);
      if (result.success) {
        setNotificationResult({ type: 'success', text: '알림 설정이 저장되었습니다.' });
      } else {
        setNotificationResult({ type: 'error', text: result.error || '저장에 실패했습니다.' });
      }
    } catch {
      setNotificationResult({ type: 'error', text: '알림 설정 저장에 실패했습니다.' });
    } finally {
      setNotificationSaving(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-brand-primary">Settings</h1>
        <p className="text-brand-muted text-sm mt-1">관리자 계정 설정을 관리합니다</p>
      </div>

      {/* 섹션 1: 비밀번호 변경 */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-brand-primary/10 p-6 sm:p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-brand-primary/10 rounded-xl flex items-center justify-center">
            <svg className="w-5 h-5 text-brand-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
            </svg>
          </div>
          <div>
            <h2 className="text-lg font-bold text-brand-primary">비밀번호 변경</h2>
            <p className="text-xs text-brand-muted">관리자 계정 비밀번호를 변경합니다</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-brand-primary mb-1.5">현재 비밀번호</label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary"
              placeholder="현재 비밀번호 입력"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-brand-primary mb-1.5">새 비밀번호</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary"
              placeholder="새 비밀번호 (6자 이상)"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-brand-primary mb-1.5">새 비밀번호 확인</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary"
              placeholder="새 비밀번호 다시 입력"
            />
          </div>

          {passwordResult && (
            <div
              className={`flex items-center gap-3 p-4 rounded-xl ${
                passwordResult.type === 'success'
                  ? 'bg-green-50 text-green-700 border border-green-200'
                  : 'bg-red-50 text-red-600 border border-red-100'
              }`}
            >
              {passwordResult.type === 'success' ? (
                <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              ) : (
                <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              )}
              <span className="text-sm">{passwordResult.text}</span>
            </div>
          )}

          <button
            onClick={handleChangePassword}
            disabled={passwordChanging}
            className="w-full px-6 py-3 bg-brand-primary text-white font-medium rounded-xl hover:bg-brand-primary/90 focus:outline-none focus:ring-2 focus:ring-brand-primary/30 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center gap-2"
          >
            {passwordChanging ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                변경 중...
              </>
            ) : (
              '비밀번호 변경'
            )}
          </button>
        </div>
      </div>

      {/* 섹션 2: 알림 설정 */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-brand-primary/10 p-6 sm:p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
          </div>
          <div>
            <h2 className="text-lg font-bold text-brand-primary">알림 설정</h2>
            <p className="text-xs text-brand-muted">견적 알림 수신 이메일 및 SMTP 설정</p>
          </div>
        </div>

        {notificationLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="w-6 h-6 border-2 border-brand-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="space-y-6">
            {/* 수신 이메일 목록 */}
            <div>
              <label className="block text-sm font-medium text-brand-primary mb-2">수신 이메일</label>
              <div className="flex gap-2 mb-3">
                <input
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddEmail()}
                  className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary"
                  placeholder="이메일 주소 입력"
                />
                <button
                  onClick={handleAddEmail}
                  className="px-4 py-2.5 bg-brand-primary text-white font-medium rounded-xl hover:bg-brand-primary/90 transition-all text-sm"
                >
                  추가
                </button>
              </div>
              {notificationSettings.recipientEmails.length > 0 ? (
                <div className="space-y-2">
                  {notificationSettings.recipientEmails.map((email) => (
                    <div key={email} className="flex items-center justify-between px-4 py-2.5 bg-gray-50 rounded-xl">
                      <span className="text-sm text-brand-primary">{email}</span>
                      <button
                        onClick={() => handleRemoveEmail(email)}
                        className="text-red-400 hover:text-red-600 transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-brand-muted">등록된 수신 이메일이 없습니다.</p>
              )}
            </div>

            {/* SMTP 설정 */}
            <div>
              <label className="block text-sm font-medium text-brand-primary mb-3">SMTP 설정</label>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-brand-muted mb-1">호스트</label>
                  <input
                    type="text"
                    value={notificationSettings.smtp.host}
                    onChange={(e) =>
                      setNotificationSettings((prev) => ({
                        ...prev,
                        smtp: { ...prev.smtp, host: e.target.value },
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary"
                    placeholder="smtp.gmail.com"
                  />
                </div>
                <div>
                  <label className="block text-xs text-brand-muted mb-1">포트</label>
                  <input
                    type="number"
                    value={notificationSettings.smtp.port}
                    onChange={(e) =>
                      setNotificationSettings((prev) => ({
                        ...prev,
                        smtp: { ...prev.smtp, port: parseInt(e.target.value) || 587 },
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary"
                    placeholder="587"
                  />
                </div>
                <div>
                  <label className="block text-xs text-brand-muted mb-1">사용자</label>
                  <input
                    type="text"
                    value={notificationSettings.smtp.user}
                    onChange={(e) =>
                      setNotificationSettings((prev) => ({
                        ...prev,
                        smtp: { ...prev.smtp, user: e.target.value },
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary"
                    placeholder="user@gmail.com"
                  />
                </div>
                <div>
                  <label className="block text-xs text-brand-muted mb-1">발신자</label>
                  <input
                    type="text"
                    value={notificationSettings.smtp.from}
                    onChange={(e) =>
                      setNotificationSettings((prev) => ({
                        ...prev,
                        smtp: { ...prev.smtp, from: e.target.value },
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary"
                    placeholder="noreply@example.com"
                  />
                </div>
              </div>
            </div>

            {notificationResult && (
              <div
                className={`flex items-center gap-3 p-4 rounded-xl ${
                  notificationResult.type === 'success'
                    ? 'bg-green-50 text-green-700 border border-green-200'
                    : 'bg-red-50 text-red-600 border border-red-100'
                }`}
              >
                {notificationResult.type === 'success' ? (
                  <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                )}
                <span className="text-sm">{notificationResult.text}</span>
              </div>
            )}

            <button
              onClick={handleSaveNotification}
              disabled={notificationSaving}
              className="w-full px-6 py-3 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center gap-2"
            >
              {notificationSaving ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  저장 중...
                </>
              ) : (
                '알림 설정 저장'
              )}
            </button>
          </div>
        )}
      </div>

      {/* 섹션 3: Firebase Console */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-brand-primary/10 p-6 sm:p-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
              <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </div>
            <div>
              <h2 className="text-lg font-bold text-brand-primary">Firebase Console</h2>
              <p className="text-xs text-brand-muted">고급 설정은 Firebase Console에서 관리합니다</p>
            </div>
          </div>
          <a
            href="https://console.firebase.google.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2.5 text-sm text-orange-600 font-medium bg-orange-50 rounded-xl hover:bg-orange-100 transition-all"
          >
            열기
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        </div>
      </div>

    </div>
  );
}
