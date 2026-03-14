/**
 * Global animation configuration for KhakiSketch
 * This ensures consistency across all components and platforms.
 */

export const ANIMATION = {
    // Common durations (in seconds for Framer Motion)
    duration: {
        fast: 0.3,
        normal: 0.7,
        slow: 1.0,
    },

    // Custom easing function (smooth cubic-bezier)
    easing: [0.22, 1, 0.36, 1], // Equivalent to custom-bezier(0.22, 1, 0.36, 1)

    // Reveal animation defaults
    reveal: {
        distance: 40,
        threshold: 0.1,
        stagger: 0.15,
    },

    // Transition variants for Framer Motion
    variants: {
        fadeInUp: {
            initial: { opacity: 0, y: 30 },
            animate: { opacity: 1, y: 0 },
        },
        fadeInLeft: {
            initial: { opacity: 0, x: -30 },
            animate: { opacity: 1, x: 0 },
        },
        fadeInRight: {
            initial: { opacity: 0, x: 30 },
            animate: { opacity: 1, x: 0 },
        },
        scaleIn: {
            initial: { opacity: 0, scale: 0.95 },
            animate: { opacity: 1, scale: 1 },
        }
    },

    // Scroll-driven animation defaults
    scroll: {
        textReveal: {
            mutedOpacity: 0.15,
            activeOpacity: 1,
        },
        spring: {
            stiffness: 100,
            damping: 30,
            restDelta: 0.001,
        },
        sticky: {
            defaultHeight: 2,
        },
    },
} as const;
