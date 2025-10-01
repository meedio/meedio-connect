import {
  MetaSession,
  ReactIntegration,
  ReactRouterVersion,
  getWebInstrumentations,
  initializeFaro,
} from '@grafana/faro-react';
import * as Sentry from '@sentry/browser';
import { matchRoutes } from 'react-router-dom';

import { logArgsSerializer } from './utils';

const setIdForSentry = (id: string) => Sentry.setTag('faroSessionId', id);
const onSessionChange = (_: MetaSession | null, { id }: MetaSession) => {
  if (id) setIdForSentry(id);
};

const initFaro = () => {
  const faro = initializeFaro({
    url: import.meta.env.REACT_APP_ALLOY_URL,
    apiKey: import.meta.env.REACT_APP_ALLOY_API_KEY,
    app: {
      name: 'connect',
      version: import.meta.env.REACT_APP_SENTRY_RELEASE,
    },
    instrumentations: [
      // Load the default Web instrumentations
      ...getWebInstrumentations({ captureConsole: true, captureConsoleDisabledLevels: [] }),
      new ReactIntegration({ router: { version: ReactRouterVersion.V6_data_router, dependencies: { matchRoutes } } }),
    ],
    beforeSend: (event) => {
      // NOTE: default events like performance, navigation are sending sensitive fields so we should exclude them
      if ('attributes' in event.payload && event.payload?.attributes?.name) event.payload.attributes.name = '';

      // TODO: Remove this at some point
      if ('message' in event.payload && event.payload.message.includes('MatrixError: [400] One time key')) {
        // NOTE: be careful to not log this again, creating a loop
        Sentry.captureException(new Error(event.payload.message));
      }

      return event;
    },
    sessionTracking: { onSessionChange },
    logArgsSerializer,
    batching: {
      enabled: true,
      sendTimeout: 1000,
      itemLimit: 50,
    },
  });

  const sessionId = faro.api.getSession()?.id;
  if (sessionId) setIdForSentry(sessionId);

  return faro;
};

export default initFaro;
