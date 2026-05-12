import * as Sentry from '@sentry/react-native';

export const navigationIntegration = Sentry.reactNavigationIntegration();

Sentry.init({
  dsn: process.env.EXPO_PUBLIC_SENTRY_DSN,
  environment: process.env.EXPO_PUBLIC_ENV ?? 'development',
  tracesSampleRate: 1.0,
  profilesSampleRate: 1.0,
  enableAutoSessionTracking: true,
  attachStacktrace: true,
  debug: __DEV__,
  integrations: [navigationIntegration],
});
