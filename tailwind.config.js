/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#0F1411',
        panel: '#171D19',
        line: '#2A332C',
        gold: '#C8A24A',
        goldLight: '#D9B560',
        muted: '#8A9189',
        faint: '#5A6259',
        cream: '#F4F1EA',
        danger: '#E08E6D',
        success: '#9FCB8D',
      },
    },
  },
  plugins: [],
};
