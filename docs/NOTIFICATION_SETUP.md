# 알림 시스템 설정 가이드

## 📧 알림 종류

### 1. 고객 알림 (Customer Notifications)
- **견적 제출 확인**: 고객이 견적을 제출하면 즉시 확인 이메일 발송
- **목적**: 서비스 품질 제공, 투명한 소통

### 2. 관리자 알림 (Admin Notifications)
- **새 견적 접수**: 새로운 견적이 접수되면 관리자들에게 즉시 알림
- **긴급 견적**: 우선순위 HIGH/URGENT 견적은 별도 표시
- **목적**: 신속한 대응, 업무 효율화

---

## ⚙️ 설정 방법

### 1. EmailJS 설정 (필수)

#### 1.1 EmailJS 가입 및 템플릿 생성
1. https://www.emailjs.com/ 에 가입
2. Email Service 추가 (Gmail, Outlook 등)
3. Email Template 생성

#### 1.2 고객용 템플릿 (Template ID: template_customer)
```html
Subject: [KhakiSketch] 견적 요청이 접수되었습니다

안녕하세요, {{from_name}}님!

KhakiSketch에 견적을 요청해 주셔서 감사합니다.

[견적 내용]
• 프로젝트 유형: {{project_type}}
• 예산: {{budget}}
• 일정: {{timeline}}

검토 후 1-2영업일 내로 연락드리겠습니다.

문의사항이 있으시면 언제든 연락주세요.
감사합니다!

KhakiSketch 팀 드림
```

#### 1.3 관리자용 템플릿 (Template ID: template_admin)
```html
Subject: [새 견적 접수] {{customer_name}} - {{project_type}}

새로운 견적이 접수되었습니다.

[고객 정보]
• 이름: {{customer_name}}
• 이메일: {{customer_email}}
• 연락처: {{customer_phone}}
• 회사: {{company}}

[프로젝트 정보]
• 유형: {{project_type}}
• 예산: {{budget}}
• 일정: {{timeline}}
• 우선순위: {{priority}}

관리자 페이지에서 확인:
{{admin_link}}
```

#### 1.4 환경변수 설정
```env
# .env.local
NEXT_PUBLIC_EMAILJS_SERVICE_ID=your_service_id
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=your_customer_template_id
NEXT_PUBLIC_EMAILJS_ADMIN_TEMPLATE_ID=your_admin_template_id
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=your_public_key
```

---

### 2. Slack 알림 설정 (선택)

#### 2.1 Slack Webhook 생성
1. Slack 앱에서 Incoming Webhooks 활성화
2. Webhook URL 복사

#### 2.2 환경변수 설정
```env
NEXT_PUBLIC_SLACK_WEBHOOK_URL=https://hooks.slack.com/services/YOUR/WEBHOOK/URL
```

#### 2.3 Slack 메시지 예시
```
📋 새 견적 접수

고객: 홍길동
프로젝트: MVP 개발
예산: 1000-3000만원
우선순위: MEDIUM

[관리자 페이지에서 보기] (버튼)
```

---

### 3. 관리자 이메일 설정

```env
# 관리자 이메일 (쉼표로 구분)
NEXT_PUBLIC_ADMIN_EMAILS=admin@khakisketch.com,manager@khakisketch.com,sales@khakisketch.com
```

---

## 📊 알림 트리거

| 상황 | 고객 알림 | 관리자 알림 | Slack |
|------|-----------|-------------|-------|
| 견적 제출 | ✅ | ✅ | ✅ |
| 상태 변경 (CONTACTED) | ❌ | ❌ | ❌ |
| 상태 변경 (QUOTED) | ❌ | ❌ | ❌ |
| 긴급 견적 접수 | ✅ | ✅ (긴급) | ✅ |

---

## 🔧 테스트 방법

### 1. 로컬 테스트
```bash
# 개발 서버 실행
npm run dev

# 테스트 견적 제출
# - 이메일 발송 확인
# - Firestore 저장 확인
# - 알림 로그 확인 (브라우저 콘솔)
```

### 2. 이메일 발송 테스트
```javascript
// 브라우저 콘솔에서 테스트
import { sendNewLeadNotification } from '@/lib/notifications';

const testLead = {
  id: 'test-123',
  customerName: '테스트 고객',
  email: 'test@example.com',
  phone: '010-1234-5678',
  projectType: 'MVP 개발',
  budget: '1000-3000만원',
  timeline: '2-3개월',
  priority: 'MEDIUM',
  createdAt: new Date().toISOString(),
};

sendNewLeadNotification(testLead);
```

---

## 🚨 문제 해결

### 이메일이 발송되지 않음
```
[Notification] EmailJS config missing for admin notifications
```
→ 환경변수 확인: `NEXT_PUBLIC_EMAILJS_SERVICE_ID`, `NEXT_PUBLIC_EMAILJS_ADMIN_TEMPLATE_ID`, `NEXT_PUBLIC_EMAILJS_PUBLIC_KEY`

### 관리자 이메일이 없음
```
[Notification] No admin emails configured
```
→ `NEXT_PUBLIC_ADMIN_EMAILS` 환경변수 설정 확인

### Slack 알림 실패
```
[Notification] Failed to send Slack notification
```
→ Webhook URL 확인, Slack 채널 권한 확인

---

## 💡 팁

1. **EmailJS 묶음 제한**: 묶음 계정은 월 200통 제한이 있습니다. 프로덕션에서는 유료 계정 권장
2. **Slack 채널**: #sales, #quotes 등 별도 채널 생성 권장
3. **알림 과다 방지**: 긴급/높음 우선순위만 즉시 알림, 나머지는 일일 요약
