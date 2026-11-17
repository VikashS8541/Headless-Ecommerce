/** @type {import('tailwindcss').Config} */
const v = name => `var(--${name})`

export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  corePlugins: { preflight: false },
  theme: {
    extend: {
      colors: Object.fromEntries(
        [
          'surface', 'surface-warm', 'surface-beige', 'surface-inverse',
          'ink', 'ink-muted', 'ink-inverse',
          'border', 'border-strong',
          'brand', 'on-brand',
          'accent', 'accent-strong', 'on-accent-strong', 'accent-soft',
          'success', 'success-soft', 'error', 'error-soft',
        ].map(n => [n, v(n)]),
      ),
      fontFamily: {
        heading: [v('font-heading')],
        body: [v('font-body')],
        editorial: [v('font-editorial')],
      },
      borderRadius: { xs: v('radius-xs'), sm: v('radius-sm'), md: v('radius-md'), lg: v('radius-lg'), pill: v('radius-pill') },
      boxShadow: { sm: v('shadow-sm'), md: v('shadow-md'), lg: v('shadow-lg') },
    },
  },
  plugins: [],
}
