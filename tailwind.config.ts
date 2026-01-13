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
        primary: {
          50: '#FFF0F7',
          100: '#FFE0F0',
          200: '#FFCCE3',
          300: '#FFB3D7',
          400: '#FF99CC',
          500: '#FF64A8',
          600: '#FF3D8F',
          700: '#E6006B',
          800: '#B30054',
          900: '#80003C',
        },
        gray: {
          50: '#FAFAFA',
          100: '#F5F5F5',
          200: '#E5E5E5',
          300: '#D4D4D4',
          400: '#A3A3A3',
          500: '#737373',
          600: '#525252',
          700: '#404040',
          800: '#262626',
          900: '#171717',
        }
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      boxShadow: {
        'pink': '0 4px 14px 0 rgba(255, 61, 143, 0.15)',
        'pink-lg': '0 10px 40px 0 rgba(255, 61, 143, 0.25)',
      }
    },
  },
  plugins: [],
};
export default config;
