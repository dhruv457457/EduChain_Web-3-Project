module.exports = {
  theme: {
    extend: {
      boxShadow: {
        'custom-purple': '0px 4px 50px rgba(175, 52, 255, 0.25)',
      },
      textShadow: {
        'custom': '0px 4px 50px rgba(175, 52, 255, 0.25)',
      },
      colors: {
        customDarkpurple: "#0E0618",
        customLightPurple: "#800080",
        customSemiPurple: "#1D0A2D",
        customPurple: "#AF34FF",
        customBlue: "#6496FF",
      },
    },
  },
  content: ['./src/**/*.{js,jsx,ts,tsx}'], // Include all your file paths
  plugins: [require('tailwindcss-textshadow'),],
};
