module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      boxShadow: {
        'custom-purple': '0px 4px 50px rgba(128, 0, 128, 0.25)',
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
        background: "#000000",
        surface: "#0d1117",
        foreground: "#e5e7eb",
        muted: "#9ca3af",
        border: "#2c2f36",
        primary: "#3b82f6",
        primary_hover: "#93c5fd",
        primary_hover1: "#2563eb",
        secondary: "#94a3b8",
        success: "#10b981",
        error: "#ef4444"


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
         'spin-slow': 'spin 3s linear infinite',
        'spin-medium': 'spin 2s linear infinite reverse',
        'spin-fast': 'spin 1s linear infinite',
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


