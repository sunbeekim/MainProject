// const defaultTheme = require('tailwindcss/defaultTheme');

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
        '2xl': '6rem'
      }
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
      '5xl': ['3rem', { lineHeight: '1' }]
    },
    extend: {
      // 색상 시스템
      colors: {
        primary: {
          light: '#F6CED8', // 연한 핑크
          DEFAULT: '#CADABE', // 연한 보라
          dark: '#9FB29E ' // 연한 민트
          // #F6CED8 (아주 연한 핑크 - 연핑크 느낌)
          // #ECCEF5 (연한 보라 - 연한 보라)
          // #CEF6E3 (연한 민트 - 연한 민트
        },
        secondary: {
          light: '#F4F2C0', // 연한 오렌지
          DEFAULT: '#FBCCC5', // 연한 핑크
          dark: '#F9B0BA' // 연한 보라
          // #F6E3CE (연한 오렌지 - 연한 오렌지)
          // #F6CED8 (연한 핑크 - 연핑크 느낌)
          // #ECCEF5 (연한 보라 - 연한 보라)
        },
        background: {
          light: '#FFFFFF', // 흰색
          dark: '#2D2D2D' // 어두운 회색
          // #FFFFFF (흰색 - 흰색)
          // #2D2D2D (어두운 회색 - 어두운 회색)
        },
        text: {
          light: '#4A4A4A', // 진한 회색
          dark: '#F6CED8', // 연한 핑크
          deeppink: '#FA58F4' // 진한 핑크
          // #4A4A4A (진한 회색 - 진한 회색)
          // #F6CED8 (연한 핑크 - 연핑크 느낌)
          // #FA58F4 (진한 핑크 - 진한 핑크)
        },
        border: {
          light: '#F9B0BA', // 연한 보라
          dark: '#FBCCC5' // 연한 핑크
          // #ECCEF5 (연한 보라 - 연한 보라)
          // #F6CED8 (연한 핑크 - 연핑크 느낌)
        },
        purple: {
          DEFAULT: '#800080', //
          level_1: '#E6CCFF', //
          level_2: '#D1A3FF',
          level_3: '#B980FF',
          level_4: '#A14EFF',
          level_5: '#8A2BE2',
          level_6: '#7A00CC',
          level_7: '#5700AA',
          level_8: '#430086',
          level_9: '#2E0066',
          level_10: '#190043'
          // #800080 (보라색 - 보라색)
          // #E6CCFF (아주 연한 보라 - 라벤더 톤)
          // #D1A3FF (밝은 연보라)
          // #B980FF (연한 보라)
          // #A14EFF (선명한 보라)
          // #8A2BE2 (보라색 - 블루바이올렛)
          // #7A00CC (살짝 어두운 보라)
          // #6600B2 (진한 보라)
          // #4D0080 (깊은 보라)
          // #330066 (어두운 보라 - 거의 검정 느낌)
          // #1A0033 (극한의 어두운 보라)
        },
        pink: {
          DEFAULT: '#FFC0CB', //
          level_1: '#FFD6E6', //
          level_2: '#FFB3D1',
          level_3: '#FF8ACF',
          level_4: '#FF66B2',
          level_5: '#FF3399',
          level_6: '#FF007F',
          level_7: '#CC0066',
          level_8: '#99004D',
          level_9: '#660033',
          level_10: '#330019'
          // #FFC0CB (아주 연한 핑크 - 연핑크 느낌)
          // #FFD6E6 (아주 연한 핑크 - 파스텔톤)
          // #FFB3D1 (밝은 핑크)
          // #FF8ACF (연한 핫핑크)
          // #FF66B2 (선명한 핑크)
          // #FF3399 (핫핑크)
          // #FF007F (진한 핑크)
          // #CC0066 (더 진한 핑크)
          // #99004D (어두운 핑크 - 레드톤 강함)
          // #660033 (매우 어두운 핑크)
          // #330019 (거의 검정에 가까운 핑크)
        },
        purple_color: {
          level_1: '#D6F5E6', //
          level_2: '#D1EBA3', //
          level_3: '#BADD75',
          level_4: '#A3D14A', //
          level_5: '#75D41D',
          level_6: '#5EA815',
          level_7: '#49800F',
          level_8: '#336608',
          level_9: '#1A3304',
          level_10: '#0D1902'
          // #D6F5E6 (아주 연한 연두)
          // #D1EBA3 (밝은 연두)
          // #BADD75 (연한 연두)
          // #A3D14A (선명한 라임그린)
          // #75D41D (기본 라임그린)
          // #5EA815 (살짝 어두운 라임)
          // #49800F (더 진한 연두)
          // #336608 (짙은 녹색)
          // #1A3304 (매우 어두운 녹색)
          // #0D1902 (거의 검정에 가까운 녹색)
        },
        pink_color: {
          level_1: '#D6F5E6', //
          level_2: '#A3EBCC', //
          level_3: '#75E1B2',
          level_4: '#4AD799',
          level_5: '#00CC66',
          level_6: '#00A653',
          level_7: '#008040',
          level_8: '#006633',
          level_9: '#00331A',
          level_10: '#001A0D'
          // #D6F5E6 (아주 연한 민트)
          // #A3EBCC (밝은 민트)
          // #75E1B2 (연한 청록색)
          // #4AD799 (선명한 청록)
          // #00CC66 (기본 청록색)
          // #00A653 (살짝 어두운 청록)
          // #008040 (더 진한 청록)
          // #006633 (짙은 녹색)
          // #00331A (매우 어두운 녹색)
          // #001A0D (거의 검정에 가까운 녹색)
        }
      },
      // 간격 시스템
      spacing: {
        xs: '0.25rem', // 4px
        sm: '0.5rem', // 8px
        md: '1rem', // 16px
        lg: '1.5rem', // 24px
        xl: '2rem', // 32px
        '2xl': '2.5rem', // 40px
        '3xl': '3rem' // 48px
      },
      // 레이아웃 시스템
      layout: {
        maxWidth: {
          sm: '640px',
          md: '768px',
          lg: '1024px',
          xl: '1280px'
        },
        gap: {
          xs: '0.5rem',
          sm: '1rem',
          md: '1.5rem',
          lg: '2rem'
        }
      },
      gridTemplateColumns: {
        1: 'repeat(1, minmax(0, 1fr))',
        2: 'repeat(2, minmax(0, 1fr))',
        3: 'repeat(3, minmax(0, 1fr))',
        4: 'repeat(4, minmax(0, 1fr))',
        5: 'repeat(5, minmax(0, 1fr))',
        6: 'repeat(6, minmax(0, 1fr))',
        12: 'repeat(12, minmax(0, 1fr))'
      },
      gridColumn: {
        'span-1': 'span 1 / span 1',
        'span-2': 'span 2 / span 2',
        'span-3': 'span 3 / span 3',
        'span-4': 'span 4 / span 4',
        'span-5': 'span 5 / span 5',
        'span-6': 'span 6 / span 6',
        'span-12': 'span 12 / span 12'
      },
      gridRow: {
        'span-1': 'span 1 / span 1',
        'span-2': 'span 2 / span 2',
        'span-3': 'span 3 / span 3',
        'span-4': 'span 4 / span 4',
        'span-5': 'span 5 / span 5',
        'span-6': 'span 6 / span 6'
      }
    }
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
};
