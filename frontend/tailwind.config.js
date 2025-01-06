/** @type {import('tailwindcss').Config} */
export default {
 content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#E63946', // Replace with your desired primary color
        secondary: '#457B9D', // Secondary color
        accent: '#1D3557', // Optional accent color
      },
    },
  },
  plugins: [],
}


