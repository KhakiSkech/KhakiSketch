import { describe, it, expect } from "vitest";
import {
  generateAdminNotificationHtml,
  LeadData,
} from "../notifications/email-templates";

const mockLead: LeadData = {
  id: "test-lead-123",
  customerName: "홍길동",
  email: "test@example.com",
  phone: "010-1234-5678",
  company: "테스트회사",
  projectType: "MVP",
  projectName: "테스트 프로젝트",
  projectSummary: "테스트 요약입니다.",
  budget: "1000_3000",
  timeline: "2-3months",
  priority: "MEDIUM",
  createdAt: "2026-01-15T09:00:00.000Z",
};

describe("generateAdminNotificationHtml", () => {
  it("고객 정보가 HTML에 포함된다", () => {
    const html = generateAdminNotificationHtml(mockLead, false);
    expect(html).toContain("홍길동");
    expect(html).toContain("test@example.com");
    expect(html).toContain("010-1234-5678");
    expect(html).toContain("테스트회사");
  });

  it("프로젝트 정보가 HTML에 포함된다", () => {
    const html = generateAdminNotificationHtml(mockLead, false);
    expect(html).toContain("MVP");
    expect(html).toContain("테스트 프로젝트");
    expect(html).toContain("1000_3000");
    expect(html).toContain("테스트 요약입니다.");
  });

  it("긴급 알림은 긴급 스타일링을 사용한다", () => {
    const html = generateAdminNotificationHtml(mockLead, true);
    expect(html).toContain("\u{1F6A8}");
    expect(html).toContain("#fee2e2");
    expect(html).toContain("#dc2626");
  });

  it("일반 알림은 기본 스타일링을 사용한다", () => {
    const html = generateAdminNotificationHtml(mockLead, false);
    expect(html).toContain("\u{1F4CB}");
    expect(html).toContain("#dbeafe");
    expect(html).toContain("#1d4ed8");
  });

  it("관리자 페이지 링크가 포함된다", () => {
    const html = generateAdminNotificationHtml(mockLead, false);
    expect(html).toContain("khakisketch.co.kr/admin/quotes/test-lead-123");
  });

  it("회사 미입력 시 '미입력' 표시", () => {
    const leadNoCompany = { ...mockLead, company: undefined };
    const html = generateAdminNotificationHtml(leadNoCompany, false);
    expect(html).toContain("미입력");
  });
});
