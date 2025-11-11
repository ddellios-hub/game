import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["../../apps/**/*.{ts,tsx}", "../../packages/ui/**/*.{ts,tsx}", "../../packages/game-core/**/*.{ts,tsx}"] ,
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#6366f1",
          foreground: "#ffffff"
        },
        danger: "#ef4444",
        success: "#22c55e"
      }
    }
  },
  plugins: [require("@tailwindcss/forms"), require("@tailwindcss/typography")]
} satisfies Config;
