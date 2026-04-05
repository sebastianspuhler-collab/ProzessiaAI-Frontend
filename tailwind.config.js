/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{ts,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary:   { DEFAULT: '#4F46E5', hover: '#4338CA', foreground: '#EEF2FF' },
        accent:    { DEFAULT: '#EEF2FF', border: '#C7D2FE', foreground: '#3730A3' },
        border:    '#E5E7EB',
        'border-strong': '#D1D5DB',
        muted:     { DEFAULT: '#F9FAFB', foreground: '#6B7280' },
        sidebar:   '#FFFFFF',
      },
    },
  },
  plugins: [],
};
