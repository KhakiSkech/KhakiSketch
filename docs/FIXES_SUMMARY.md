# 애니메이션 및 CSS 문제 해결 요약

## 해결된 문제 목록

### 1. Hydration Mismatch 문제 ⭐⭐⭐

#### 문제 상황
- 컴포넌트가 SSR에서 렌더링된 HTML과 CSR에서 React가 hydrate한 결과가 달라 경고 발생
- `suppressHydrationWarning`으로 임시 해결했지만 근본적 문제는 남아있었음

#### 해결 방법
```typescript
// 1. FloatingCTA.tsx
const [isMounted, setIsMounted] = useState(false);
useEffect(() => setIsMounted(true), []);
if (!isMounted) return null; // Hydration 전에는 렌더링하지 않음

// 2. Hero.tsx
const [isMounted, setIsMounted] = useState(false);
const getOrbTransform = (multiplier: number) => {
  if (!isMounted) return 'translate3d(0, 0, 0)'; // 정적 값 반환
  // ... 동적 계산
};

// 3. ProjectCard.tsx
const [isMounted, setIsMounted] = useState(false);
const cardStyle = isMounted ? { /* 동적 스타일 */ } : undefined;
```

### 2. 정의되지 않은 애니메이션 키프레임 ⭐⭐

#### 문제 상황
```css
/* globals.css - 문제 */
.problem-card:hover .problem-emoji {
  animation: wiggle 0.5s ease-in-out;  /* wiggle 정의 없음! */
}

.target-item:hover .target-check {
  animation: bounceIn 0.4s ease-out;   /* bounceIn 정의 없음! */
}
```

#### 해결 방법
```css
/* globals.css - 해결 */
@keyframes wiggle {
  0%, 100% { transform: rotate(0deg); }
  25% { transform: rotate(-5deg); }
  75% { transform: rotate(5deg); }
}

@keyframes bounceIn {
  0% { transform: scale(0.3); opacity: 0; }
  50% { transform: scale(1.05); }
  70% { transform: scale(0.9); }
  100% { transform: scale(1); opacity: 1; }
}

@keyframes slideDown {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}
```

### 3. Scroll Performance 문제 (Jank) ⭐⭐⭐

#### 문제 상황
- scroll/mousemove 이벤트 핸들러가 unthrottled로 동작
- 메인 스레드 블로킹으로 인한 애니메이션 끊김

#### 해결 방법
```typescript
// Header.tsx, FloatingCTA.tsx, Hero.tsx 등
const rafRef = useRef<number | null>(null);

const handleScroll = useCallback(() => {
  if (rafRef.current) return; // 이미 예약된 프레임이 있으면 무시
  
  rafRef.current = requestAnimationFrame(() => {
    setIsScrolled(window.scrollY > 10);
    rafRef.current = null;
  });
}, []);
```

### 4. Singleton Pattern 메모리 누수 ⭐⭐

#### 문제 상황
```typescript
// ScrollReveal.tsx - 문제
let sharedObserver: IntersectionObserver | null = null;  // 전역 변수
const observerCallbacks = new Map();  // 전역 Map
```

#### 해결 방법
```typescript
// 커스텀 훅 낸부에서 관리
const useSharedObserver = () => {
  const observerRef = useRef<IntersectionObserver | null>(null);
  const callbacksRef = useRef<Map<string, Function>>(new Map());
  
  // 컴포넌트별로 독립적인 인스턴스
  return { observe, unobserve };
};
```

### 5. Race Condition (타이머) ⭐

#### 문제 상황
- ScrollReveal의 delay 타이머가 컴포넌트 언마운트 후에도 실행될 수 있음

#### 해결 방법
```typescript
useEffect(() => {
  return () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };
}, []);
```

### 6. CSS 애니메이션 SSR 호환성 ⭐⭐⭐

#### 문제 상황
- `.animate-fade-in-up` 등이 `opacity: 0`으로 시작하여 SSR에서 콘텐츠 숨김

#### 해결 방법
```css
/* 기본값: 보이게 */
.animate-fade-in-up { opacity: 1; }

/* JS 활성화 후: 애니메이션 적용 */
.js-enabled .animate-fade-in-up {
  opacity: 0;
  animation: fadeInUp 0.8s forwards;
}
```

```html
<!-- layout.tsx -->
<script>
  document.body.classList.add('js-enabled');
</script>
```

## 변경된 파일 목록

| 파일 | 변경 내용 | 심각도 |
|-----|----------|--------|
| `app/globals.css` | 누락된 키프레임 추가, `.js-enabled` 패턴 적용 | ⭐⭐⭐ |
| `app/layout.tsx` | `suppressHydrationWarning` 추가, `js-enabled` 스크립트 | ⭐⭐⭐ |
| `components/ui/ScrollReveal.tsx` | Singleton 제거, useId 사용, RAF 적용 | ⭐⭐⭐ |
| `components/Hero.tsx` | `isMounted` 패턴 적용, RAF 적용 | ⭐⭐⭐ |
| `components/FloatingCTA.tsx` | `isMounted` 패턴 적용, RAF 적용 | ⭐⭐ |
| `components/Header.tsx` | RAF 적용 | ⭐⭐ |
| `components/Stats.tsx` | SSR-safe 카운트업 | ⭐⭐ |
| `components/ui/ProjectCard.tsx` | `isMounted` 패턴 적용 | ⭐⭐ |

## 향후 예방책

### 1. 컴포넌트 작성 시 체크리스트
```markdown
- [ ] `useEffect` 낸부에서 `setIsMounted(true)` 호출
- [ ] 동적 스타일은 `isMounted` 체크 후 적용
- [ ] 이벤트 핸들러는 RAF로 throttle
- [ ] `setTimeout`/`setInterval`은 cleanup에서 해제
- [ ] `useRef`로 DOM 요소 참조 시 null 체크
```

### 2. CSS 작성 시 체크리스트
```markdown
- [ ] 모든 `animation:` 속성에 대응하는 `@keyframes` 존재 확인
- [ ] SSR 시 콘텐츠가 보이는지 확인 (opacity: 0 금지)
- [ ] `prefers-reduced-motion` 미디어 쿼리 처리
```

### 3. 권장 도구
- **ESLint Plugin**: `react-hooks/exhaustive-deps`로 dependency 체크
- **TypeScript**: strict mode로 타입 안정성 확보
- **React DevTools Profiler**: 렌더링 성능 모니터링

## 테스트 방법

1. **Hydration 테스트**: 페이지 로드 후 개발자 도구에서 에러 확인
2. **성능 테스트**: Lighthouse에서 Animation 성능 점수 확인
3. **접근성 테스트**: `prefers-reduced-motion` 활성화 시 동작 확인
4. **모바일 테스트**: 터치 디바이스에서 애니메이션 부드러움 확인
