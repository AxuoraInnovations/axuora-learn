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
      },
      fontFamily: {
        archivo: ["var(--font-archivo)", "system-ui", "sans-serif"],
      },
      maxWidth: {
        content: "1440px",
        narrow: "700px",
      },
    },
  },
  plugins: [],
};
export default config;
