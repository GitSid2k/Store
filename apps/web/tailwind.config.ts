import type { Config } from "tailwindcss";
import preset from "../../packages/config/tailwind/tailwind.preset.js";

const config = {
  presets: [preset],
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./styles/**/*.{ts,tsx,css}",
    "../../../packages/ui/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
} satisfies Config;

export default config;
