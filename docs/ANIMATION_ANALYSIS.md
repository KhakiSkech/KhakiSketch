# 애니메이션 아키텍처 심층 분석 및 개선 보고서

## 1. 발견된 근본적인 문제들

### 1.1 아키텍처 레벨 문제

#### A. 이중 애니메이션 시스템 (CSS + React)
```
현재 구조:
├── CSS 애니메이션 (.animate-fade-in-up)
│   └── 페이지 로드 시 1회 실행
│   └── js-enabled 클래스로 제어
│
└── React 애니메이션 (ScrollReveal)
    └── 스크롤 시 IntersectionObserver로 실행
    └── inline style로 제어
```

**문제점:**
- 두 시스템이 서로 다른 타이밍에 동작
- CSS는 mount 시, React는 observe 후
- 상태 불일치로 인한 시각적 깜빡임

#### B. Hydration Mismatch 위험
```javascript
// ScrollReveal.tsx - 문제 코드
const [isRevealed, setIsRevealed] = useState(true);  // SSR: true
const [shouldAnimate, setShouldAnimate] = useState(false);  // SSR: false

useEffect(() => {
    setShouldAnimate(true);  // CSR: true
    setIsRevealed(false);    // CSR: false (상태 불일치!)
}, []);
```

**문제점:**
- SSR과 CSR의 초기 상태 불일치
- React 18의 Strict Mode에서 이중 실행 시 문제
- Hydration 후 상태 변경으로 인한 리렌더링

#### C. 전역 상태 오염 (Singleton Pattern)
```javascript
// ScrollReveal.tsx
let sharedObserver: IntersectionObserver | null = null;  // 전역 변수
const observerCallbacks = new Map();  // 전역 Map
```

**문제점:**
- HMR(Hot Module Replacement) 시 이전 상태 유지
- 테스트 환경에서 상태 공유로 인한 flaky test
- 메모리 누수 가능성

### 1.2 구현 레벨 문제

#### A. race condition
```javascript
const handleVisibility = useCallback((visible: boolean) => {
    if (delay > 0) {
        timeoutRef.current = setTimeout(() => setIsRevealed(true), delay);
    } else {
        setIsRevealed(true);
    }
}, [delay]);
```

- 타이머와 observer 콜백의 race condition
- 컴포넌트 언마운트 후에도 타이머가 실행될 수 있음

#### B. CSS 우선순위 혼란
```css
/* globals.css */
.animate-fade-in-up { opacity: 1; }  /* 기본 */
.js-enabled .animate-fade-in-up { opacity: 0; }  /* JS 활성화 시 */
```

- 클래스 기반 상태 관리의 복잡성
- CSS specificity 전쟁

---

## 2. 근본적인 해결책: 단일 책임 원칙 적용

### 2.1 권장 아키텍처: "애니메이션 전용 레이어"

```
제안된 구조:
┌─────────────────────────────────────┐
│         AnimationProvider           │
│  (전역 애니메이션 설정 & 상태 관리)    │
└─────────────────────────────────────┘
                  │
      ┌───────────┼───────────┐
      ▼           ▼           ▼
┌─────────┐ ┌─────────┐ ┌─────────┐
│  Page   │ │ Scroll  │ │  Hover  │
│  Load   │ │ Reveal  │ │ Effects │
│  Anims  │ │  Anims  │ │  Anims  │
└─────────┘ └─────────┘ └─────────┘
```

### 2.2 단일 출처 원칙 (Single Source of Truth)

```typescript
// lib/animation-config.ts
export const AnimationConfig = {
  // 모든 애니메이션 설정을 한 곳에서 관리
  pageLoad: {
    duration: 800,
    easing: [0.22, 1, 0.36, 1],
    staggerDelay: 150,
  },
  scrollReveal: {
    duration: 700,
    easing: [0.22, 1, 0.36, 1],
    threshold: 0.1,
    rootMargin: '-50px',
  },
  hover: {
    duration: 300,
    easing: [0.16, 1, 0.3, 1],
  }
} as const;
```

---

## 3. 구체적인 해결 방안

### 3.1 CSS-in-JS 방식 도입 (권장)

```typescript
// components/animation/AnimatedSection.tsx
'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

interface AnimatedSectionProps {
  children: React.ReactNode;
  delay?: number;
  direction?: 'up' | 'left' | 'right' | 'scale';
}

export function AnimatedSection({ 
  children, 
  delay = 0, 
  direction = 'up' 
}: AnimatedSectionProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });
  
  const variants = {
    hidden: {
      opacity: 0,
      y: direction === 'up' ? 40 : 0,
      x: direction === 'left' ? -40 : direction === 'right' ? 40 : 0,
      scale: direction === 'scale' ? 0.92 : 1,
    },
    visible: {
      opacity: 1,
      y: 0,
      x: 0,
      scale: 1,
      transition: {
        duration: 0.7,
        delay: delay / 1000,
        ease: [0.22, 1, 0.36, 1],
      }
    }
  };

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={variants}
    >
      {children}
    </motion.div>
  );
}
```

