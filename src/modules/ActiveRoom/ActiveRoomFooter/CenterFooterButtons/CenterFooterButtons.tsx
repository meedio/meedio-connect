import { useLocalParticipant, useMaybeRoomContext, useMediaDeviceSelect } from '@livekit/components-react';
import ButtonGroup from '@shared/components/ButtonGroup/ButtonGroup';
import { Track } from 'livekit-client';
import { useTranslation } from 'react-i18next';

import { ReactComponent as Mic } from 'assets/icons/Microphone.svg';
import { ReactComponent as MicOff } from 'assets/icons/MicrophoneOff.svg';
import { ReactComponent as Video } from 'assets/icons/Video.svg';
import { ReactComponent as VideoOff } from 'assets/icons/VideoOff.svg';
import LivekitFlipCameraButton from 'components/LivekitFlipCameraButton';
import VideoEffectsButton from 'components/VideoEffectsButton/VideoEffectsButton';
import { useDevicePermissionsContext } from 'contexts/DevicePermissionsProvider/useDevicePermissionsContext';
import { useTrackContext } from 'contexts/TrackContext/TrackContext';
import { getIsMobile } from 'utils/browsers';
import { hasFacingModeSupport } from 'utils/tracks/utils';

import DeviceControl from './DeviceControl';
import HangupButton from './HangupButton';
import SettingsButton from './SettingsButton/SettingsButton';

const CenterFooterButtons = () => {
  const { t } = useTranslation();
  const room = useMaybeRoomContext();
  const { hasCameraPermissions, hasMicrophonePermissions, isCameraInUse } = useDevicePermissionsContext();
  const { localParticipant } = useLocalParticipant();
  const { videoTrack } = useTrackContext();
  const videoDevices = useMediaDeviceSelect({ kind: 'videoinput', requestPermissions: hasCameraPermissions });
  const audioDevices = useMediaDeviceSelect({ kind: 'audioinput', requestPermissions: hasMicrophonePermissions });

  const hasVideoDevices = !!videoDevices.devices.length && hasCameraPermissions;
  const hasAudioDevices = !!audioDevices.devices.length && hasMicrophonePermissions;

  const { isCameraEnabled, isMicrophoneEnabled } = localParticipant;
  const localParticipantVideoTrack = room?.localParticipant?.getTrackPublication(Track.Source.Camera)?.videoTrack;
  const localVideoTrack = localParticipantVideoTrack || videoTrack;
  const isFacingModeSupported = hasFacingModeSupport(localVideoTrack?.mediaStream);
  const isSfuBlurEnabled = !getIsMobile();

  return (
    <div className="md:w-unset flex w-full flex-row justify-center space-x-2">
      <ButtonGroup className="items-center" supportTheme>
        <DeviceControl
          // NOTE: need to rerender if permissions changed
          key={String(hasCameraPermissions)}
          kind="videoinput"
          iconOn={Video}
          iconOff={VideoOff}
          aria-label={t('camera')}
          tooltipLabel={isCameraEnabled ? t('turn_camera_off') : t('turn_camera_on')}
          disabled={!hasVideoDevices || isCameraInUse}
        />
        <DeviceControl
          // NOTE: need to rerender if permissions changed
          key={String(hasMicrophonePermissions)}
          kind="audioinput"
          iconOn={Mic}
          iconOff={MicOff}
          aria-label={t('microphone')}
          tooltipLabel={isMicrophoneEnabled ? t('turn_microphone_off') : t('turn_microphone_on')}
          disabled={!hasAudioDevices}
        />
        {isFacingModeSupported && localVideoTrack && <LivekitFlipCameraButton localVideoTrack={localVideoTrack} />}
      </ButtonGroup>
      <ButtonGroup supportTheme hasDivider={false} className="!space-x-0 md:!space-x-1">
        {isSfuBlurEnabled && <VideoEffectsButton videoTrack={localParticipantVideoTrack} />}
        <SettingsButton />
      </ButtonGroup>
      <HangupButton />
    </div>
  );
};

export default CenterFooterButtons;
