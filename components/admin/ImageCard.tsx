'use client';

import { useState } from 'react';
import { StorageImage } from '@/lib/storage';

interface ImageCardProps {
  image: StorageImage;
  onDelete: (fullPath: string) => Promise<void>;
}

export default function ImageCard({ image, onDelete }: ImageCardProps): React.ReactElement {
  const [isDeleting, setIsDeleting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = async (): Promise<void> => {
    try {
      await navigator.clipboard.writeText(image.url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      alert('URL 복사에 실패했습니다.');
    }
  };

  const handleDelete = async (): Promise<void> => {
    setIsDeleting(true);
    try {
      await onDelete(image.fullPath);
    } catch (err) {
      alert(err instanceof Error ? err.message : '삭제 실패');
    } finally {
      setIsDeleting(false);
      setShowConfirm(false);
    }
  };

  const categoryColors: Record<string, string> = {
    portfolio: 'bg-brand-primary/10 text-brand-primary',
    blog: 'bg-brand-secondary/20 text-brand-secondary',
    site: 'bg-brand-muted/20 text-brand-muted',
  };

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-brand-primary/10 overflow-hidden group hover:shadow-md hover:border-brand-primary/20 transition-all duration-300">
      {/* 이미지 영역 */}
      <div className="aspect-video relative overflow-hidden bg-brand-bg">
        <img
          src={image.url}
          alt={image.name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />

        {/* 호버 오버레이 */}
        <div className="absolute inset-0 bg-brand-primary/70 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center gap-2">
          <button
            onClick={handleCopy}
            className="p-2.5 bg-white rounded-xl hover:bg-brand-bg transition-all duration-200 shadow-sm"
            title="URL 복사"
          >
            {copied ? (
              <svg className="w-5 h-5 text-brand-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg className="w-5 h-5 text-brand-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"
                />
              </svg>
            )}
          </button>

          <a
            href={image.url}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2.5 bg-white rounded-xl hover:bg-brand-bg transition-all duration-200 shadow-sm"
            title="원본 보기"
          >
            <svg className="w-5 h-5 text-brand-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
              />
            </svg>
          </a>

          <button
            onClick={() => setShowConfirm(true)}
            className="p-2.5 bg-red-500 rounded-xl hover:bg-red-600 transition-all duration-200 shadow-sm"
            title="삭제"
          >
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* 정보 영역 */}
      <div className="p-3">
        <div className="flex items-start justify-between gap-2">
          <p className="text-sm text-brand-text font-medium truncate flex-1" title={image.name}>
            {image.name}
          </p>
          <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${categoryColors[image.category]}`}>
            {image.category}
          </span>
        </div>
        {image.subPath && (
          <p className="text-xs text-brand-muted mt-1 truncate" title={image.subPath}>
            {image.subPath}
          </p>
        )}
      </div>

      {/* 삭제 확인 모달 */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-xl">
            <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-7 h-7 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-brand-primary text-center mb-2">이미지 삭제</h3>
            <p className="text-brand-muted text-center mb-6">
              이 이미지를 삭제하시겠습니까?
              <br />
              <span className="text-sm text-brand-muted/70">이 작업은 되돌릴 수 없습니다.</span>
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                disabled={isDeleting}
                className="flex-1 px-4 py-3 border border-brand-primary/20 rounded-xl text-brand-text hover:bg-brand-bg transition-all duration-300 disabled:opacity-50"
              >
                취소
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="flex-1 px-4 py-3 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isDeleting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    삭제 중...
                  </>
                ) : (
                  '삭제'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
