import * as Sentry from '@sentry/browser';
import { ConnectionState, LogLevel, setLogLevel } from 'livekit-client';
import { FieldValues } from 'react-hook-form';

import i18n from 'i18n/config';
import faroLogger from 'utils/logging/faro';

export const getIsDeviceBlockedBySystem = (error: Error) => {
  const systemErrorMessages = [
    'system',
    'The object can not be found here',
    'Failed to allocate', // NOTE: this comes from Windows Firefox
  ];

  return systemErrorMessages.some((msg) => error.message.includes(msg));
};

export const getIsCameraInUse = (error: Error) => {
  const cameraInUseErrorMessages = ['Could not start video source', 'Starting videoinput failed', 'Device in use'];

  return (
    cameraInUseErrorMessages.some((msg) => error.message.includes(msg)) || error.name === 'CouldNotStartVideoSource'
  );
};

export const getIsPermissionsDeniedByUser = (error: Error) => {
  const systemErrorMessages = ['Permission denied', 'The request is not allowed by the user agent'];

  return systemErrorMessages.some((msg) => error.message.includes(msg));
};

export enum MediaDeviceKind {
  AUDIO_INPUT = 'audioinput',
  AUDIO_OUTPUT = 'audiooutput',
  VIDEO_INPUT = 'videoinput',
}

export const openExternalWindow = (url: string) => window.open(url, '_blank', 'noopener,noreferrer');
export const getFormError = (errors: FieldValues, field: keyof typeof errors) => errors[field]?.message;
export const getCleanPathname = () => window.location.pathname.replace(/\/+$/, '');

export const getIsConnectedToSfu = (connectionState: ConnectionState) =>
  [ConnectionState.Connected, ConnectionState.Reconnecting, ConnectionState.SignalReconnecting].includes(
    connectionState,
  );

const ZOOM_CONTROLS_WIDTH_THRESHOLD = 190;
const ZOOM_CONTROLS_WITH_BUTTON_WIDTH_THRESHOLD = ZOOM_CONTROLS_WIDTH_THRESHOLD + 44;

export const getZoomControlsVideoThreshold = (hasVideoModeBtn: boolean) =>
  hasVideoModeBtn ? ZOOM_CONTROLS_WITH_BUTTON_WIDTH_THRESHOLD : ZOOM_CONTROLS_WIDTH_THRESHOLD;

export const isDevelopment = import.meta.env.MODE === 'development';

export const setupLogging = () => {
  // Enable all logs for now
  setLogLevel(LogLevel.debug);
  // if (isDevelopment) return setLogLevel(LogLevel.debug);

  // setLogLevel(LogLevel.warn);
  // setLogLevel(LogLevel.debug, LoggerNames.Room); // A lot of useful room events
  // setLogLevel(LogLevel.debug, LoggerNames.PCManager); // Might be important to track the connection flow
};

type SentryDebugProperties = Record<string, unknown>;

export const logAndSendToSentry = (message: string, sentryDebugProperties?: SentryDebugProperties) => {
  faroLogger.error(message, sentryDebugProperties);
  Sentry.captureException(new Error(message), { extra: sentryDebugProperties });
};

export const adjustElementsPositioning = (inputElement: Element, pickerElement: HTMLElement) => {
  const inputRect = inputElement.getBoundingClientRect();
  const [viewportHeight] = [window.innerHeight];
  const pickerHeight = pickerElement.offsetHeight;

  let top = inputRect.bottom + 8; // Default: below the input

  if (top + pickerHeight > viewportHeight) {
    // If it doesn't fit below, move it above the input
    top = Math.max(inputRect.top - pickerHeight - 8, 8); // Ensure it doesn't go off-screen
  }

  pickerElement.style.top = `${top}px`;
  pickerElement.style.left = `${Math.max(inputRect.left, 8)}px`;
};

type EnumLike = { [key: string]: string | number };

export const getIsLastEnumValue = <T extends EnumLike>(value: T[keyof T], enumType: T): boolean => {
  const enumValues = Object.values(enumType);

  if (!enumValues.length || !enumValues.includes(value)) return false;

  return value === enumValues[enumValues.length - 1];
};

export const filterArrayByKeyValue = <T>(array: T[], key: keyof T, value: T[typeof key]) =>
  array.filter((item) => item[key] === value);

export const getConditionalOption = <T>(condition: boolean, option: T): T[] => (condition ? [option] : []);

export const convertMsToTranslatedTime = (ms: number): { long: string; short: string } => {
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const units: Array<{
    value: number;
    longSuffix: string;
    shortSuffix: string;
  }> = [];

  if (hours > 0)
    units.push({
      value: hours,
      longSuffix: i18n.t('hour', { count: hours }),
      shortSuffix: 'h',
    });
  if (minutes > 0)
    units.push({
      value: minutes,
      longSuffix: i18n.t('minute', { count: minutes }),
      shortSuffix: 'm',
    });
  if (seconds > 0 || units.length === 0) {
    units.push({
      value: seconds,
      longSuffix: i18n.t('second', { count: seconds }),
      shortSuffix: 's',
    });
  }

  const long = units.map((unit) => `${unit.longSuffix}`).join(' ');
  const short = units.map((unit) => `${unit.value}${unit.shortSuffix}`).join(' ');

  return { long, short };
};
