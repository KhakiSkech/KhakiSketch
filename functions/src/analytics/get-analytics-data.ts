// functions/src/analytics/get-analytics-data.ts
import { onCall, HttpsError } from "firebase-functions/v2/https";
import { defineSecret } from "firebase-functions/params";
import { logger } from "firebase-functions/v2";
import * as admin from "firebase-admin";
import { BetaAnalyticsDataClient } from "@google-analytics/data";

// Firebase 기본 서비스 계정 사용 (별도 키 불필요)
// GA4 속성에 Firebase 서비스 계정 이메일을 뷰어로 추가하면 됨
const ga4PropertyId = defineSecret("GA4_PROPERTY_ID");

const REGION = "asia-northeast3";
const CACHE_COLLECTION = "analytics-cache";
const CACHE_DOC = "daily";
const CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes

export interface DailyRow {
  date: string;
  sessions: number;
}

export interface TopPage {
  pagePath: string;
  views: number;
}

export interface TrafficSource {
  source: string;
  medium: string;
  sessions: number;
}

export interface AnalyticsData {
  activeUsers: number;
  weeklyDaily: DailyRow[];
  topPages: TopPage[];
  trafficSources: TrafficSource[];
  cachedAt: number;
  error?: string;
}

function requireAdmin(request: { auth?: { token: Record<string, unknown> } }): void {
  if (!request.auth) {
    throw new HttpsError("unauthenticated", "인증이 필요합니다.");
  }
  if (request.auth.token.admin !== true) {
    throw new HttpsError("permission-denied", "관리자 권한이 필요합니다.");
  }
}

async function fetchFromGA4(propertyId: string): Promise<AnalyticsData> {
  // Firebase 기본 Application Default Credentials 사용
  const analyticsClient = new BetaAnalyticsDataClient();
  const property = `properties/${propertyId}`;

  const [activeUsersResponse, weeklyResponse, topPagesResponse, sourcesResponse] =
    await Promise.all([
      analyticsClient.runRealtimeReport({
        property,
        metrics: [{ name: "activeUsers" }],
      }),
      analyticsClient.runReport({
        property,
        dateRanges: [{ startDate: "7daysAgo", endDate: "today" }],
        dimensions: [{ name: "date" }],
        metrics: [{ name: "sessions" }],
        orderBys: [{ dimension: { dimensionName: "date" } }],
      }),
      analyticsClient.runReport({
        property,
        dateRanges: [{ startDate: "7daysAgo", endDate: "today" }],
        dimensions: [{ name: "pagePath" }],
        metrics: [{ name: "screenPageViews" }],
        orderBys: [{ metric: { metricName: "screenPageViews" }, desc: true }],
        limit: 5,
      }),
      analyticsClient.runReport({
        property,
        dateRanges: [{ startDate: "7daysAgo", endDate: "today" }],
        dimensions: [
          { name: "sessionSource" },
          { name: "sessionMedium" },
        ],
        metrics: [{ name: "sessions" }],
        orderBys: [{ metric: { metricName: "sessions" }, desc: true }],
        limit: 20,
      }),
    ]);

  const activeUsers =
    Number(activeUsersResponse[0]?.rows?.[0]?.metricValues?.[0]?.value ?? 0);

  const weeklyDaily: DailyRow[] = (weeklyResponse[0]?.rows ?? []).map((row) => ({
    date: row.dimensionValues?.[0]?.value ?? "",
    sessions: Number(row.metricValues?.[0]?.value ?? 0),
  }));

  const topPages: TopPage[] = (topPagesResponse[0]?.rows ?? []).map((row) => ({
    pagePath: row.dimensionValues?.[0]?.value ?? "",
    views: Number(row.metricValues?.[0]?.value ?? 0),
  }));

  const trafficSources: TrafficSource[] = (sourcesResponse[0]?.rows ?? []).map((row) => ({
    source: row.dimensionValues?.[0]?.value ?? "",
    medium: row.dimensionValues?.[1]?.value ?? "",
    sessions: Number(row.metricValues?.[0]?.value ?? 0),
  }));

  return {
    activeUsers,
    weeklyDaily,
    topPages,
    trafficSources,
    cachedAt: Date.now(),
  };
}

export const getAnalyticsData = onCall(
  {
    region: REGION,
    secrets: [ga4PropertyId],
  },
  async (request): Promise<AnalyticsData> => {
    requireAdmin(request);

    const db = admin.firestore();
    const cacheRef = db.doc(`${CACHE_COLLECTION}/${CACHE_DOC}`);

    // Try cache first
    try {
      const cacheSnap = await cacheRef.get();
      if (cacheSnap.exists) {
        const cached = cacheSnap.data() as AnalyticsData;
        if (Date.now() - cached.cachedAt < CACHE_TTL_MS) {
          logger.info("Analytics cache hit");
          return cached;
        }
      }
    } catch (cacheErr) {
      logger.warn("Failed to read analytics cache:", cacheErr);
    }

    const propValue = ga4PropertyId.value();

    if (!propValue || propValue === "0") {
      return {
        activeUsers: 0,
        weeklyDaily: [],
        topPages: [],
        trafficSources: [],
        cachedAt: Date.now(),
        error: "GA4_PROPERTY_ID가 설정되지 않았습니다. Firebase Console → Analytics에서 속성 ID를 확인하세요.",
      };
    }

    try {
      const data = await fetchFromGA4(propValue);

      try {
        await cacheRef.set(data);
      } catch (writeErr) {
        logger.warn("Failed to write analytics cache:", writeErr);
      }

      return data;
    } catch (err) {
      logger.error("GA4 API error:", err);
      return {
        activeUsers: 0,
        weeklyDaily: [],
        topPages: [],
        trafficSources: [],
        cachedAt: Date.now(),
        error: "GA4 API 호출 실패. Firebase 서비스 계정에 GA4 뷰어 권한을 확인하세요.",
      };
    }
  }
);
