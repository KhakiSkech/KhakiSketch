# CRM 고도화 구현 계획

## 완료된 작업 ✅

### 1. 타입 확장 (types/admin.ts)
- ✅ LeadTodo - 할 일/리마인더
- ✅ QuoteEmail - 견적서 발송
- ✅ CustomerStats - 고객 통계

### 2. Firestore 서비스 (lib/firestore-quotes.ts)
- ✅ getLeadTodos / getAllTodos / getTodayTodos
- ✅ createTodo / updateTodo / completeTodo / deleteTodo
- ✅ getLeadQuoteEmails / createQuoteEmail / sendQuoteEmail
- ✅ getCustomerStats / getAllCustomerStats

## 구현이 필요한 UI 컴포넌트

### 1. 할 일 관리 (QuoteDetailClient에 추가)
```typescript
// components/crm/TodoList.tsx
- 할 일 목록 표시
- 추가/수정/삭제/완료
- 마감일 설정
- 우선순위 설정
```

### 2. 견적서 발송 (QuoteDetailClient에 추가)
```typescript
// components/crm/QuoteEmailList.tsx
- 견적서 목록
- 새 견적서 작성
- 이메일 템플릿
- PDF 미리보기
- 발송 상태 추적
```

### 3. 고객 통계 (QuoteDetailClient에 추가)
```typescript
// components/crm/CustomerStats.tsx
- 총 견적/계약 수
- 성공률
- 총 계약금액
- 과거 프로젝트 이력
```

### 4. 칸반 보드 (새 페이지)
```typescript
// app/admin/quotes/kanban/page.tsx
- 드래그 앤 드롭
- 상태별 컬럼
- 파이프라인 시각화
```

### 5. 대시보드 할 일 (app/admin/page.tsx)
```typescript
// components/crm/TodayTodos.tsx
- 오늘 마감 할 일
- 우선순위 표시
- 바로가기 링크
```

## 다음 단계

모든 기능을 한 번에 구현하려면 상당한 시간이 소요됩니다(4-6시간). 

**권장하는 접근 방식:**
1. **Phase 1**: 할 일 시스템 먼저 구현 (1-2시간)
2. **Phase 2**: 견적서 발송 기능 (2시간)
3. **Phase 3**: 칸반 보드 (1-2시간)
4. **Phase 4**: 고객 통계 및 통합 (1시간)

**또는**

특정 기능만 선택하여 구현:
- A. 할 일 + 대시보드 (가장 실용적)
- B. 견적서 발송 (가장 매출에 도움)
- C. 칸반 보드 (가장 시각적)

어떤 방식으로 진행할까요?
