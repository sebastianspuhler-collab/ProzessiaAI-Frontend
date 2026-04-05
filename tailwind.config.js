/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{ts,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      animation: {
        aurora: "aurora 60s linear infinite",
      },
      keyframes: {
        aurora: {
          from: { backgroundPosition: "50% 50%, 50% 50%" },
          to: { backgroundPosition: "350% 50%, 350% 50%" },
        },
      },
    },
  },
  plugins: [
    function ({ addBase }) {
      addBase({
        ":root": {
          "--white": "#ffffff",
          "--black": "#000000",
          "--transparent": "transparent",
          "--blue-300": "#93c5fd",
          "--blue-400": "#60a5fa",
          "--blue-500": "#3b82f6",
          "--indigo-300": "#a5b4fc",
          "--violet-200": "#ddd6fe",
        },
      });
    },
  ],
};
