// tailwind.config.ts or tailwind.config.js
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // KraftMart Brand Palette
        kraft: {
          cream: "#F5F0E8",
          "cream-dark": "#E8E0D5",
          maroon: "#5C1A1B",
          "maroon-dark": "#4a1516",
          "maroon-light": "#8B1E1E",
          gold: "#C4A35A",
          "gold-dark": "#b3924f",
          "gold-light": "#D4B76A",
          ink: "#1A1A1A",
          "ink-light": "#4B5563",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        serif: ["Georgia", "Cambria", "serif"],
      },
      animation: {
        "float-slow": "float 15s ease-in-out infinite",
        "float-medium": "float 12s ease-in-out infinite",
        "float-fast": "float 8s ease-in-out infinite",
        "pulse-glow": "pulseGlow 3s ease-in-out infinite",
        "shimmer": "shimmer 2s linear infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translate(0, 0) scale(1)" },
          "33%": { transform: "translate(30px, -20px) scale(1.1)" },
          "66%": { transform: "translate(-20px, 30px) scale(0.95)" },
        },
        pulseGlow: {
          "0%, 100%": { opacity: "0.4", transform: "scale(1)" },
          "50%": { opacity: "0.7", transform: "scale(1.05)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      boxShadow: {
        "kraft-card": "0 4px 24px rgba(92, 26, 27, 0.06)",
        "kraft-card-hover": "0 12px 40px rgba(92, 26, 27, 0.12)",
        "kraft-gold": "0 4px 20px rgba(196, 163, 90, 0.2)",
        "kraft-inner": "inset 0 2px 8px rgba(0,0,0,0.04)",
      },
      borderRadius: {
        "kraft": "16px",
        "kraft-sm": "12px",
        "kraft-xs": "8px",
      },
      transitionTimingFunction: {
        "kraft": "cubic-bezier(0.4, 0, 0.2, 1)",
        "kraft-bounce": "cubic-bezier(0.34, 1.56, 0.64, 1)",
      },
    },
  },
  plugins: [],
};

export default config;
