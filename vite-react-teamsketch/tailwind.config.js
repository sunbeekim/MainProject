const defaultTheme = require('tailwindcss/defaultTheme');

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  index: ['./index.html'],
  darkMode: 'class',
  theme: {
    // 컨테이너 설정
    container: {
      center: true,
      padding: {
        DEFAULT: '1rem',
        sm: '2rem',
        lg: '4rem',
        xl: '5rem',
        '2xl': '6rem',
      },
    },
    // 타이포그래피 시스템
    fontSize: {
      xs: ['0.75rem', { lineHeight: '1rem' }],
      sm: ['0.875rem', { lineHeight: '1.25rem' }],
      base: ['1rem', { lineHeight: '1.5rem' }],
      lg: ['1.125rem', { lineHeight: '1.75rem' }],
      xl: ['1.25rem', { lineHeight: '1.75rem' }],
      '2xl': ['1.5rem', { lineHeight: '2rem' }],
      '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
      '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
      '5xl': ['3rem', { lineHeight: '1' }],
    },
    extend: {
      // 색상 시스템
      colors: {
        primary: {
          light: '#4C86F9',
          DEFAULT: '#2563EB',
          dark: '#1E40AF',
        },
        secondary: {
          light: '#9CA3AF',
          DEFAULT: '#6B7280',
          dark: '#4B5563',
        },
        background: {
          light: '#FFFFFF',
          dark: '#1F2937',
        },
        text: {
          light: '#1F2937',
          dark: '#F9FAFB',
        },
      },
      // 간격 시스템
      spacing: {
        xs: '0.25rem',    // 4px
        sm: '0.5rem',     // 8px
        md: '1rem',       // 16px
        lg: '1.5rem',     // 24px
        xl: '2rem',       // 32px
        '2xl': '2.5rem',  // 40px
        '3xl': '3rem',    // 48px
      },
      // 레이아웃 시스템
      layout: {
        maxWidth: {
          sm: '640px',
          md: '768px',
          lg: '1024px',
          xl: '1280px',
        },
        gap: {
          xs: '0.5rem',
          sm: '1rem',
          md: '1.5rem',
          lg: '2rem',
        },
      },
      gridTemplateColumns: {
        '1': 'repeat(1, minmax(0, 1fr))',
        '2': 'repeat(2, minmax(0, 1fr))',
        '3': 'repeat(3, minmax(0, 1fr))',
        '4': 'repeat(4, minmax(0, 1fr))',
        '5': 'repeat(5, minmax(0, 1fr))',
        '6': 'repeat(6, minmax(0, 1fr))',
        '12': 'repeat(12, minmax(0, 1fr))',
      },
      gridColumn: {
        'span-1': 'span 1 / span 1',
        'span-2': 'span 2 / span 2',
        'span-3': 'span 3 / span 3',
        'span-4': 'span 4 / span 4',
        'span-5': 'span 5 / span 5',
        'span-6': 'span 6 / span 6',
        'span-12': 'span 12 / span 12',
      },
      gridRow: {
        'span-1': 'span 1 / span 1',
        'span-2': 'span 2 / span 2',
        'span-3': 'span 3 / span 3',
        'span-4': 'span 4 / span 4',
        'span-5': 'span 5 / span 5',
        'span-6': 'span 6 / span 6',
      }
    },
  },
  plugins: [],
  safelist: [
    {
      pattern: /^grid-cols-/,
      variants: ['responsive', 'hover', 'focus', 'active']
    },
    {
      pattern: /^grid-rows-/,
      variants: ['responsive', 'hover', 'focus', 'active']
    },
    {
      pattern: /^col-span-/,
      variants: ['responsive', 'hover', 'focus', 'active']
    },
    {
      pattern: /^row-span-/,
      variants: ['responsive', 'hover', 'focus', 'active']
    },
    {
      pattern: /^gap-/,
      variants: ['responsive', 'hover', 'focus', 'active']
    }
  ]
}