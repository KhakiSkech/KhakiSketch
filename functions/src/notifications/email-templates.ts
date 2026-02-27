/**
 * 관리자 알림 이메일 HTML 템플릿
 * lib/notifications.ts에서 이식 (서버사이드 전용)
 */

export interface LeadData {
  id: string;
  customerName: string;
  email: string;
  phone: string;
  company?: string;
  projectType: string;
  projectName?: string;
  projectSummary?: string;
  budget: string;
  timeline: string;
  priority: string;
  createdAt: any; // string | Firestore Timestamp
}

const APP_URL = "https://khakisketch.co.kr";

function formatDate(value: any): string {
  if (!value) return new Date().toLocaleString("ko-KR");
  if (typeof value === "string") return new Date(value).toLocaleString("ko-KR");
  if (typeof value?.toDate === "function")
    return value.toDate().toLocaleString("ko-KR");
  return new Date().toLocaleString("ko-KR");
}

export function generateAdminNotificationHtml(
  lead: LeadData,
  isUrgent: boolean
): string {
  const priorityEmoji = isUrgent ? "\u{1F6A8}" : "\u{1F4CB}";
  const priorityClass = isUrgent
    ? "background: #fee2e2; color: #dc2626;"
    : "background: #dbeafe; color: #1d4ed8;";

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>새 견적 접수 알림</title>
  <style>
    body { font-family: 'Pretendard', -apple-system, BlinkMacSystemFont, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: #263122; color: white; padding: 20px; border-radius: 8px 8px 0 0; text-align: center; }
    .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
    .priority-badge { display: inline-block; padding: 8px 16px; border-radius: 20px; font-weight: bold; font-size: 14px; ${priorityClass} }
    .info-section { background: white; padding: 20px; margin: 20px 0; border-radius: 8px; border-left: 4px solid #749965; }
    .info-row { margin: 10px 0; }
    .label { font-weight: bold; color: #263122; }
    .button { display: inline-block; background: #749965; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin-top: 20px; }
    .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>${priorityEmoji} Khaki Sketch 알림</h1>
      <p>새로운 견적이 접수되었습니다</p>
    </div>

    <div class="content">
      <div style="text-align: center; margin-bottom: 20px;">
        <span class="priority-badge">우선순위: ${lead.priority}</span>
      </div>

      <div class="info-section">
        <h3 style="margin-top: 0; color: #263122;">고객 정보</h3>
        <div class="info-row"><span class="label">이름:</span> ${lead.customerName}</div>
        <div class="info-row"><span class="label">이메일:</span> ${lead.email}</div>
        <div class="info-row"><span class="label">연락처:</span> ${lead.phone}</div>
        <div class="info-row"><span class="label">회사:</span> ${lead.company || "미입력"}</div>
      </div>

      <div class="info-section">
        <h3 style="margin-top: 0; color: #263122;">프로젝트 정보</h3>
        <div class="info-row"><span class="label">유형:</span> ${lead.projectType}</div>
        <div class="info-row"><span class="label">프로젝트명:</span> ${lead.projectName || lead.projectType}</div>
        <div class="info-row"><span class="label">예산:</span> ${lead.budget}</div>
        <div class="info-row"><span class="label">일정:</span> ${lead.timeline}</div>
      </div>

      <div class="info-section">
        <h3 style="margin-top: 0; color: #263122;">요약</h3>
        <p style="white-space: pre-wrap;">${lead.projectSummary || "요약 없음"}</p>
      </div>

      <div style="text-align: center;">
        <a href="${APP_URL}/admin/quotes/${lead.id}" class="button">
          관리자 페이지에서 확인하기
        </a>
      </div>

      <div class="footer">
        <p>접수 시간: ${formatDate(lead.createdAt)}</p>
        <p>&copy; 2024 Khaki Sketch. All rights reserved.</p>
      </div>
    </div>
  </div>
</body>
</html>`;
}
