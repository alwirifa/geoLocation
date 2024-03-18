import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        'background': "url('../public/images/background.png')",
        'backgroundTall': "url('../public/images/backgroundTall.png')",
        'photo': "url('../public/images/photo.png')",
      },
      screens: {
        'tallXS2': { 'raw': '(min-height: 400px)' },
        'tallXS': { 'raw': '(min-height: 500px)' },
        'tallSM': { 'raw': '(min-height: 600px)' },
        'tall': { 'raw': '(min-height: 700px)' },
        'tallMD': { 'raw': '(min-height: 800px)' },
        'tallLG': { 'raw': '(min-height: 900px)' },
        'tallXL': { 'raw': '(min-height: 1000px)' },
        'tall2XL': { 'raw': '(min-height: 1300px)' },
        'wXS': { 'raw': '(min-width: 300px)' },
      },
      colors: {
        'purple': '#430098'
      }
    },
  },
  plugins: [],
};
export default config;
