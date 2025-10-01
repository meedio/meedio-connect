import { useMaybeRoomContext } from '@livekit/components-react';
import { LocalVideoTrack, RoomEvent, facingModeFromLocalTrack } from 'livekit-client';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { ReactComponent as CameraRotate } from 'assets/icons/CameraRotate.svg';
import { useLiveKitDevicesStateContext } from 'contexts/LiveKitDevicesStateContext/LiveKitDevicesStateContext';
import useToast from 'contexts/ToastProvider/useToast';
import logger from 'utils/logging/faro';

import FooterButton from './FooterButton';

interface LivekitFlipCameraButtonProps {
  localVideoTrack: LocalVideoTrack;
}

const LivekitFlipCameraButton = ({ localVideoTrack }: LivekitFlipCameraButtonProps) => {
  const { pushToast } = useToast();
  const { t } = useTranslation();
  const { setVideoDeviceId } = useLiveKitDevicesStateContext();
  const [isCameraLoading, setIsCameraLoading] = useState(false);
  const room = useMaybeRoomContext();

  const flipCamera = async () => {
    const errorToast = () => pushToast({ title: t('could_not_change_the_camera'), variant: 'info' });

    setIsCameraLoading(true);
    const { facingMode: trackFacingMode, confidence } = facingModeFromLocalTrack(localVideoTrack.mediaStreamTrack);
    //NOTE: videoTrack with blur applied does not have most of the settings from getSettings() function and the confidence returned is low, but the settings are still there in unprocessed track. Default to 'environment' just in case
    const mediaStreamTrack = localVideoTrack.mediaStream?.getVideoTracks();
    const mediaStreamTrackFacingMode = mediaStreamTrack?.length
      ? mediaStreamTrack[0].getSettings().facingMode
      : 'environment';

    const facingMode = confidence === 'high' ? trackFacingMode : mediaStreamTrackFacingMode;
    const targetMode = facingMode === 'environment' ? 'user' : 'environment';

    await localVideoTrack
      .restartTrack({ facingMode: targetMode })
      .then(() => {
        const deviceId = localVideoTrack.mediaStreamTrack?.getSettings().deviceId || '';

        setVideoDeviceId(deviceId);
        if (room) room.emit(RoomEvent.ActiveDeviceChanged, 'videoinput', deviceId);
      })
      .catch((e) => {
        errorToast();
        logger.error('cannot flip camera', e);
      })
      .finally(() => setIsCameraLoading(false));
  };

  return (
    <FooterButton
      onClick={flipCamera}
      tooltipLabel={t('flip_camera')}
      icon={CameraRotate}
      isLoading={isCameraLoading}
      disabled={isCameraLoading}
      aria-label={t('flip_camera')}
    />
  );
};

export default LivekitFlipCameraButton;
