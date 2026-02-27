// =============================================
// KhakiSketch Brochure Design System
// =============================================

// Color Palette
export const colors = {
  // Brand Colors
  brand: {
    primary: '#749965',      // Main green
    dark: '#263122',         // Dark green (backgrounds)
    medium: '#4a5d44',       // Medium green
    light: '#e8f0e5',        // Light green tint
  },

  // Neutral Colors
  neutral: {
    white: '#ffffff',
    offWhite: '#FAF9F6',     // Light background
    gray100: '#f5f5f5',
    gray200: '#e5e5e5',
    gray300: '#d4d4d4',
    gray400: '#a3a3a3',
    gray500: '#737373',
    gray600: '#525252',
    gray700: '#404040',
    gray800: '#262626',
    black: '#171717',
  },

  // Semantic Colors
  semantic: {
    error: '#ef4444',
    errorLight: 'rgba(239, 68, 68, 0.1)',
    success: '#22c55e',
    warning: '#f59e0b',
  },

  // Text Colors
  text: {
    primary: '#263122',
    secondary: '#525252',
    tertiary: '#737373',
    muted: '#a3a3a3',
    inverse: '#ffffff',
    inverseSecondary: 'rgba(255, 255, 255, 0.7)',
    inverseMuted: 'rgba(255, 255, 255, 0.4)',
  },
} as const;

// Typography Scale (using rem for consistency)
export const typography = {
  // Font Family
  fontFamily: {
    sans: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    mono: 'ui-monospace, SFMono-Regular, "SF Mono", Consolas, monospace',
  },

  // Font Sizes (16:9 Landscape optimized)
  sizes: {
    display: { fontSize: '52px', lineHeight: 1.1, fontWeight: 700 },
    h1: { fontSize: '40px', lineHeight: 1.2, fontWeight: 700 },
    h2: { fontSize: '32px', lineHeight: 1.25, fontWeight: 700 },
    h3: { fontSize: '20px', lineHeight: 1.35, fontWeight: 600 },
    h4: { fontSize: '16px', lineHeight: 1.4, fontWeight: 600 },
    body: { fontSize: '15px', lineHeight: 1.6, fontWeight: 400 },
    bodySmall: { fontSize: '14px', lineHeight: 1.5, fontWeight: 400 },
    caption: { fontSize: '12px', lineHeight: 1.4, fontWeight: 400 },
    label: { fontSize: '11px', lineHeight: 1.3, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' as const },
  },
} as const;

// Spacing Scale (4px base)
export const spacing = {
  0: '0px',
  1: '4px',
  2: '8px',
  3: '12px',
  4: '16px',
  5: '20px',
  6: '24px',
  7: '28px',
  8: '32px',
  10: '40px',
  12: '48px',
  14: '56px',
  16: '64px',
  20: '80px',
} as const;

// Border Radius
export const borderRadius = {
  none: '0px',
  sm: '4px',
  md: '8px',
  lg: '12px',
  xl: '16px',
  '2xl': '20px',
  '3xl': '24px',
  full: '9999px',
} as const;

// Shadows
export const shadows = {
  none: 'none',
  sm: '0 1px 2px rgba(0, 0, 0, 0.05)',
  md: '0 2px 8px rgba(0, 0, 0, 0.06)',
  lg: '0 4px 16px rgba(0, 0, 0, 0.08)',
  xl: '0 8px 24px rgba(0, 0, 0, 0.1)',
  card: '0 2px 12px rgba(0, 0, 0, 0.04)',
  cardHover: '0 4px 20px rgba(0, 0, 0, 0.08)',
} as const;

// Common Component Styles
export const componentStyles = {
  // Section Label (e.g., "THE PROBLEM", "SERVICES")
  sectionLabel: {
    color: colors.brand.primary,
    fontWeight: 700,
    letterSpacing: '0.08em',
    textTransform: 'uppercase' as const,
  },

  // Card Styles
  card: {
    base: {
      backgroundColor: colors.neutral.offWhite,
      borderRadius: borderRadius.xl,
      boxShadow: shadows.card,
    },
    white: {
      backgroundColor: colors.neutral.white,
      borderRadius: borderRadius.xl,
      boxShadow: shadows.md,
    },
    brand: {
      backgroundColor: colors.brand.dark,
      borderRadius: borderRadius.xl,
      color: colors.neutral.white,
    },
  },

  // Icon Container
  iconContainer: {
    small: { width: '36px', height: '36px', borderRadius: borderRadius.lg },
    medium: { width: '44px', height: '44px', borderRadius: borderRadius.lg },
    large: { width: '56px', height: '56px', borderRadius: borderRadius.xl },
  },

  // Tag/Badge
  tag: {
    base: {
      display: 'inline-flex',
      alignItems: 'center',
      paddingLeft: spacing[4],
      paddingRight: spacing[4],
      paddingTop: spacing[2],
      paddingBottom: spacing[2],
      borderRadius: borderRadius.full,
      fontSize: '12px',
      fontWeight: 500,
    },
  },

  // Quote Block
  quoteBlock: {
    backgroundColor: colors.neutral.offWhite,
    borderLeft: `4px solid ${colors.semantic.error}30`,
    borderRadius: `0 ${borderRadius.lg} ${borderRadius.lg} 0`,
    padding: `${spacing[3]} ${spacing[4]}`,
  },

  // Stat Box
  statBox: {
    textAlign: 'center' as const,
    padding: spacing[4],
    borderRadius: borderRadius.lg,
    backgroundColor: colors.neutral.white,
    border: `1px solid ${colors.neutral.gray200}`,
  },
} as const;

// Page Layout Constants (16:9 Landscape)
export const pageLayout = {
  width: '1280px',
  height: '720px',
  padding: '48px 64px',
  contentMaxWidth: '1152px',
} as const;

// Animation/Transition (for potential future use)
export const transitions = {
  fast: '150ms ease',
  normal: '250ms ease',
  slow: '350ms ease',
} as const;

// Helper function to get typography styles as CSS properties
export function getTypographyCSS(
  variant: keyof typeof typography.sizes
): React.CSSProperties {
  const styles = typography.sizes[variant];
  return {
    fontSize: styles.fontSize,
    lineHeight: styles.lineHeight,
    fontWeight: styles.fontWeight,
    ...(('letterSpacing' in styles) && { letterSpacing: styles.letterSpacing }),
    ...(('textTransform' in styles) && { textTransform: styles.textTransform }),
  };
}

// Export a merged design system object for convenience
export const designSystem = {
  colors,
  typography,
  spacing,
  borderRadius,
  shadows,
  componentStyles,
  pageLayout,
  transitions,
  getTypographyCSS,
} as const;

export default designSystem;
