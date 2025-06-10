import flowbite from 'flowbite/plugin';

export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
    "./node_modules/flowbite/**/*.js"],
  theme: {
    extend: {
      colors: {
        primary: '#0079C1', // Azul HayLugAR
        secondary: '#F4F4F4', // Gris Claro Moderno
        accent: '#FFC72C', // Amarillo HayLugAR
        dark: '#2C2C2C', // Gris Oscuro Moderno
        textPrimary: '#1E1E1E', // Negro Suave para textos
      },
      keyframes: {
        'ping-once': {
          '0%': { transform: 'scale(1)', opacity: '1' },
          '50%': { transform: 'scale(1.3)', opacity: '0.75' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
      animation: {
        'ping-once': 'ping-once 0.4s ease-in-out',
      },
    },
  },
  plugins: [flowbite],
};