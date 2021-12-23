module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    colors: {
      "teal-400": "#B1DED3",
      "teal-500": "#47C2A4",
      "teal-600": "#35AA8D",
      "rose-500": "#E36E6E",
      "blue-500": "6E78D2",
      // Light mode
      "almostblack": "#222222",
      "background": "#FDFDFD",
      "gray-100": "#F8F8F8",
      "gray-300": "#F0F0F0",
      "gray-500": "#C2C2C2",
      "gray-700": "#5C5C5C",
      "gray-900": "#383838",
      // Dark mode
      "background-dark": "#222222",
      "almostwhite": "#FDFDFD",
      "gray-100-dark": "#383838",
      "gray-300-dark": "#5C5C5C",
      "gray-500-dark": "#C2C2C2",
      "gray-700-dark": "#F0F0F0",
      "gray-900-dark": "#F8F8F8",
      // Dim
      "dim": "#000000",
    },
    opacity: {
      // Dim Opacity (Use with color "dim")
      "dim-light": ".75",
      "dim-dark": ".50",
    },
    fontFamily: {
      sans: ["Noto Sans", "sans-serif"],
    },
    extend: {},
  },
  plugins: [],
};
