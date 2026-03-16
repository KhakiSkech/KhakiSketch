'use client';

import { logger } from '@/lib/logger';
import { useState, useEffect, useRef } from 'react';
import { getHeroImages, saveHeroImages } from '@/lib/firestore-site-settings';
import { uploadImage } from '@/lib/storage';
import type { SiteHeroImages } from '@/types/admin';

const DEFAULT_IMAGE_BACK =
  'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80';
const DEFAULT_IMAGE_FRONT =
  'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80';

export default function HeroImagesEditor(): React.ReactElement {
  const [heroImages, setHeroImages] = useState<SiteHeroImages>({
    imageBack: '',
    imageFront: '',
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [uploadingField, setUploadingField] = useState<'back' | 'front' | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const backFileRef = useRef<HTMLInputElement>(null);
  const frontFileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadHeroImages();
  }, []);

  const loadHeroImages = async (): Promise<void> => {
    try {
      const data = await getHeroImages();
      if (data) {
        setHeroImages(data);
      }
    } catch (error) {
      logger.error('Hero images 로드 실패:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = async (
    file: File,
    field: 'back' | 'front'
  ): Promise<void> => {
    if (!file.type.startsWith('image/')) {
      setMessage({ type: 'error', text: '이미지 파일만 업로드할 수 있습니다.' });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setMessage({ type: 'error', text: '파일 크기는 5MB 이하여야 합니다.' });
      return;
    }

    setUploadingField(field);
    setMessage(null);

    try {
      const url = await uploadImage(file, 'site', 'hero');
      setHeroImages((prev) => ({
        ...prev,
        [field === 'back' ? 'imageBack' : 'imageFront']: url,
      }));
      setMessage({ type: 'success', text: '이미지가 업로드되었습니다.' });
    } catch (error) {
      logger.error('이미지 업로드 실패:', error);
      setMessage({ type: 'error', text: '이미지 업로드에 실패했습니다.' });
    } finally {
      setUploadingField(null);
    }
  };

  const handleSave = async (): Promise<void> => {
    if (!heroImages.imageBack && !heroImages.imageFront) {
      setMessage({ type: 'error', text: '하나 이상의 이미지 URL을 입력해주세요.' });
      return;
    }

    setIsSaving(true);
    setMessage(null);

    try {
      const result = await saveHeroImages(heroImages);
      if (result.success) {
        setMessage({ type: 'success', text: '저장되었습니다.' });
      } else {
        setMessage({ type: 'error', text: result.error || '저장에 실패했습니다.' });
      }
    } catch {
      setMessage({ type: 'error', text: '저장 중 오류가 발생했습니다.' });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="animate-pulse">
        <div className="grid grid-cols-2 gap-4">
          {[1, 2].map((i) => (
            <div key={i} className="h-48 bg-brand-primary/5 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  const previewBack = heroImages.imageBack || DEFAULT_IMAGE_BACK;
  const previewFront = heroImages.imageFront || DEFAULT_IMAGE_FRONT;

  return (
    <div className="space-y-6">
      {message && (
        <div
          className={`p-4 rounded-xl ${
            message.type === 'success'
              ? 'bg-green-50 text-green-700 border border-green-200'
              : 'bg-red-50 text-red-600 border border-red-200'
          }`}
        >
          {message.text}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Back Image */}
        <div className="space-y-3">
          <label className="block text-sm font-medium text-brand-text">
            뒤쪽 노트북 이미지
          </label>
          <div className="relative rounded-xl overflow-hidden border border-brand-primary/10 aspect-video bg-gray-50">
            <img
              src={previewBack}
              alt="뒤쪽 노트북 미리보기"
              className="w-full h-full object-cover"
            />
            {uploadingField === 'back' && (
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
              </div>
            )}
          </div>
          <div className="flex gap-2">
            <input
              ref={backFileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  handleFileUpload(file, 'back');
                }
              }}
            />
            <button
              type="button"
              onClick={() => backFileRef.current?.click()}
              disabled={uploadingField !== null}
              className="px-4 py-2 text-sm bg-brand-primary/10 text-brand-primary rounded-lg hover:bg-brand-primary/20 transition-colors disabled:opacity-50"
            >
              업로드
            </button>
          </div>
          <input
            type="url"
            placeholder="이미지 URL 직접 입력"
            value={heroImages.imageBack}
            onChange={(e) =>
              setHeroImages((prev) => ({ ...prev, imageBack: e.target.value }))
            }
            className="w-full px-4 py-3 rounded-xl border border-brand-primary/10 focus:outline-none focus:border-brand-secondary text-sm"
          />
        </div>

        {/* Front Image */}
        <div className="space-y-3">
          <label className="block text-sm font-medium text-brand-text">
            앞쪽 노트북 이미지
          </label>
          <div className="relative rounded-xl overflow-hidden border border-brand-primary/10 aspect-video bg-gray-50">
            <img
              src={previewFront}
              alt="앞쪽 노트북 미리보기"
              className="w-full h-full object-cover"
            />
            {uploadingField === 'front' && (
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
              </div>
            )}
          </div>
          <div className="flex gap-2">
            <input
              ref={frontFileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  handleFileUpload(file, 'front');
                }
              }}
            />
            <button
              type="button"
              onClick={() => frontFileRef.current?.click()}
              disabled={uploadingField !== null}
              className="px-4 py-2 text-sm bg-brand-primary/10 text-brand-primary rounded-lg hover:bg-brand-primary/20 transition-colors disabled:opacity-50"
            >
              업로드
            </button>
          </div>
          <input
            type="url"
            placeholder="이미지 URL 직접 입력"
            value={heroImages.imageFront}
            onChange={(e) =>
              setHeroImages((prev) => ({ ...prev, imageFront: e.target.value }))
            }
            className="w-full px-4 py-3 rounded-xl border border-brand-primary/10 focus:outline-none focus:border-brand-secondary text-sm"
          />
        </div>
      </div>

      <p className="text-xs text-brand-muted">
        이미지를 설정하지 않으면 기본 Unsplash 이미지가 사용됩니다. 권장 해상도: 800x500px
      </p>

      <div className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="px-6 py-3 bg-brand-primary text-white rounded-xl font-medium hover:bg-brand-primary/90 transition-colors disabled:opacity-50 flex items-center gap-2"
        >
          {isSaving && (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          )}
          저장
        </button>
      </div>
    </div>
  );
}
