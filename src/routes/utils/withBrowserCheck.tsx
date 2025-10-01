import UnsupportedBrowser from 'modules/UnsupportedBrowser/UnsupportedBrowser';
import UnsupportedWebView from 'modules/UnsupportedWebView/UnsupportedWebView';
import { canPlayVideo, isBrowserSupported, isWebRTCSupported, isWebSocketBlocked, isWebView } from 'utils/browsers';
import logger from 'utils/logger';

const withBrowserCheck = (WrappedComponent: React.ComponentType) => {
  const WithBrowserCheckComponent: React.FC = () => {
    if (!isBrowserSupported) {
      logger.info('User using unsupported browser', { isWebView, canPlayVideo, isWebRTCSupported, isWebSocketBlocked });

      if (isWebView) return <UnsupportedWebView />;

      return <UnsupportedBrowser />;
    }

    return <WrappedComponent />;
  };

  return WithBrowserCheckComponent;
};

export default withBrowserCheck;
