/** @type {import('tailwindcss').Config} */
export default {
  // Stratégie "class" : le thème sombre est activé en ajoutant la classe `dark`
  // sur l'élément <html> (piloté par le hook useTheme).
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {},
  },
  plugins: [],
};
