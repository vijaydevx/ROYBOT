import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        s: {
          bg: "#313967",         // Deep Navy
          sidebar: "#4D1D46",    // Deep Purple/Plum
          card: "rgba(53, 80, 110, 0.7)", // Muted Slate Blue (translucent)
          "card-solid": "#35506E", 
          border: "rgba(235, 184, 101, 0.1)", // Mustard border (faint)
          "border-strong": "rgba(235, 184, 101, 0.2)",
          accent: "#DC7049",     // Muted Orange
          highlight: "#EBB865",  // Mustard/Yellow
          muted: "#563060",      // Lighter Purple
          danger: "#8F5050",     // Muted Rose
          text: "#FFFFFF",
          "text-secondary": "#EBB865",
          "text-muted": "rgba(255, 255, 255, 0.5)",
          blue: "#35506E",
          "blue-light": "rgba(53, 80, 110, 0.2)",
          purple: "#563060",
          "purple-light": "rgba(86, 48, 96, 0.2)",
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
        glass: "0 8px 32px rgba(0, 0, 0, 0.2)",
        "glass-lg": "0 12px 48px rgba(0, 0, 0, 0.3)",
        "glass-sm": "0 2px 12px rgba(0, 0, 0, 0.1)",
        float: "0 20px 60px rgba(0, 0, 0, 0.4)",
        glow: "0 0 20px rgba(235, 184, 101, 0.15)",
        "glow-accent": "0 0 20px rgba(220, 112, 73, 0.15)",
        "glow-purple": "0 0 20px rgba(86, 48, 96, 0.15)",
      },
      backgroundImage: {
        "gradient-main": "linear-gradient(135deg, #313967 0%, #2A305A 100%)",
        "gradient-accent": "linear-gradient(135deg, #DC7049 0%, #8F5050 100%)",
        "gradient-mustard": "linear-gradient(135deg, #EBB865 0%, #D4A354 100%)",
        "gradient-card": "linear-gradient(135deg, rgba(53, 80, 110, 0.4) 0%, rgba(53, 80, 110, 0.1) 100%)",
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
