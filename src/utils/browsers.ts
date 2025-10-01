import UAParser from 'ua-parser-js';

const userAgent = navigator.userAgent;

export const getIsMobile = () => {
  // Check if device is touchscreen
  if ('maxTouchPoints' in navigator) return navigator.maxTouchPoints > 0;

  // Check if device has pointer:coarse
  const mediaQuery = matchMedia('(pointer:coarse)');
  if (mediaQuery.media === '(pointer:coarse)') return mediaQuery.matches;

  if ('orientation' in window) return true; // deprecated, but good fallback

  // Only as a last resort, fall back to user agent sniffing
  return (
    /\b(BlackBerry|webOS|iPhone|IEMobile)\b/i.test(userAgent) ||
    /\b(Android|Windows Phone|iPad|iPod)\b/i.test(userAgent)
  );
};

export const isWebView = /wv/.test(userAgent);
export const canPlayVideo = !!document.createElement('video').canPlayType;
export const isWebSocketBlocked = window.WebSocket.CLOSING !== 2;
export const isWebRTCSupported = !!navigator.mediaDevices && !!window.RTCPeerConnection && !!window.WebSocket;

export const isBrowserSupported = !isWebView && canPlayVideo && isWebRTCSupported && !isWebSocketBlocked;

export const isPermissionsApiSupported = !!navigator.permissions;
export const isScreenSharingSupported = !!navigator.mediaDevices && !!navigator.mediaDevices.getDisplayMedia;
export const isWebPushNotificationSupported =
  'Notification' in window && 'serviceWorker' in navigator && 'PushManager' in window;

export const isFirefox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
export const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

export const getIsIOSUnsupported = () => {
  const parser = new UAParser(navigator.userAgent);

  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
  if (!isIOS) return false;

  const match = navigator.userAgent.match(/OS (\d+)_(\d+)_?(\d+)?/);
  if (!match) return false;

  const iOSVersion = parseInt(match[1], 10);
  const browserName = parser.getBrowser().name || '';
  const isUnsupportedBrowser = /Chrome|Firefox/.test(browserName);

  return iOSVersion < 17 && isUnsupportedBrowser;
};

export const recommendedBrowsers = [
  {
    title: 'Chrome',
    link: 'https://www.google.com/chrome/?brand=BNSD&gclid=Cj0KCQiA5OuNBhCRARIsACgaiqVZfONWKzf7LB7qhMnKfSD4gEs1hRmRc1CRGISWd_zggjN7R4JqnR4aAhhqEALw_wcB&gclsrc=aw.ds',
  },
  {
    title: 'Opera',
    link: 'https://www.opera.com/?utm_campaign=%2300%20-%20WW%20-%20Search%20-%20EN%20-%20Branded&gclid=Cj0KCQiA5OuNBhCRARIsACgaiqVqn0tYlV9KRL_14YbaB64dySh0hhq_mMOXdo98s70HkAqEN5r7gTkaAlnBEALw_wcB',
  },
];
