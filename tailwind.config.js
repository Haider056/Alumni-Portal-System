/** IST Alumni Portal design tokens */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
      },
      fontSize: {
        '2xs': ['11px', { lineHeight: '16px', letterSpacing: '0.04em' }],
        xs: ['12px', { lineHeight: '16px' }],
        sm: ['13px', { lineHeight: '20px' }],
        base: ['15px', { lineHeight: '24px' }],
        md: ['17px', { lineHeight: '26px' }],
        lg: ['22px', { lineHeight: '30px', letterSpacing: '-0.01em' }],
        xl: ['30px', { lineHeight: '38px', letterSpacing: '-0.02em' }],
        '2xl': ['44px', { lineHeight: '52px', letterSpacing: '-0.025em' }],
      },
      colors: {
        canvas: '#F7F8FA',
        surface: '#FFFFFF',
        line: { DEFAULT: '#E6E8EC', strong: '#D5D9E0' },
        ink: { DEFAULT: '#0F1115', 2: '#3D434D', 3: '#6B7280', 4: '#9AA1AC' },
        accent: { DEFAULT: '#1F4FD8', hover: '#1A43BA', soft: '#EEF2FD', line: '#C9D5F6' },
        success: { DEFAULT: '#127A4B', soft: '#E9F6EF' },
        danger: { DEFAULT: '#C2382B', soft: '#FCEEEC' },
        warn: { DEFAULT: '#9A5B00', soft: '#FDF4E3' },
      },
      borderRadius: { ctl: '6px', card: '12px' },
      boxShadow: {
        pop: '0 1px 2px rgba(15,17,21,0.04), 0 8px 24px rgba(15,17,21,0.08)',
        xs: '0 1px 2px rgba(15,17,21,0.05)',
      },
      maxWidth: { page: '1200px' },
    },
  },
  plugins: [],
};
