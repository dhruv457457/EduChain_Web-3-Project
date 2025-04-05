module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      boxShadow: {
        'custom-purple': '0px 4px 50px rgba(175, 52, 255, 0.25)',
        'md-purple': '0px 4px 20px rgba(175, 52, 255, 0.15)',
        'navbar': '0px 2px 10px rgba(0, 0, 0, 0.5)',
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.2)', // glassmorphism
        'soft': '0px 4px 20px rgba(255, 255, 255, 0.05)', // soft white glow
      },
      textShadow: {
        'custom': '0px 4px 50px rgba(175, 52, 255, 0.25)',
        'sm': '0px 2px 4px rgba(175, 52, 255, 0.2)',
        'glow': '0px 0px 6px rgba(175, 52, 255, 0.4)',
      },
      colors: {
        customDarkpurple: "#0E0618",
        customLightPurple: "#800080",
        customSemiPurple: "#1D0A2D",
        customPurple: "#AF34FF",
        customBlue: "#6496FF",
        customBlue2: "#4C8FF5",
        customInput: "#23053B",
        customDark: "#11021D",
        customGray: "#D1D5DB",
        customNeonGreen: "#39FF14",
        customNeonPink: "#FF44CC",
        
      },
      fontFamily: {
        poppins: ["Poppins", "sans-serif"],
        orbitron: ["Orbitron", "sans-serif"], // futuristic
      },
      animation: {
        fadeIn: 'fadeIn 0.5s ease-in-out',
        slideUp: 'slideUp 0.6s ease-out',
        zoomIn: 'zoomIn 0.5s ease-in-out',
        underlineGrow: 'underlineGrow 0.4s ease-out forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(-10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          '0%': { opacity: 0, transform: 'translateY(40px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
        zoomIn: {
          '0%': { opacity: 0, transform: 'scale(0.9)' },
          '100%': { opacity: 1, transform: 'scale(1)' },
        },
        underlineGrow: {
          '0%': { width: '0%' },
          '100%': { width: '100%' },
        },
      },
    },
  },
  plugins: [
    require('tailwindcss-textshadow'),
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
};
