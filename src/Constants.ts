const constants = {
  LIVEKIT_CLIENT_ID: 'livekitClientId',
  ROOM_HEADER_ID: 'room-header',
  ROOM_FOOTER_ID: 'room-footer',
  TOOLTIP_GROUP_DELAY: 500,
  LIVEKIT_SCREEN_SHARING_LIMIT: 1,
  ZOOM_CONTROLS_ID: 'zoom-controls',
  PARTICIPANT_DETAILS_ID: 'participant-details',
  MAX_TOPIC_LENGTH: 500,
};

export const externalLinks = {
  SYSTEM_PREFERENCES: 'x-apple.systempreferences:com.apple.preference.security?Privacy_ScreenCapture',
  CHROME: 'https://www.google.com/chrome',
  SAFARI: 'https://apps.apple.com/no/app/safari',
};

export const initialZoomState = {
  tileScale: 1,
  percentX: 0,
  percentY: 0,
};

export default constants;
