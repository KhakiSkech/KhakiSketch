// Animation utilities for brochure pages
// Uses CSS animations for better performance

export const fadeInUp = {
  initial: { opacity: 0, transform: 'translateY(20px)' },
  animate: { opacity: 1, transform: 'translateY(0)' },
  transition: 'all 0.6s ease-out',
};

export const fadeInLeft = {
  initial: { opacity: 0, transform: 'translateX(-20px)' },
  animate: { opacity: 1, transform: 'translateX(0)' },
  transition: 'all 0.6s ease-out',
};

export const fadeInRight = {
  initial: { opacity: 0, transform: 'translateX(20px)' },
  animate: { opacity: 1, transform: 'translateX(0)' },
  transition: 'all 0.6s ease-out',
};

export const scaleIn = {
  initial: { opacity: 0, transform: 'scale(0.95)' },
  animate: { opacity: 1, transform: 'scale(1)' },
  transition: 'all 0.5s ease-out',
};

export const staggerDelay = (index: number, baseDelay: number = 0.1) => ({
  transitionDelay: `${index * baseDelay}s`,
});

// CSS classes for animations
export const animationStyles = `
  /* Base animation classes */
  .animate-fade-in-up {
    animation: fadeInUp 0.6s ease-out forwards;
    opacity: 0;
  }

  .animate-fade-in-left {
    animation: fadeInLeft 0.6s ease-out forwards;
    opacity: 0;
  }

  .animate-fade-in-right {
    animation: fadeInRight 0.6s ease-out forwards;
    opacity: 0;
  }

  .animate-scale-in {
    animation: scaleIn 0.5s ease-out forwards;
    opacity: 0;
  }

  .animate-fade-in {
    animation: fadeIn 0.5s ease-out forwards;
    opacity: 0;
  }

  /* Stagger delays */
  .delay-100 { animation-delay: 0.1s; }
  .delay-200 { animation-delay: 0.2s; }
  .delay-300 { animation-delay: 0.3s; }
  .delay-400 { animation-delay: 0.4s; }
  .delay-500 { animation-delay: 0.5s; }
  .delay-600 { animation-delay: 0.6s; }
  .delay-700 { animation-delay: 0.7s; }
  .delay-800 { animation-delay: 0.8s; }

  /* Keyframes */
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes fadeInLeft {
    from {
      opacity: 0;
      transform: translateX(-20px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }

  @keyframes fadeInRight {
    from {
      opacity: 0;
      transform: translateX(20px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }

  @keyframes scaleIn {
    from {
      opacity: 0;
      transform: scale(0.95);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  /* Intersection Observer trigger class */
  .animate-on-scroll {
    opacity: 0;
  }

  .animate-on-scroll.is-visible {
    animation: fadeInUp 0.6s ease-out forwards;
  }

  /* Print styles - disable animations */
  @media print {
    .animate-fade-in-up,
    .animate-fade-in-left,
    .animate-fade-in-right,
    .animate-scale-in,
    .animate-fade-in,
    .animate-on-scroll {
      animation: none !important;
      opacity: 1 !important;
      transform: none !important;
    }
  }
`;
