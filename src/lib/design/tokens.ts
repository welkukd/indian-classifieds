// Design Tokens - DesiList Design System
// Single source of truth for all design decisions

export const tokens = {
  // Color System
  color: {
    // Brand
    brand: {
      50: '#fffbeb',
      100: '#fef3c7',
      200: '#fde68a',
      300: '#fcd34d',
      400: '#fbbf24',
      500: '#f59e0b',  // Primary
      600: '#d97706',
      700: '#b45309',
      800: '#92400e',
      900: '#78350f',
      950: '#451a03',
    },
    // Semantic
    success: {
      50: '#f0fdf4',
      100: '#dcfce7',
      500: '#22c55e',
      600: '#16a34a',
      700: '#15803d',
    },
    error: {
      50: '#fef2f2',
      100: '#fee2e2',
      500: '#ef4444',
      600: '#dc2626',
      700: '#b91c1c',
    },
    warning: {
      50: '#fffbeb',
      100: '#fef3c7',
      500: '#f59e0b',
      600: '#d97706',
    },
    info: {
      50: '#eff6ff',
      100: '#dbeafe',
      500: '#3b82f6',
      600: '#2563eb',
    },

    // Neutral (Gray scale with warm undertone)
    neutral: {
      0: '#ffffff',
      50: '#fafafa',
      100: '#f4f4f5',
      200: '#e4e4e7',
      300: '#d4d4d8',
      400: '#a1a1aa',
      500: '#71717a',
      600: '#52525b',
      700: '#3f3f46',
      800: '#27272a',
      900: '#18181b',
      950: '#09090b',
    },

    // Surface
    surface: {
      primary: '#ffffff',
      secondary: '#fafafa',
      tertiary: '#f4f4f5',
      inverse: '#18181b',
    },

    // Border
    border: {
      light: '#e4e4e7',
      medium: '#d4d4d8',
      dark: '#a1a1aa',
      focus: '#f59e0b',
      error: '#ef4444',
    },

    // Text
    text: {
      primary: '#18181b',
      secondary: '#52525b',
      tertiary: '#71717a',
      inverse: '#fafafa',
      link: '#d97706',
      linkHover: '#b45309',
    },

    // Overlay
    overlay: {
      light: 'rgba(24, 24, 27, 0.08)',
      medium: 'rgba(24, 24, 27, 0.24)',
      heavy: 'rgba(24, 24, 27, 0.48)',
      modal: 'rgba(24, 24, 27, 0.6)',
    },
  },

  // Spacing Scale (4px base)
  spacing: {
    0: '0',
    1: '0.25rem',   // 4px
    2: '0.5rem',    // 8px
    3: '0.75rem',   // 12px
    4: '1rem',      // 16px
    5: '1.25rem',   // 20px
    6: '1.5rem',    // 24px
    7: '1.75rem',   // 28px
    8: '2rem',      // 32px
    9: '2.25rem',   // 36px
    10: '2.5rem',   // 40px
    12: '3rem',     // 48px
    14: '3.5rem',   // 56px
    16: '4rem',     // 64px
    20: '5rem',     // 80px
    24: '6rem',     // 96px
    28: '7rem',     // 112px
    32: '8rem',     // 128px
  },

  // Typography
  typography: {
    fontFamily: {
      sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      display: ['Playfair Display', 'Georgia', 'Cambria', 'Times New Roman', 'serif'],
      mono: ['JetBrains Mono', 'Fira Code', 'Consolas', 'monospace'],
    },
    fontSize: {
      xs: ['0.75rem', { lineHeight: '1.5', letterSpacing: '0.025em' }],      // 12px
      sm: ['0.875rem', { lineHeight: '1.5', letterSpacing: '0.01em' }],     // 14px
      base: ['1rem', { lineHeight: '1.5', letterSpacing: '0' }],            // 16px
      lg: ['1.125rem', { lineHeight: '1.5', letterSpacing: '-0.01em' }],    // 18px
      xl: ['1.25rem', { lineHeight: '1.4', letterSpacing: '-0.015em' }],    // 20px
      '2xl': ['1.5rem', { lineHeight: '1.3', letterSpacing: '-0.02em' }],   // 24px
      '3xl': ['1.875rem', { lineHeight: '1.25', letterSpacing: '-0.02em' }], // 30px
      '4xl': ['2.25rem', { lineHeight: '1.2', letterSpacing: '-0.025em' }],  // 36px
      '5xl': ['3rem', { lineHeight: '1.15', letterSpacing: '-0.03em' }],     // 48px
      '6xl': ['3.75rem', { lineHeight: '1.1', letterSpacing: '-0.03em' }],   // 60px
    },
    fontWeight: {
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
    },
    lineHeight: {
      tight: '1.1',
      snug: '1.25',
      normal: '1.5',
      relaxed: '1.625',
      loose: '2',
    },
  },

  // Border Radius
  radius: {
    none: '0',
    xs: '0.125rem',   // 2px
    sm: '0.25rem',    // 4px
    md: '0.375rem',   // 6px
    lg: '0.5rem',     // 8px
    xl: '0.75rem',    // 12px
    '2xl': '1rem',    // 16px
    '3xl': '1.5rem',  // 24px
    full: '9999px',
  },

  // Shadows (Elevation system)
  shadow: {
    none: 'none',
    xs: '0 1px 2px 0 rgba(24, 24, 27, 0.05)',
    sm: '0 1px 3px 0 rgba(24, 24, 27, 0.1), 0 1px 2px -1px rgba(24, 24, 27, 0.1)',
    md: '0 4px 6px -1px rgba(24, 24, 27, 0.1), 0 2px 4px -2px rgba(24, 24, 27, 0.1)',
    lg: '0 10px 15px -3px rgba(24, 24, 27, 0.1), 0 4px 6px -4px rgba(24, 24, 27, 0.1)',
    xl: '0 20px 25px -5px rgba(24, 24, 27, 0.1), 0 8px 10px -6px rgba(24, 24, 27, 0.1)',
    '2xl': '0 25px 50px -12px rgba(24, 24, 27, 0.25)',
    inner: 'inset 0 2px 4px 0 rgba(24, 24, 27, 0.05)',
    // Brand shadows
    brand: '0 10px 40px -10px rgba(245, 158, 11, 0.35)',
    brandHover: '0 15px 50px -10px rgba(245, 158, 11, 0.5)',
  },

  // Transitions
  transition: {
    fast: '150ms ease',
    normal: '200ms ease',
    slow: '300ms ease',
    spring: '350ms cubic-bezier(0.34, 1.56, 0.64, 1)',
  },

  // Z-Index Scale
  zIndex: {
    hide: -1,
    base: 0,
    dropdown: 100,
    sticky: 200,
    fixed: 300,
    modalBackdrop: 400,
    modal: 500,
    popover: 600,
    tooltip: 700,
    toast: 800,
  },

  // Breakpoints
  breakpoint: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },

  // Container
  container: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1400px',
    padding: '1.5rem',
  },
} as const;

export type Tokens = typeof tokens;

// CSS Variable Generator
export function generateCSSVariables(tokens: Tokens): string {
  const lines: string[] = [':root {'];

  function flatten(obj: Record<string, any>, prefix: string = '') {
    for (const [key, value] of Object.entries(obj)) {
      const newKey = prefix ? `${prefix}-${key}` : key;
      if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
        flatten(value, newKey);
      } else if (Array.isArray(value)) {
        // Handle typography tuples
        lines.push(`  --${newKey}: ${value[0]};`);
        if (value[1]) {
          Object.entries(value[1]).forEach(([prop, val]) => {
            lines.push(`  --${newKey}-${prop}: ${val};`);
          });
        }
      } else {
        lines.push(`  --${newKey}: ${value};`);
      }
    }
  }

  flatten(tokens);
  lines.push('}');
  return lines.join('\n');
}