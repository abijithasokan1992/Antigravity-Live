// tailwind.config.ts
import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class', // enable class based dark mode
  content: ['./src/**/*.{js,ts,jsx,tsx}', './app/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        zinc: require('tailwindcss/colors').zinc,
        cyan: require('tailwindcss/colors').cyan,
      },
    },
  },
  plugins: [],
};
export default config;
