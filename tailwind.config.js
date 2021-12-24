module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    colors: {
      "teal-400": "#B1DED3",
      "teal-500": "#47C2A4",
      "teal-600": "#35AA8D",
      rose: "#E36E6E",
      blue: "6E78D2",
      "almost-white": "#FDFDFD",
      "almost-black": "#222222",
      "gray-100": "#F8F8F8",
      "gray-200": "#F0F0F0",
      "gray-300": "#C2C2C2",
      "gray-400": "#5C5C5C",
    },
    fontFamily: {
      sans: ["Noto Sans", "sans-serif"],
    },
    extend: {},
  },
  plugins: [],
  corePlugins: {
    outline: false,
  },
};
