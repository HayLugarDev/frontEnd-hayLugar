import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.haylugar.app',
  appName: 'HayLugar',
  webDir: 'dist', // donde Vite genera la build
  bundledWebRuntime: false,
  server: {
    androidScheme: 'https'
  }
};

export default config;
