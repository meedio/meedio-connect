import { TFunction } from 'i18next';

import { ReactComponent as MicrophoneOff } from 'assets/icons/MicrophoneOff.svg';
import { ReactComponent as StatusFailed } from 'assets/icons/StatusFailed.svg';
import { ReactComponent as StatusSuccess } from 'assets/icons/StatusSuccess.svg';
import { ReactComponent as StatusWarning } from 'assets/icons/StatusWarning.svg';
import { ReactComponent as VideoOff } from 'assets/icons/VideoOff.svg';
import { FailureLevelsEnum } from 'pages/DiagnosticsPage/utils';
import { IconType } from 'utils/types';

import { StreamDiagnosticsEnum } from './utils';

type ItemStatus = {
  icon: IconType;
  statusLabel: string;
};

export type DiagnosticItem = {
  id: StreamDiagnosticsEnum;
  name: string;
  subtitle: string;
  failureLevel: FailureLevelsEnum;
  statuses: {
    failed: ItemStatus;
    success: ItemStatus;
  };
  inProgressLabel: string;
};

const getStreamDiagnosticsItems = (t: TFunction): DiagnosticItem[] => {
  const defaultSuccessStatus = { icon: StatusSuccess, statusLabel: t('success') };
  const defaultStatuses = {
    failed: { icon: StatusFailed, statusLabel: t('unsuccessful') },
    success: defaultSuccessStatus,
  };

  return [
    {
      id: StreamDiagnosticsEnum.WEBSOCKET,
      name: t('websocket'),
      subtitle: t('diagnostics_descriptions.websocket'),
      failureLevel: FailureLevelsEnum.CRITICAL,
      statuses: defaultStatuses,
      inProgressLabel: t('testing', { test: t('websocket') }),
    },
    {
      id: StreamDiagnosticsEnum.WEBRTC,
      name: t('webrtc'),
      subtitle: t('diagnostics_descriptions.webrtc'),
      failureLevel: FailureLevelsEnum.CRITICAL,
      statuses: defaultStatuses,
      inProgressLabel: t('testing', { test: t('webrtc') }),
    },
    {
      id: StreamDiagnosticsEnum.TURN,
      name: t('turn'),
      subtitle: t('diagnostics_descriptions.turn'),
      failureLevel: FailureLevelsEnum.CRITICAL,
      statuses: defaultStatuses,
      inProgressLabel: t('testing', { test: t('turn') }),
    },
    {
      id: StreamDiagnosticsEnum.AUDIO_OUTPUT,
      name: t('audiooutput'),
      subtitle: t('diagnostics_descriptions.audio_output'),
      inProgressLabel: t('testing', { test: t('audiooutput') }),
      statuses: {
        failed: { icon: StatusFailed, statusLabel: t('audio_output_not_received') },
        success: { icon: StatusSuccess, statusLabel: t('audio_output_received') },
      },
      failureLevel: FailureLevelsEnum.CRITICAL,
    },
    {
      id: StreamDiagnosticsEnum.VIDEO_OUTPUT,
      name: t('video_output'),
      subtitle: t('diagnostics_descriptions.video_output'),
      inProgressLabel: t('testing', { test: t('video_output') }),
      statuses: {
        failed: { icon: StatusFailed, statusLabel: t('video_output_not_received') },
        success: { icon: StatusSuccess, statusLabel: t('video_output_received') },
      },
      failureLevel: FailureLevelsEnum.CRITICAL,
    },
    {
      id: StreamDiagnosticsEnum.AUDIO,
      name: t('audioinput'),
      subtitle: t('diagnostics_descriptions.audio'),
      inProgressLabel: t('testing', { test: t('audioinput') }),
      statuses: {
        failed: { icon: MicrophoneOff, statusLabel: t('audio_not_received') },
        success: { icon: StatusSuccess, statusLabel: t('audio_received') },
      },
      failureLevel: FailureLevelsEnum.CRITICAL,
    },
    {
      id: StreamDiagnosticsEnum.VIDEO,
      name: t('videoinput'),
      subtitle: t('diagnostics_descriptions.video'),
      inProgressLabel: t('testing', { test: t('videoinput') }),
      statuses: {
        failed: { icon: VideoOff, statusLabel: t('video_not_received') },
        success: { icon: StatusSuccess, statusLabel: t('video_received') },
      },
      failureLevel: FailureLevelsEnum.CRITICAL,
    },
    {
      id: StreamDiagnosticsEnum.SCREEN_SHARING,
      name: t('screen_sharing'),
      subtitle: t('diagnostics_descriptions.screen_sharing'),
      inProgressLabel: t('testing', { test: t('screen_sharing') }),
      statuses: {
        failed: { icon: StatusWarning, statusLabel: t('unsuccessful') },
        success: defaultSuccessStatus,
      },
      failureLevel: FailureLevelsEnum.WARNING,
    },
    {
      id: StreamDiagnosticsEnum.RECONNECTION,
      name: t('reconnection'),
      subtitle: t('diagnostics_descriptions.reconnection'),
      inProgressLabel: t('testing', { test: t('reconnection') }),
      statuses: {
        failed: { icon: StatusWarning, statusLabel: t('unsuccessful') },
        success: defaultSuccessStatus,
      },
      failureLevel: FailureLevelsEnum.WARNING,
    },
  ];
};

export default getStreamDiagnosticsItems;
