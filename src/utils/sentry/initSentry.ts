import * as Sentry from '@sentry/browser';

export const initSentry = () => {
  const [replaysSessionSampleRate, replaysOnErrorSampleRate] = [0.1, 1];

  Sentry.init({
    dsn: import.meta.env.REACT_APP_SENTRY_DSN,
    release: import.meta.env.REACT_APP_SENTRY_RELEASE,
    environment: import.meta.env.REACT_APP_SENTRY_ENVIRONMENT,
    integrations: [Sentry.replayIntegration({ maskAllText: true })],
    replaysSessionSampleRate,
    replaysOnErrorSampleRate,
    ignoreErrors: [
      'TypeError: Failed to fetch',
      'ConnectionError: fetch failed: Load failed',
      'TypeError: Load failed',
      'TypeError: NetworkError when attempting to fetch resource.',
    ],
  });
};
