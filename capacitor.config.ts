import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.haylugar.app',
  appName: 'HayLugar',
  webDir: 'dist',

  // ✅ configuración del servidor para producción
  server: {
    url: 'https://haylugar.com.ar', // dominio productivo (frontend deployado)
    cleartext: false,
    allowNavigation: [
      'haylugar.com.ar',
      '*.haylugar.com.ar',
      'maps.googleapis.com', // para mapas
      'www.google.com',
      '*.googleapis.com'
    ],
  },

  

};

export default config;
