/**
 * GROOVY DESIGN SYSTEM (GDS: Sonic Aura)
 * TypeScript Design Tokens & Constants
 * Single source of truth for programmatic styling, canvas operations, and inline themes.
 */

export const GDS_COLORS = {
  // Canvas & Surfaces
  bgCanvas: '#0B0D13',
  bgSurface1: '#131620',
  bgSurface2: '#1B202D',
  bgSurface3: '#242A3A',
  bgSurfaceGlass: 'rgba(19, 22, 32, 0.78)',
  bgSurfaceGlassElevated: 'rgba(27, 32, 45, 0.88)',

  // Borders & Dividers
  borderSubtle: 'rgba(255, 255, 255, 0.08)',
  borderMedium: 'rgba(255, 255, 255, 0.16)',
  borderFocus: 'rgba(212, 255, 50, 0.45)',

  // Primary Electric Accents
  accentCitron: '#D4FF32',
  accentCitronHover: '#E2FF60',
  accentCitronGlow: 'rgba(212, 255, 50, 0.32)',
  accentCitronText: '#0B0D13', // High contrast ink for citron pills (14.8:1)

  // Secondary Analog Accents
  accentEmber: '#FF6B35', // Turntable amber, ratings, hot
  accentEmberGlow: 'rgba(255, 107, 53, 0.3)',
  accentCyan: '#00F0FF', // Acoustic waves & playback pulses
  accentIndigo: '#6366F1', // Scene spotlights

  // High-Contrast Porcelain Tokens (Curator Breaker Slabs)
  porcelainBg: '#F8FAFC',
  porcelainTextPrimary: '#090B10',
  porcelainTextMuted: '#64748B',
  porcelainBtnBg: '#090B10',
  porcelainBtnText: '#FFFFFF',

  // Typography Grayscale
  textPrimary: '#F8FAFC',
  textSecondary: '#94A3B8',
  textMuted: '#64748B',
  textDim: '#475569',
} as const;

export const GDS_SPACING = {
  space1: 4,
  space2: 8,
  space3: 12,
  space4: 16,
  space5: 20,
  space6: 24,
  space8: 32,
  space10: 40,
  space12: 48,
} as const;

export const GDS_RADII = {
  xs: 6,
  sm: 10,
  md: 14,
  lg: 18,
  xl: 24,
  pill: 9999,
} as const;

export const GDS_SHADOWS = {
  sm: '0 2px 8px rgba(0, 0, 0, 0.35)',
  md: '0 8px 24px -4px rgba(0, 0, 0, 0.55)',
  porcelain: '0 16px 36px -6px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.1)',
  glowCitronSm: '0 2px 14px rgba(212, 255, 50, 0.32)',
  glowCitronLg: '0 6px 30px rgba(212, 255, 50, 0.45)',
  glowEmberSm: '0 2px 14px rgba(255, 107, 53, 0.3)',
} as const;

export const GDS_TYPOGRAPHY = {
  fontSans: "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  fontDisplay: "'Plus Jakarta Sans', sans-serif",
  trackingTight: '-0.035em',
  trackingNormal: '-0.01em',
  trackingWide: '0.06em',
} as const;

export const GDS_TRANSITIONS = {
  fast: '160ms cubic-bezier(0.16, 1, 0.3, 1)',
  bounce: '260ms cubic-bezier(0.34, 1.56, 0.64, 1)',
} as const;

export type GDSColorKey = keyof typeof GDS_COLORS;
export type GDSSpacingKey = keyof typeof GDS_SPACING;
export type GDSRadiusKey = keyof typeof GDS_RADII;
