module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: '#2C3E50',    // Navy Blue
        secondary: '#F5B041',  // Gold
        accent: '#ECF0F1',     // Soft Gray
        text: '#333333',       // Dark Gray
        cta: '#E74C3C',        // Coral
        // High Contrast Colors
        'hc-bg': '#000000',
        'hc-text': '#FFFFFF',
        'hc-primary': '#FFFF00',
        'hc-secondary': '#00FFFF',
        'hc-accent': '#FF00FF',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}
