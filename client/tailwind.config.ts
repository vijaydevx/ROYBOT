import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        s: {
          bg: "#F8FAFC",
          "bg-alt": "#EEF2F7",
          card: "rgba(255, 255, 255, 0.72)",
          "card-solid": "#FFFFFF",
          border: "rgba(0, 0, 0, 0.06)",
          "border-strong": "rgba(0, 0, 0, 0.10)",
          blue: "#3B82F6",
          "blue-light": "#DBEAFE",
          purple: "#8B5CF6",
          "purple-light": "#EDE9FE",
          teal: "#14B8A6",
          "teal-light": "#CCFBF1",
          green: "#22C55E",
          "green-light": "#DCFCE7",
          red: "#EF4444",
          "red-light": "#FEE2E2",
          amber: "#F59E0B",
          "amber-light": "#FEF3C7",
          text: "#0F172A",
          "text-secondary": "#475569",
          "text-muted": "#94A3B8",
          sidebar: "rgba(255, 255, 255, 0.85)",
        },
      },
      fontFamily: {
        sans: ["Inter", "SF Pro Display", "-apple-system", "BlinkMacSystemFont", "sans-serif"],
        mono: ["JetBrains Mono", "SF Mono", "monospace"],
      },
      borderRadius: {
        "2xl": "16px",
        "3xl": "20px",
      },
      boxShadow: {
        glass: "0 8px 32px rgba(0, 0, 0, 0.06)",
        "glass-lg": "0 12px 48px rgba(0, 0, 0, 0.08)",
        "glass-sm": "0 2px 12px rgba(0, 0, 0, 0.04)",
        float: "0 20px 60px rgba(0, 0, 0, 0.08)",
        glow: "0 0 20px rgba(59, 130, 246, 0.15)",
        "glow-teal": "0 0 20px rgba(20, 184, 166, 0.15)",
        "glow-purple": "0 0 20px rgba(139, 92, 246, 0.15)",
      },
      backgroundImage: {
        "gradient-main": "linear-gradient(135deg, #F8FAFC 0%, #EEF2F7 100%)",
        "gradient-accent": "linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%)",
        "gradient-teal": "linear-gradient(135deg, #14B8A6 0%, #3B82F6 100%)",
        "gradient-card": "linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.6) 100%)",
      },
      animation: {
        "pulse-soft": "pulse-soft 2s ease-in-out infinite",
        "fade-in": "fade-in 0.3s ease-out",
        "slide-up": "slide-up 0.4s ease-out",
        "slide-right": "slide-right 0.3s ease-out",
      },
      keyframes: {
        "pulse-soft": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.6" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "slide-up": {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "slide-right": {
          "0%": { opacity: "0", transform: "translateX(-10px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
      },
      backdropBlur: {
        glass: "20px",
      },
    },
  },
  plugins: [],
};

export default config;
