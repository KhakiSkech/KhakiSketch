// functions/src/billing/templates.ts

interface TemplateVars {
  contactName: string;
  projectName: string;
  totalAmount: string; // 포맷된 금액 (예: "80,000")
  billingDate: string; // "3월 5일"
  month: string; // "3"
  bankInfo: string; // "기업은행 xxx-xxx (송재찬)"
  taxEmail: string;
  contactPhone: string;
  terminationDate?: string;
  overdueList?: string;
  date?: string;
  paidCount?: string;
  paidAmount?: string;
  overdueCount?: string;
  overdueAmount?: string;
}

function fillTemplate(template: string, vars: TemplateVars): string {
  return Object.entries(vars).reduce(
    (msg, [key, value]) => msg.replaceAll(`{${key}}`, value ?? ""),
    template
  );
}

const TEMPLATES = {
  pre_reminder: `[카키스케치] {contactName}님, {projectName} 운영관리비 {totalAmount}원이 {billingDate}에 등록 계좌에서 자동 출금됩니다.
서비스 변경/해지: {contactPhone}`,

  billing_success: `[카키스케치] {projectName} {month}월 운영관리비 {totalAmount}원 정상 출금. 세금계산서가 {taxEmail}로 발송됩니다.`,

  billing_failed: `[카키스케치] {contactName}님, {projectName} {month}월 운영관리비 {totalAmount}원 출금이 실패했습니다. 계좌 잔액을 확인해주세요. 3일 후 재출금됩니다.
문의: {contactPhone}`,

  overdue_1st: `[카키스케치] {contactName}님, {projectName} 운영관리비가 미납 상태입니다. 계좌 잔액 확인 후 자동 출금이 재시도됩니다.
문의: {contactPhone}`,

  overdue_2nd: `[카키스케치] {contactName}님, {projectName} 운영관리비 미납이 지속되고 있습니다. 빠른 확인 부탁드립니다. 서비스 유지에 영향이 있을 수 있습니다.
문의: {contactPhone}`,

  overdue_severe: `[카키스케치] {contactName}님, {projectName} 운영관리비가 7일 이상 미납 상태입니다. 조속한 확인 부탁드립니다.
문의: {contactPhone}`,

  termination_scheduled: `[카키스케치] {contactName}님, {projectName} 서비스 해지가 접수되었습니다. {terminationDate}부로 운영관리가 종료됩니다. 철회 시 연락 부탁드립니다.
{contactPhone}`,

  termination_complete: `[카키스케치] {contactName}님, {projectName} 서비스가 종료되었습니다. 재이용을 원하시면 언제든 연락해주세요. {contactPhone}`,

  admin_daily_summary: `[KSI] {date} 수금 {paidCount}건 {paidAmount}원 / 미납 {overdueCount}건 {overdueAmount}원
{overdueList}`,

  manual_transfer_guide: `[카키스케치] {contactName}님, {projectName} {month}월 운영관리비 {totalAmount}원 입금 안내입니다.
입금계좌: {bankInfo}
문의: {contactPhone}`,
} as const;

export type TemplateKey = keyof typeof TEMPLATES;

export function renderMessage(key: TemplateKey, vars: TemplateVars): string {
  return fillTemplate(TEMPLATES[key], vars);
}

export function formatAmount(amount: number): string {
  return amount.toLocaleString("ko-KR");
}
