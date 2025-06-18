
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.f689bcd3f65c4feba7646b772c8f3cfa',
  appName: 'platform-jobsties',
  webDir: 'dist',
  server: {
    url: 'https://f689bcd3-f65c-4feb-a764-6b772c8f3cfa.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 3000,
      backgroundColor: "#4F46E5",
      showSpinner: false
    }
  }
};

export default config;
