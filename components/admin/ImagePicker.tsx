'use client';

import { logger } from '@/lib/logger';
import { useState, useEffect, useRef, DragEvent, ChangeEvent } from 'react';
import { listAllImages, StorageImage, ImageCategory, uploadImage } from '@/lib/storage';
import { optimizeImage, formatFileSize } from '@/lib/image-optimizer';
import Toast from '@/components/ui/Toast';

interface ImagePickerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (url: string) => void;
  category?: ImageCategory;
  title?: string;
}

interface UploadFile {
  file: File;
  preview: string;
  optimized?: File;
  optimizedPreview?: string;
}

export default function ImagePicker({
  isOpen,
  onClose,
  onSelect,
  category = 'portfolio',
  title = '이미지 선택',
}: ImagePickerProps): React.ReactElement | null {
  const [activeTab, setActiveTab] = useState<'existing' | 'upload'>('existing');
  const [images, setImages] = useState<StorageImage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<ImageCategory | 'all'>(
    category || 'all'
  );
  
  // Upload tab states
  const [uploadFiles, setUploadFiles] = useState<UploadFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [enableOptimize, setEnableOptimize] = useState(true);
  const [maxWidth, setMaxWidth] = useState(1920);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      loadImages();
    }
  }, [isOpen]);

  const loadImages = async (): Promise<void> => {
    setIsLoading(true);
    try {
      const allImages = await listAllImages();
      setImages(allImages);
    } catch (error) {
      logger.error('이미지 로드 실패:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredImages =
    selectedCategory === 'all'
      ? images
      : images.filter((img) => img.category === selectedCategory);

  const handleSelect = (url: string): void => {
    onSelect(url);
    onClose();
  };

  // Upload tab handlers
  const handleDragOver = (e: DragEvent<HTMLDivElement>): void => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>): void => {
    e.preventDefault();
    e.stopPropagation();
    const files = Array.from(e.dataTransfer.files).filter((file) =>
      file.type.startsWith('image/')
    );
    if (files.length > 0) {
      addFiles(files);
    }
  };

  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>): void => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    if (files.length > 0) {
      addFiles(files);
    }
    e.target.value = '';
  };

  const addFiles = async (files: File[]): Promise<void> => {
    const newFiles: UploadFile[] = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));
    setUploadFiles((prev) => [...prev, ...newFiles]);

    if (enableOptimize) {
      await optimizeFiles(newFiles);
    }
  };

  const optimizeFiles = async (filesToOptimize: UploadFile[]): Promise<void> => {
    setIsOptimizing(true);
    const optimized = await Promise.all(
      filesToOptimize.map(async (f) => {
        if (f.optimized) return f;
        try {
          const optimizedFile = await optimizeImage(f.file, {
            maxWidth,
            maxHeight: Math.round(maxWidth * 0.75),
            quality: 0.85,
            format: 'webp',
          });
          return {
            ...f,
            optimized: optimizedFile,
            optimizedPreview: URL.createObjectURL(optimizedFile),
          };
        } catch {
          return f;
        }
      })
    );
    setUploadFiles((prev) => {
      const existing = prev.filter((p) => !filesToOptimize.find((f) => f.file === p.file));
      return [...existing, ...optimized];
    });
    setIsOptimizing(false);
  };

  const removeFile = (index: number): void => {
    setUploadFiles((prev) => {
      const removed = prev[index];
      URL.revokeObjectURL(removed.preview);
      if (removed.optimizedPreview) {
        URL.revokeObjectURL(removed.optimizedPreview);
      }
      return prev.filter((_, i) => i !== index);
    });
  };

  const handleUploadAndSelect = async (): Promise<void> => {
    if (uploadFiles.length === 0) return;
    setIsUploading(true);

    try {
      const fileToUpload = uploadFiles[0];
      const uploadFile = enableOptimize && fileToUpload.optimized 
        ? fileToUpload.optimized 
        : fileToUpload.file;
      
      const url = await uploadImage(uploadFile, category);
      
      // Cleanup
      uploadFiles.forEach((f) => {
        URL.revokeObjectURL(f.preview);
        if (f.optimizedPreview) URL.revokeObjectURL(f.optimizedPreview);
      });
      setUploadFiles([]);
      
      handleSelect(url);
    } catch (error) {
      logger.error('업로드 실패:', error);
      setToast({ message: '업로드에 실패했습니다.', type: 'error' });
    } finally {
      setIsUploading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* 토스트 알림 */}
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-xl max-w-4xl w-full max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-brand-primary/10">
          <h2 className="text-xl font-bold text-brand-primary">{title}</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-brand-primary/5 rounded-full transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-brand-primary/10">
          <button
            onClick={() => setActiveTab('existing')}
            className={`flex-1 py-3 text-sm font-medium transition-colors ${
              activeTab === 'existing'
                ? 'text-brand-primary border-b-2 border-brand-primary'
                : 'text-brand-muted hover:text-brand-text'
            }`}
          >
            기존 이미지 선택
          </button>
          <button
            onClick={() => setActiveTab('upload')}
            className={`flex-1 py-3 text-sm font-medium transition-colors ${
              activeTab === 'upload'
                ? 'text-brand-primary border-b-2 border-brand-primary'
                : 'text-brand-muted hover:text-brand-text'
            }`}
          >
            새 이미지 업로드
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden">
          {activeTab === 'existing' ? (
            <div className="h-full flex flex-col">
              {/* Category Filter */}
              <div className="px-6 py-3 border-b border-brand-primary/10">
                <div className="flex gap-2">
                  {[
                    { value: 'all', label: '전체' },
                    { value: 'portfolio', label: 'Portfolio' },
                    { value: 'blog', label: 'Blog' },
                    { value: 'site', label: 'Site' },
                  ].map((cat) => (
                    <button
                      key={cat.value}
                      onClick={() => setSelectedCategory(cat.value as ImageCategory | 'all')}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                        selectedCategory === cat.value
                          ? 'bg-brand-primary text-white'
                          : 'bg-brand-primary/5 text-brand-text hover:bg-brand-primary/10'
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Image Grid */}
              <div className="flex-1 overflow-y-auto p-6">
                {isLoading ? (
                  <div className="flex items-center justify-center h-64">
                    <div className="animate-spin w-8 h-8 border-2 border-brand-primary border-t-transparent rounded-full" />
                  </div>
                ) : filteredImages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-64 text-brand-muted">
                    <svg className="w-16 h-16 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p>이미지가 없습니다</p>
                    <p className="text-sm mt-1">새 이미지 업로드 탭에서 추가하세요</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
                    {filteredImages.map((image) => (
                      <button
                        key={image.fullPath}
                        onClick={() => handleSelect(image.url)}
                        className="aspect-square rounded-xl overflow-hidden border-2 border-transparent hover:border-brand-secondary transition-all group"
                      >
                        <img
                          src={image.url}
                          alt={image.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="h-full overflow-y-auto p-6">
              {/* Optimization Options */}
              <div className="mb-6 p-4 bg-brand-bg rounded-xl border border-brand-primary/5">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={enableOptimize}
                        onChange={(e) => setEnableOptimize(e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-10 h-5 bg-brand-muted/30 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-brand-secondary/30 rounded-full peer peer-checked:after:translate-x-5 peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-brand-secondary"></div>
                    </label>
                    <span className="text-sm font-medium text-brand-text">
                      이미지 최적화 (WebP 변환)
                    </span>
                  </div>
                  {enableOptimize && (
                    <div className="flex items-center gap-2">
                      <label className="text-xs text-brand-muted">최대 너비:</label>
                      <select
                        value={maxWidth}
                        onChange={(e) => setMaxWidth(Number(e.target.value))}
                        className="text-xs px-2 py-1 bg-white border border-brand-primary/10 rounded-lg"
                      >
                        <option value={1280}>1280px</option>
                        <option value={1920}>1920px</option>
                        <option value={2560}>2560px</option>
                      </select>
                    </div>
                  )}
                </div>
                {enableOptimize && (
                  <p className="text-xs text-brand-muted">
                    이미지를 WebP로 변환하고 크기를 조정하여 로딩 속도를 개선합니다.
                  </p>
                )}
              </div>

              {/* Drop Zone */}
              {uploadFiles.length === 0 && (
                <div
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-brand-primary/20 rounded-2xl p-10 text-center cursor-pointer hover:border-brand-secondary/50 hover:bg-brand-bg transition-all"
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                  <svg className="w-12 h-12 mx-auto mb-3 text-brand-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  <p className="text-brand-text mb-1">
                    이미지를 드래그하거나 <span className="text-brand-secondary font-medium">클릭</span>하여 선택하세요
                  </p>
                  <p className="text-xs text-brand-muted">PNG, JPG, WebP 지원</p>
                </div>
              )}

              {/* Preview */}
              {uploadFiles.length > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-brand-text">
                      선택된 파일 ({uploadFiles.length}개)
                    </p>
                    {isOptimizing && (
                      <span className="flex items-center gap-1.5 text-xs text-brand-secondary">
                        <div className="w-3 h-3 border-2 border-brand-secondary border-t-transparent rounded-full animate-spin" />
                        최적화 중...
                      </span>
                    )}
                  </div>

                  {/* Size reduction info */}
                  {enableOptimize && !isOptimizing && (
                    <div className="p-3 bg-brand-secondary/10 rounded-xl text-sm text-brand-text">
                      {formatFileSize(uploadFiles[0].file.size)} → {' '}
                      {formatFileSize(uploadFiles[0].optimized?.size || uploadFiles[0].file.size)}
                      {uploadFiles[0].optimized && (
                        <span className="ml-2 text-brand-secondary font-bold">
                          -{Math.round((1 - uploadFiles[0].optimized.size / uploadFiles[0].file.size) * 100)}%
                        </span>
                      )}
                    </div>
                  )}

                  <div className="relative aspect-video rounded-xl overflow-hidden border border-brand-primary/10">
                    <img
                      src={uploadFiles[0].optimizedPreview || uploadFiles[0].preview}
                      alt="Preview"
                      className="w-full h-full object-contain bg-gray-100"
                    />
                    <button
                      onClick={() => removeFile(0)}
                      className="absolute top-2 right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>

                  <button
                    onClick={handleUploadAndSelect}
                    disabled={isUploading || isOptimizing}
                    className="w-full py-3 bg-brand-primary text-white rounded-xl font-medium hover:bg-brand-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                  >
                    {isUploading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        업로드 중...
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        업로드 후 선택
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-brand-primary/10 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-brand-primary/5 text-brand-text rounded-full text-sm font-medium hover:bg-brand-primary/10 transition-colors"
          >
            취소
          </button>
        </div>
      </div>
    </div>
  );
}
