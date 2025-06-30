module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#2C3E50',    // Navy Blue
        secondary: '#F5B041',  // Gold
        accent: '#ECF0F1',     // Soft Gray
        text: '#333333',       // Dark Gray
        cta: '#E74C3C',        // Coral
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}
