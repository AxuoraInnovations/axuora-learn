import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "rgb(4, 84, 255)",
        "primary-light": "rgb(134, 185, 255)",
        "primary-bg": "rgb(235, 241, 255)",
        neutral: {
          dark: "rgb(0, 0, 0)",
          light: "rgb(255, 255, 255)",
        },
        theme: {
          1: "rgb(4, 84, 255)",
          2: "rgb(134, 185, 255)",
          3: "rgb(235, 241, 255)",
          4: "rgb(61, 61, 61)",
          5: "rgb(255, 91, 91)",
          6: "rgb(126, 91, 255)",
          7: "rgb(109, 109, 109)",
          8: "rgb(255, 242, 242)",
          9: "rgb(245, 246, 248)",
          10: "rgb(234, 234, 234)",
        },
        card: "#fff",
        "card-foreground": "rgb(0, 0, 0)",
        muted: "#f4f4f5",
        "muted-foreground": "#71717a",
        "bg-0": "#ffffff",
        "bg-100": "#fafafa",
        "bg-200": "#f0f0f0",
        "bg-300": "#e5e5e5",
        "text-100": "#1a1a1a",
        "text-200": "#333333",
        "text-300": "#666666",
        "text-400": "#888888",
        "text-500": "#9ca3af",
        accent: "rgb(4, 84, 255)",
        "accent-hover": "rgb(3, 70, 220)",
      },
      fontFamily: {
        archivo: ["var(--font-archivo)", "system-ui", "sans-serif"],
        script: ['"Great Vibes"', "cursive"],
        quote: ['"Lora"', "Georgia", "serif"],
        greeting: ['"Times New Roman"', "Times", "serif"],
      },
      maxWidth: {
        content: "1440px",
        narrow: "700px",
      },
      animation: {
        "fade-in": "fade-in 0.2s ease-out",
        "thinking-dots": "thinking-dots 1.4s ease-in-out infinite",
        "border-spin": "border-spin 4s linear infinite",
      },
      keyframes: {
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "thinking-dots": {
          "0%, 60%": { opacity: "0.35" },
          "30%": { opacity: "1" },
          "100%": { opacity: "0.35" },
        },
        "border-spin": {
          "0%": { transform: "translate(-50%, -50%) rotate(0deg)" },
          "100%": { transform: "translate(-50%, -50%) rotate(360deg)" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
