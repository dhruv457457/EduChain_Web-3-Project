module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'], // Specifies files for Tailwind to scan
  theme: {
    extend: {
      // Box Shadow Customization
      boxShadow: {
        'custom-purple': '0px 4px 50px rgba(175, 52, 255, 0.25)', // Existing custom shadow
        'md-purple': '0px 4px 20px rgba(175, 52, 255, 0.15)', // Added for subtler effects
        'navbar': '0px 2px 10px rgba(0, 0, 0, 0.5)', // For Navbar depth
      },
      // Text Shadow Customization
      textShadow: {
        'custom': '0px 4px 50px rgba(175, 52, 255, 0.25)', // Existing shadow
        'sm': '0px 2px 4px rgba(175, 52, 255, 0.2)', // Added for smaller text effects
      },
      // Colors Customization
      colors: {
        customDarkpurple: "#0E0618", // Dark background (Navbar)
        customLightPurple: "#800080", // Light purple accent
        customSemiPurple: "#1D0A2D", // Semi-dark purple (e.g., mobile menu)
        customPurple: "#AF34FF", // Primary purple (gradients, buttons)
        customBlue: "#6496FF", // Primary blue (gradients, links)
        customBlue2: "#4C8FF5", // Secondary blue (hover states)
        customInput: "#23053B", // Input fields
        customDark: "#11021D", // Darker shade for contrast
        customGray: "#D1D5DB", // Added for text (e.g., alert dismiss button)
      },
      // Font Family Customization
      fontFamily: {
        poppins: ["Poppins", "sans-serif"], // Primary font
      },
      // Animation for fade-in effect (used in alert)
      animation: {
        fadeIn: 'fadeIn 0.5s ease-in-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(-10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [
    require('tailwindcss-textshadow'), // Text shadow plugin
  ],
};