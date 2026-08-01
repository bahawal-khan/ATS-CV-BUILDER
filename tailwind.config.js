/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#14213D",
        inksoft: "#3B4A6B",
        paper: "#FFFFFF",
        bg: "#F4F6FB",
        line: "#E4E7F1",
        accent: "#2E7D6B",
        accentsoft: "#E4F1EC",
        warn: "#C1666B",
        warnsoft: "#F8E9EA",
        muted: "#7C8299",

        indigo: "#4F5FE0",
        indigosoft: "#EAEBFC",
        violet: "#8B5CF6",
        violetsoft: "#F1EBFE",
        amber: "#D97706",
        ambersoft: "#FCEFD9",
        rose: "#E1548A",
        rosesoft: "#FBE9F1",
        sky: "#0EA5C9",
        skysoft: "#E2F5FA",
      },
      fontFamily: {
        display: ["var(--font-space-grotesk)", "sans-serif"],
        body: ["var(--font-inter)", "sans-serif"],
      },
      boxShadow: {
        card: "0 1px 2px rgba(20,33,61,0.04), 0 8px 24px rgba(20,33,61,0.06)",
        cardHover: "0 4px 10px rgba(20,33,61,0.06), 0 16px 36px rgba(20,33,61,0.10)",
        glow: "0 0 0 4px rgba(79,95,224,0.12)",
      },
      keyframes: {
        fadeInUp: {
          "0%": { opacity: "0", transform: "translateY(6px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        popIn: {
          "0%": { opacity: "0", transform: "scale(0.96)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "0% 50%" },
          "100%": { backgroundPosition: "200% 50%" },
        },
      },
      animation: {
        fadeInUp: "fadeInUp 0.35s ease both",
        popIn: "popIn 0.22s ease both",
        shimmer: "shimmer 3s linear infinite",
      },
    },
  },
  plugins: [],
};
