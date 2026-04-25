import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx,mdx}",
    "./components/**/*.{ts,tsx}",
    "./content/**/*.mdx",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          green: "#2DB84B",
          light: "#5FD87A",
          dark: "#1A6B33",
        },
        ink: {
          DEFAULT: "#1A1A1A",
          soft: "#2D2D2D",
          muted: "#6B6B6B",
        },
        cream: "#F7F6F2",
        morocco: {
          DEFAULT: "#C4933F",
          dark: "#8B6420",
        },
        auto: {
          navy: "#0D1B2E",
          "navy-soft": "#152744",
          mint: "#00C49A",
          "mint-light": "#5EEBC8",
        },
        alert: "#C0392B",
        warning: "#E6A817",
        info: "#0095F6",
      },
      fontFamily: {
        sans: ["var(--font-jakarta)", "system-ui", "sans-serif"],
        poppins: ["var(--font-poppins)", "system-ui", "sans-serif"],
      },
      fontSize: {
        display: ["clamp(3rem, 7vw, 5rem)", { lineHeight: "1", letterSpacing: "-0.03em", fontWeight: "800" }],
        h1: ["clamp(2.5rem, 5vw, 3.5rem)", { lineHeight: "1.05", letterSpacing: "-0.025em", fontWeight: "800" }],
        h2: ["clamp(2rem, 4vw, 3rem)", { lineHeight: "1.1", letterSpacing: "-0.02em", fontWeight: "800" }],
        tag: ["0.6875rem", { lineHeight: "1", letterSpacing: "0.2em", fontWeight: "700" }],
      },
      backgroundImage: {
        "brand-gradient": "linear-gradient(165deg, #1A6B33 0%, #2DB84B 50%, #5FD87A 100%)",
        "morocco-gradient": "linear-gradient(135deg, #C4933F 0%, #8B6420 100%)",
        "auto-gradient": "linear-gradient(165deg, #0D1B2E 0%, #152744 50%, #00C49A 130%)",
        "auto-mint": "linear-gradient(135deg, #00C49A 0%, #5EEBC8 100%)",
        "dot-grid": "radial-gradient(rgba(255,255,255,0.06) 1px, transparent 1px)",
        "dot-grid-dark": "radial-gradient(rgba(0,0,0,0.06) 1px, transparent 1px)",
        "dot-grid-mint": "radial-gradient(rgba(0,196,154,0.12) 1px, transparent 1px)",
      },
      backgroundSize: {
        "dot-32": "32px 32px",
      },
      boxShadow: {
        glow: "0 0 0 1px rgba(45,184,75,0.2), 0 20px 60px -20px rgba(45,184,75,0.35)",
        "glow-lg": "0 0 0 1px rgba(45,184,75,0.3), 0 30px 80px -20px rgba(45,184,75,0.5)",
        "glow-mint": "0 0 0 1px rgba(0,196,154,0.25), 0 20px 60px -20px rgba(0,196,154,0.45)",
      },
      animation: {
        marquee: "marquee 40s linear infinite",
        "pulse-soft": "pulse-soft 3s ease-in-out infinite",
        shimmer: "shimmer 2.5s linear infinite",
        float: "float 6s ease-in-out infinite",
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        "pulse-soft": {
          "0%, 100%": { boxShadow: "0 0 0 0 rgba(45,184,75,0.5)" },
          "50%": { boxShadow: "0 0 0 16px rgba(45,184,75,0)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};

export default config;
