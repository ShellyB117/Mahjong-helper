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
        mj: {
          bg: "#0f1419",
          panel: "#1a2332",
          border: "#2d3a4f",
          accent: "#c9a227",
        },
        tile: {
          "man-label": "#f87171",
          "pin-label": "#60a5fa",
          "sou-label": "#4ade80",
          "honor-label": "#a78bfa",
        },
      },
    },
  },
  plugins: [],
};

export default config;
