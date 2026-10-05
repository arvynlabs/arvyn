import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        arvyn: {
          orange: "#FF5A00",
          black: "#070707",
          panel: "#111111",
          ink: "#F5F5F5",
          muted: "#8A8A8A",
        },
      },
      fontFamily: {
        sans: ["Inter", "Geist", "SF Pro Display", "-apple-system", "Segoe UI", "sans-serif"],
        mono: ["JetBrains Mono", "SF Mono", "Menlo", "monospace"],
      },
      maxWidth: {
        shell: "1200px",
      },
    },
  },
  plugins: [],
};

export default config;
