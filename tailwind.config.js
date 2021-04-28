module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        neutral: {
          gray1: '#1C2C40',
          gray2: '#3C4858',
          gray3: '#5A6679',
          gray4: '#8391A7',
          gray5: '#C0CCDA',
          gray6: '#E5E9F2',
          gray7: '#F1F2F6',
          gray8: '#F9FAFC',
        },
        brand: { darkBlue: '#252C66' },
        accent: {},
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
