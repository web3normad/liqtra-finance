/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
 
    // Or if using `src` directory:
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        jakarta: ['var(--font-jakarta)'],
        inter: ['var(--font-inter)'],
      },
      colors: {
        // Dark mode colors - VS Code inspired
        background: {
          DEFAULT: '#1e1e1e',  // Main dark background
          light: '#f5f7fa',     // Light mode background
          darker: '#252526',    // Darker sections
          darkest: '#2d2d30',   // Darkest sections
        },
        card: {
          DEFAULT: '#252526',   // Card dark mode
          light: '#ffffff',     // Card light mode
          hover: '#2d2d30',     // Card hover state
        },
        primary: {
          green: '#009E60',         // Main green (darker, professional)
          'green-dark': '#007a4d',  // Darker green for hover
          'green-light': '#00b56f', // Lighter green for accents
        },
        success: '#48bb78',
        danger: '#f56565',
        warning: '#ed8936',
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
      },
      animation: {
        'pulse': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [
    function ({ addUtilities }) {
      const newUtilities = {
        '.scrollbar-hide': {
          /* IE and Edge */
          '-ms-overflow-style': 'none',
          /* Firefox */
          'scrollbar-width': 'none',
          /* Safari and Chrome */
          '&::-webkit-scrollbar': {
            display: 'none'
          }
        }
      }
      addUtilities(newUtilities)
    }
  ],
}