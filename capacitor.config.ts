import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.production.panic.minesweeper',
  appName: 'MineSweeper',
  webDir: 'build',
  server: {
    androidScheme: 'https'
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      launchAutoHide: true,
      layoutName: "launch_screen",
      useDialog: true,
      splashFullScreen: true,
      splashImmersive: true,
    }
  }
};

export default config;
