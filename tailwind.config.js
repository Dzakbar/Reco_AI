/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
    "./lib/**/*.{js,jsx}"
  ],
  theme: {
    extend: {
      colors: {
        leaf: {
          50: "#f3faf4",
          100: "#dff3e2",
          500: "#2f9b55",
          600: "#237a41",
          900: "#153b24"
        },
        ink: "#122016"
      },
      boxShadow: {
        soft: "0 18px 50px rgba(18, 32, 22, 0.10)",
        glass: "0 8px 32px 0 rgba(31, 38, 135, 0.07)"
      },
      keyframes: {
        scan: {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(100%)" }
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" }
        }
      },
      animation: {
        scan: "scan 2s ease-in-out infinite",
        float: "float 4s ease-in-out infinite"
      }
    }
  },
  plugins: []
};
