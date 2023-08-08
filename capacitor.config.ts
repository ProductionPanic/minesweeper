import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.production.panic',
  appName: 'PanicApp',
  webDir: 'build',
  server: {
    androidScheme: 'https'
  }
};

export default config;
