// Firestore Admin Notification Settings Service

import { logger } from './logger';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { getFirebaseFirestore } from './firebase';
import { withTimeout } from './utils';

const ADMIN_CONFIG_COLLECTION = 'admin-config';
const NOTIFICATION_SETTINGS_DOC = 'notification-settings';

export interface NotificationSettings {
  recipientEmails: string[];
  smtp: {
    host: string;
    port: number;
    user: string;
    from: string;
  };
}

const DEFAULT_NOTIFICATION_SETTINGS: NotificationSettings = {
  recipientEmails: [],
  smtp: {
    host: '',
    port: 587,
    user: '',
    from: '',
  },
};

export async function getNotificationSettings(): Promise<NotificationSettings> {
  try {
    const db = getFirebaseFirestore();
    const docRef = doc(db, ADMIN_CONFIG_COLLECTION, NOTIFICATION_SETTINGS_DOC);
    const docSnap = await withTimeout(getDoc(docRef), 5000);

    if (docSnap.exists()) {
      const data = docSnap.data();
      return {
        recipientEmails: data.recipientEmails || [],
        smtp: {
          host: data.smtp?.host || '',
          port: data.smtp?.port || 587,
          user: data.smtp?.user || '',
          from: data.smtp?.from || '',
        },
      };
    }
  } catch (error) {
    logger.warn('알림 설정 조회 실패, 기본값 사용:', error);
  }
  return DEFAULT_NOTIFICATION_SETTINGS;
}

export async function updateNotificationSettings(
  settings: NotificationSettings
): Promise<{ success: boolean; error?: string }> {
  try {
    const db = getFirebaseFirestore();
    const docRef = doc(db, ADMIN_CONFIG_COLLECTION, NOTIFICATION_SETTINGS_DOC);
    await setDoc(docRef, {
      ...settings,
      updatedAt: new Date().toISOString(),
    });
    return { success: true };
  } catch (error) {
    logger.error('알림 설정 저장 실패:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : '저장에 실패했습니다.',
    };
  }
}