**장점:**
- 선언적 API
- 자동 최적화 (GPU 가속)
- SSR 호환성
- 제스처 지원

### 3.2 CSS 변수 기반 접근법 (대안)

```css
/* globals.css - 개선 버전 */
:root {
  --anim-duration-fast: 0.3s;
  --anim-duration-normal: 0.7s;
  --anim-duration-slow: 1s;
  --anim-easing-smooth: cubic-bezier(0.22, 1, 0.36, 1);
}

/* 모든 애니메이션을 CSS 변수로 제어 */
.reveal-animation {
  --reveal-delay: 0ms;
  --reveal-duration: 700ms;
  
  opacity: 0;
  transform: translateY(40px);
  transition: 
    opacity var(--reveal-duration) var(--anim-easing-smooth) var(--reveal-delay),
    transform var(--reveal-duration) var(--anim-easing-smooth) var(--reveal-delay);
}

.reveal-animation.is-visible {
  opacity: 1;
  transform: translateY(0);
}
```

```typescript
// hooks/useScrollReveal.ts - 개선 버전
export function useScrollReveal(delay = 0) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    
    // CSS 변수로 delay 설정
    element.style.setProperty('--reveal-delay', `${delay}ms`);
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: '-50px' }
    );
    
    observer.observe(element);
    return () => observer.disconnect();
  }, [delay]);
  
  return { ref, isVisible };
}
```

---

## 4. 예방적 설계 패턴

### 4.1 점진적 향상 (Progressive Enhancement)

```typescript
// 전략: 기본 콘텐츠는 항상 표시, 애니메이션은 보너스

// ❌ 잘못된 방식
<div className="opacity-0 animate-fade-in">
  콘텐츠
</div>

// ✅ 올바른 방식
<div className="reveal-base reveal-animated">
  콘텐츠
</div>

/* CSS */
.reveal-base {
  opacity: 1;  /* 기본: 항상 표시 */
}

@supports (animation-timeline: view()) {
  .reveal-animated {
    animation: reveal linear both;
    animation-timeline: view();
    animation-range: entry 25% cover 50%;
  }
}
```

### 4.2 Prefers-Reduced-Motion 존중

```typescript
// hooks/useAnimation.ts
export function useAnimation() {
  const prefersReducedMotion = useReducedMotion();
  
  return {
    shouldAnimate: !prefersReducedMotion,
    duration: prefersReducedMotion ? 0 : 0.7,
    easing: [0.22, 1, 0.36, 1],
  };
}
```

### 4.3 성능 예산 (Performance Budget)

```typescript
// lib/performance.ts
const ANIMATION_BUDGET = {
  maxSimultaneous: 5,  // 동시 실행 애니메이션 제한
  maxDuration: 1000,   // 최대 지속 시간 (ms)
  throttleDelay: 100,  // 스크롤 이벤트 쓰로틀
};

export function useThrottledAnimation(callback: () => void) {
  const throttled = useMemo(
    () => throttle(callback, ANIMATION_BUDGET.throttleDelay),
    [callback]
  );
  return throttled;
}
```

---

## 5. 체크리스트 및 모니터링

### 5.1 코드 리뷰 체크리스트

- [ ] 모든 애니메이션은 `prefers-reduced-motion`을 존중하는가?
- [ ] SSR 시 콘텐츠가 보이는가 (opacity: 0 금지)?
- [ ] 애니메이션에 will-change를 사용하고 제거하는가?
- [ ] requestAnimationFrame을 사용하는가?
- [ ] 메모리 누수가 없는가 (cleanup)?

### 5.2 성능 모니터링

```typescript
// 개발 환경에서 애니메이션 성능 모니터링
if (process.env.NODE_ENV === 'development') {
  const observer = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      if (entry.duration > 16.67) {  // 60fps 기준
        console.warn(`Slow animation frame: ${entry.duration}ms`);
      }
    }
  });
  observer.observe({ entryTypes: ['measure', 'longtask'] });
}
```

---

## 6. 권장 라이브러리

| 라이브러리 | 사용처 | 장점 |
|-----------|--------|------|
| **Framer Motion** | 복잡한 인터랙션 | 선언적 API, 제스처, 레이아웃 애니메이션 |
| **GSAP** | 타임라인 애니메이션 | 정밀한 컨트롤, ScrollTrigger |
| **CSS Animations** | 단순 효과 | Zero JS, 최고의 성능 |

---

## 7. 결론

### 현재 해결된 부분
✅ SSR/CSR 상태 불일치 해결 (suppressHydrationWarning)  
✅ CSS 애니메이션의 visibility 기본값 변경  
✅ z-index 문제 해결  
✅ FOUT 문제 개선  

### 남은 기술 부채
⚠️ 이중 애니메이션 시스템 (CSS + React)  
⚠️ 전역 상태 (Singleton) 사용  
⚠️ 복잡한 상태 관리 로직  

### 궁극적 해결책
**Framer Motion 도입** 또는 **CSS 변수 기반 단일 시스템**으로 마이그레이션 권장
