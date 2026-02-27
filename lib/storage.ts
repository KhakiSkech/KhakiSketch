import { logger } from './logger';
import {
  ref,
  uploadBytes,
  getDownloadURL,
  listAll,
  deleteObject,
  UploadMetadata,
} from 'firebase/storage';
import { getFirebaseStorage } from './firebase';

export type ImageCategory = 'portfolio' | 'blog' | 'site';

export interface StorageImage {
  name: string;
  fullPath: string;
  url: string;
  category: ImageCategory;
  subPath: string;
}

/**
 * Firebase Storage에 이미지 업로드
 */
export async function uploadImage(
  file: File,
  category: ImageCategory,
  subPath?: string
): Promise<string> {
  const storage = getFirebaseStorage();

  const timestamp = Date.now();
  const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
  const fileName = `${timestamp}-${safeName}`;

  const pathParts = ['images', category];
  if (subPath) {
    pathParts.push(subPath);
  }
  pathParts.push(fileName);

  const path = pathParts.join('/');
  const storageRef = ref(storage, path);

  const metadata: UploadMetadata = {
    contentType: file.type,
    customMetadata: {
      originalName: file.name,
      uploadedAt: new Date().toISOString(),
    },
  };

  await uploadBytes(storageRef, file, metadata);
  return getDownloadURL(storageRef);
}

/**
 * 모든 카테고리의 이미지 목록 조회 (재귀적)
 */
export async function listAllImages(): Promise<StorageImage[]> {
  const storage = getFirebaseStorage();
  const rootRef = ref(storage, 'images');

  const images: StorageImage[] = [];

  async function listRecursive(folderRef: ReturnType<typeof ref>): Promise<void> {
    const result = await listAll(folderRef);

    for (const itemRef of result.items) {
      const url = await getDownloadURL(itemRef);
      const pathParts = itemRef.fullPath.split('/');
      const category = pathParts[1] as ImageCategory;
      const subPath = pathParts.slice(2, -1).join('/');

      images.push({
        name: itemRef.name,
        fullPath: itemRef.fullPath,
        url,
        category,
        subPath,
      });
    }

    for (const folderItem of result.prefixes) {
      await listRecursive(folderItem);
    }
  }

  try {
    await listRecursive(rootRef);
    return images.sort((a, b) => b.name.localeCompare(a.name));
  } catch (error) {
    logger.error('전체 이미지 목록 조회 실패:', error);
    return [];
  }
}

/**
 * 이미지 URL 생성 (기존 경로에서)
 */
export async function getImageUrl(fullPath: string): Promise<string> {
  const storage = getFirebaseStorage();
  const imageRef = ref(storage, fullPath);
  return getDownloadURL(imageRef);
}
