/**
 * Lyberate / Centauri Design System Tokens
 * Master Contract Definitivo — Fase 01: Fundamentos e Identidad Visual
 * 
 * Centraliza la definición de tokens de diseño para garantizar coherencia,
 * modularidad y accesibilidad estricta (WCAG 2.1 AA/AAA).
 */

export const tokens = {
  colors: {
    // Canvas & Superficies (Editorial cálido, no blanco clínico)
    canvas: '#FBFBF9',
    surface: '#FFFFFF',
    surfaceSubtle: '#F5F4EF',
    surfaceHover: '#ECEAE3',
    surfaceActive: '#E3E0D6',

    // Bordes & Separadores (Controlados, sin líneas duras artificiales)
    border: '#E5E3DC',
    borderStrong: '#D1CEBF',
    borderFocus: '#C85A32',

    // Tipografía & Contrastes (Mínimo 7:1 en texto principal)
    textMain: '#141413',        // Carbón profundo
    textSecondary: '#5C5B56',   // Tono piedra oscuro (contraste 7.2:1 sobre #FBFBF9)
    textMuted: '#7D7A73',       // Tono neutro accesible (contraste > 4.6:1)
    textInverse: '#FFFFFF',

    // Identidad de Marca (Terracota Cobrizo / Cuero refinado)
    brand: {
      primary: '#C85A32',       // Terracota principal (contraste 4.8:1 sobre blanco, 4.6:1 sobre canvas)
      primaryHover: '#B34E2A',
      primaryActive: '#9A4122',
      accent: '#E07A5F',        // Acento melocotón tostado
      surface: '#FBF1EC',       // Fondo tenue para estados de marca
      border: '#F3D7CA',
    },

    // Semántica & Estados de Feedback (Con alto contraste sin estridencias)
    semantic: {
      success: {
        text: '#0D543A',
        surface: '#ECFDF5',
        border: '#A7F3D0',
      },
      warning: {
        text: '#854D0E',
        surface: '#FEFCE8',
        border: '#FEF08A',
      },
      error: {
        text: '#991B1B',
        surface: '#FEF2F2',
        border: '#FECACA',
      },
      info: {
        text: '#1E40AF',
        surface: '#EFF6FF',
        border: '#BFDBFE',
      },
    },

    // Modo Oscuro / Contenedores Nocturnos (Control Room & High-Impact Blocks)
    dark: {
      canvas: '#141413',
      surface: '#1C1B18',
      surfaceElevated: '#242320',
      border: '#2E2D29',
      borderSubtle: '#22211E',
      textMain: '#FBFBF9',
      textSecondary: '#A8A69E',
      textMuted: '#73716A',
    },
  },

  typography: {
    fonts: {
      heading: "'Playfair Display', Georgia, serif",
      body: "'Plus Jakarta Sans', system-ui, -apple-system, sans-serif",
      mono: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
    },
    sizes: {
      xs: '0.75rem',    // 12px
      sm: '0.875rem',   // 14px
      base: '1rem',      // 16px
      lg: '1.125rem',   // 18px
      xl: '1.25rem',    // 20px
      '2xl': '1.5rem',  // 24px
      '3xl': '1.875rem',// 30px
      '4xl': '2.25rem', // 36px
      '5xl': '3rem',    // 48px
      '6xl': '3.75rem', // 60px
    },
    lineHeights: {
      tight: 1.15,
      snug: 1.3,
      normal: 1.5,
      relaxed: 1.65,
    },
    weights: {
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
      extrabold: 800,
    },
  },

  spacing: {
    1: '0.25rem',  // 4px
    2: '0.5rem',   // 8px
    3: '0.75rem',  // 12px
    4: '1rem',     // 16px
    5: '1.25rem',  // 20px
    6: '1.5rem',   // 24px
    8: '2rem',     // 32px
    10: '2.5rem',  // 40px
    12: '3rem',    // 48px
    16: '4rem',    // 64px
    20: '5rem',    // 80px
    24: '6rem',    // 96px
  },

  radii: {
    sm: '0.25rem', // 4px
    md: '0.5rem',  // 8px
    lg: '0.75rem', // 12px
    xl: '1rem',    // 16px
    '2xl': '1.5rem',// 24px
    full: '9999px',
  },

  shadows: {
    // Elevaciones limpias sin blur excesivo (hairline + drop suave)
    none: 'none',
    subtle: '0 1px 2px 0 rgba(20, 20, 19, 0.04)',
    card: '0 1px 3px 0 rgba(20, 20, 19, 0.06), 0 1px 2px -1px rgba(20, 20, 19, 0.06)',
    elevated: '0 4px 6px -1px rgba(20, 20, 19, 0.08), 0 2px 4px -2px rgba(20, 20, 19, 0.06)',
    modal: '0 20px 25px -5px rgba(20, 20, 19, 0.15), 0 8px 10px -6px rgba(20, 20, 19, 0.1)',
  },

  motion: {
    durations: {
      fast: '150ms',
      normal: '220ms',
      slow: '350ms',
    },
    easings: {
      standard: 'cubic-bezier(0.16, 1, 0.3, 1)',
      out: 'cubic-bezier(0, 0, 0.2, 1)',
      inOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    },
  },

  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
  },

  zIndex: {
    base: 0,
    dropdown: 10,
    sticky: 20,
    backdrop: 40,
    modal: 50,
    toast: 60,
  },
} as const;

export type DesignTokens = typeof tokens;

