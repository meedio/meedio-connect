import 'promise.withresolvers/auto';
import './main.css';
import './i18n/config';

import ErrorBoundaryComponent from '@shared/components/ErrorBoundaryComponent/ErrorBoundaryComponent';
import { insetZero } from '@shared/utils';
import cx from 'classnames';
import { Suspense } from 'react';
import * as ReactDOM from 'react-dom/client';
import { RouterProvider, Routes, createBrowserRouter } from 'react-router-dom';

import LoadingScreen from 'components/LoadingScreen/LoadingScreen';
import ThemeWrapper from 'components/ThemeWrapper/ThemeWrapper';
import FeatureFlagProvider from 'contexts/FeatureFlagProvider/FeatureFlagProvider';
import { MatrixProvider } from 'contexts/MatrixContext/MatrixContext';
import ModalProvider from 'contexts/ModalProvider/ModalProvider';
import { ToastProvider } from 'contexts/ToastProvider/ToastProvider';
import SingleTabProvider from 'modules/SingleTabGuard/SingleTabProvider';
import routes from 'routes';
import {
  defaultLoggerLevel,
  setLoggerLevel as initLoggers,
} from 'utils/logger';
import { initSentry } from 'utils/sentry/initSentry';
import { setupLogging } from 'utils/utils';

// NOTE: initializing faro
import 'utils/logging/faro';

const setNewViewport = () => {
  if (!navigator.userAgent.includes('iPhone')) return;

  const viewportElement = document.querySelector('[name=viewport]');
  if (!viewportElement) return;

  const contentValue = viewportElement.getAttribute('content');
  viewportElement.setAttribute('content', `${contentValue}, maximum-scale=1`);
};

// NOTE: maximum-scale=1 is needed to disable auto zooming on iphone
document.addEventListener('DOMContentLoaded', setNewViewport);

if (
  import.meta.env.REACT_APP_SENTRY_DSN &&
  import.meta.env.REACT_APP_SENTRY_ENVIRONMENT
)
  initSentry();
initLoggers(defaultLoggerLevel);
setupLogging();

const Root = () => (
  <div className={cx('fixed m-0 p-0', insetZero)}>
    <ErrorBoundaryComponent>
      <Suspense fallback={<LoadingScreen />}>
        <ToastProvider>
          <ThemeWrapper>
            <SingleTabProvider>
              <FeatureFlagProvider>
                <MatrixProvider>
                  <ModalProvider>
                    <Routes>{routes}</Routes>
                  </ModalProvider>
                </MatrixProvider>
              </FeatureFlagProvider>
            </SingleTabProvider>
          </ThemeWrapper>
        </ToastProvider>
      </Suspense>
    </ErrorBoundaryComponent>
  </div>
);

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
const router = createBrowserRouter([{ path: '*', element: <Root /> }]);

root.render(<RouterProvider router={router} />);
