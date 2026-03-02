/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [],
  theme: {
    extend: {
      colors: {
        // Design plan colors
        ink: "#0F0E0C",
        paper: "#FAFAF7",
        gold: {
          DEFAULT: "#9A7A3A",
          light: "#C4A052",
          pale: "#F5EDD8",
          50: "#F5EDD8",
          100: "#E8D5B5",
          200: "#D4B87A",
          300: "#C4A052",
          400: "#B4893A",
          500: "#9A7A3A",
          600: "#826632",
          700: "#6B5428",
          800: "#544220",
          900: "#3D2E18",
        },
        "warm-gray": "#E8E4DC",
        mid: "#8A8070",
        line: "#D8D2C4",
        // Legacy brand colors for compatibility
        brand: {
          black: "#0F0E0C",
          white: "#FAFAF7",
          neutral: "#E8E4DC",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "serif"],
        body: ["var(--font-body)", "sans-serif"],
        sans: ["Jost", "system-ui", "sans-serif"],
        serif: ["Cormorant Garamond", "Georgia", "serif"],
      },
      spacing: {
        // Design plan spacing tokens
        4: "0.25rem",
        8: "0.5rem",
        12: "0.75rem",
        16: "1rem",
        24: "1.5rem",
        40: "2.5rem",
        48: "3rem",
        60: "3.75rem",
        80: "5rem",
        96: "6rem",
        120: "7.5rem",
        128: "8rem",
        144: "9rem",
      },
      boxShadow: {
        "warm": "0 8px 32px rgba(15, 14, 12, 0.08)",
        "gold": "0 0 20px rgba(154, 122, 58, 0.2)",
      },
      animation: {
        "fade-slide-up": "fadeSlideUp 0.8s ease-out both",
        "fade-slide-right": "fadeSlideRight 0.6s ease-out both",
        "scroll-pulse": "scrollPulse 2s ease-in-out infinite",
      },
      keyframes: {
        fadeSlideUp: {
          "0%": { opacity: "0", transform: "translateY(30px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeSlideRight: {
          "0%": { opacity: "0", transform: "translateX(-20px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        scrollPulse: {
          "0%, 100%": { opacity: "1", transform: "scaleY(1)" },
          "50%": { opacity: "0.3", transform: "scaleY(0.7)" },
        },
      },
    },
  },
  plugins: [],
};
