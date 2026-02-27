export interface OptimizeOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
  format?: 'webp' | 'jpeg' | 'png';
}

const DEFAULT_OPTIONS: Required<OptimizeOptions> = {
  maxWidth: 1920,
  maxHeight: 1080,
  quality: 0.85,
  format: 'webp',
};

/**
 * 이미지를 최적화 (리사이징 + 포맷 변환)
 */
export async function optimizeImage(
  file: File,
  options: OptimizeOptions = {}
): Promise<File> {
  const opts = { ...DEFAULT_OPTIONS, ...options };

  // 이미 최적화된 작은 이미지는 그대로 반환
  if (file.size < 100 * 1024 && file.type === `image/${opts.format}`) {
    return file;
  }

  return new Promise((resolve, reject) => {
    const img = new Image();
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      reject(new Error('Canvas context not available'));
      return;
    }

    img.onload = () => {
      // 리사이징 계산
      let { width, height } = img;
      const aspectRatio = width / height;

      if (width > opts.maxWidth) {
        width = opts.maxWidth;
        height = width / aspectRatio;
      }

      if (height > opts.maxHeight) {
        height = opts.maxHeight;
        width = height * aspectRatio;
      }

      // 캔버스에 그리기
      canvas.width = Math.round(width);
      canvas.height = Math.round(height);

      // 고품질 리사이징
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      // Blob으로 변환
      const mimeType = `image/${opts.format}`;
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error('Failed to create blob'));
            return;
          }

          // 파일명 변경 (확장자 업데이트)
          const originalName = file.name.replace(/\.[^.]+$/, '');
          const newFileName = `${originalName}.${opts.format}`;

          const optimizedFile = new File([blob], newFileName, {
            type: mimeType,
            lastModified: Date.now(),
          });

          resolve(optimizedFile);
        },
        mimeType,
        opts.quality
      );
    };

    img.onerror = () => {
      reject(new Error('Failed to load image'));
    };

    // 이미지 로드
    img.src = URL.createObjectURL(file);
  });
}

/**
 * 파일 크기를 읽기 쉬운 형식으로 변환
 */
export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/**
 * 이미지 파일인지 확인
 */
export function isImageFile(file: File): boolean {
  return file.type.startsWith('image/');
}
