/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./app/**/*.{js,jsx,ts,tsx}" ],
  theme: {
    extend: {
      colors: {
        primary: "#121212",
        secondary: "#D8BFD8",
        text: "#E0E0E0",
      },
      fontFamily: {
        sans: "Poppins",
      },
      screens: {
        lg: "992px",
      },
      listStyleType: {
        disc: "disc",
        decimal: "decimal",
      },
    },
  },
  plugins: [],
};
