const constants = {
  COOKIES_VERSION: 'cookiesVersion',
  MATRIX_STORES_VERSION: 'matrixStoresVersion',
  DEFAULT_LANGUAGE: 'en',
  VIDEO_DEVICE_ID: 'videoInputId',
  AUDIO_INPUT_DEVICE_ID: 'audioInputId',
  STORAGE_LANGUAGE_KEY: 'lng',
  VIDEO_STATE: 'isVideoActive',
  AUDIO_STATE: 'isAudioActive',
  IS_SESSION_LOGGED_OUT: 'isSessionLoggedOut',
  SMS_CODE_LENGTH: 6,
  TOOLTIP_GROUP_DELAY: 500,
  QUEUES_FETCH_LIMIT: 15,
  CONSULTATIONS_LIST_LIMIT: 25,
  DEFAULT_NAME: 'Guest',
  DELETED_ROOM_IDS_KEY: 'deletedRooms',
  PARTICIPANT_DETAILS_ID: 'participant-details',
  ZOOM_CONTROLS_ID: 'zoom-controls',
  RECORDING_CONTROLS_ID: 'recording-controls',
  ENABLE_PUSH_NOTIFICATIONS_PROMPT_STATE: 'enableNotificationsPromptBlockedAt',
  REDIRECT_INITIATED: 'redirect-initiated',
  IS_LOCAL_STORAGE_LOGGED_IN: 'isLoggedIn',
  LIVEKIT_SCREEN_SHARING_LIMIT: 1,
  LIVEKIT_CLIENT_ID: 'livekitClientId',
  DEFAULT_COUNTRY_CODE: 'DK',
  MATRIX_URL: 'matrixUrl',
  MATRIX_HOMESERVER_BASE_URL: 'matrixHomeserverBaseUrl',
  MATRIX_LOGIN_URL: 'matrixLoginUrl',
  MAIN_WINDOW_ID: 'main-window-id',
  MAIN_WINDOW_PING: 'main-window-ping',
  SESSION_WINDOW_ID: 'session-window-id',
};

export enum FeatureFlag {
  FEEDBACK_FORM = 'CONNECT_FE_ENABLE_FEEDBACK_FORM_PERM',
  NEW_INVITATIONS_MODAL = 'FE_ENABLE_NEW_INVITATIONS_MODAL_TEMP',
}

export const featureFlagsDisabledByDefault: FeatureFlag[] = [];

export const initialZoomState = {
  tileScale: 1,
  percentX: 0,
  percentY: 0,
};

export const COOKIE_KEY_PREFIX = 'connect';

export const matrixConstants = {
  MX_DEVICE_ID: `${COOKIE_KEY_PREFIX}_matrixDeviceId`,
  MX_USER_ID: `${COOKIE_KEY_PREFIX}_matrixUserId`,
  MX_ACCESS_TOKEN: `${COOKIE_KEY_PREFIX}_matrixAccessToken`,
  MX_DISPLAY_NAME: `${COOKIE_KEY_PREFIX}_matrixDisplayName`,
  MX_LOGGED_IN: `${COOKIE_KEY_PREFIX}_matrixLoggedIn`,
};

export enum MatrixToDeviceEvents {
  ROOM_DUPLICATE_JOIN = 'room_duplicate_join',
  DIRECT_MESSAGE = 'direct_message',
}

export const externalLinks = {
  DOMAIN: '.meedio.me',
  SYSTEM_PREFERENCES: 'x-apple.systempreferences:com.apple.preference.security?Privacy_ScreenCapture',
  CHROME: 'https://www.google.com/chrome',
  SAFARI: 'https://apps.apple.com/no/app/safari',
};

export default constants;
