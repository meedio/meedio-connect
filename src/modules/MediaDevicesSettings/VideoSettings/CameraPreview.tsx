import { useMaybeRoomContext } from '@livekit/components-react';
import cx from 'classnames';
import { Track } from 'livekit-client';
import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';

import NoVideo from 'components/NoVideo';
import { CameraFacingMode, getCameraFacingMode } from 'utils/tracks/utils';

import { useMediaDevicesSettingsContext } from '../MediaDevicesSettingsContext';

type CameraPreviewProps = { camOffExplanation?: string };

const containerRadius = 'rounded-2xl';

const CameraPreview = ({ camOffExplanation }: CameraPreviewProps) => {
  const { t } = useTranslation();
  const { handleVideoChange, mediaStream, isVideoEnabled } = useMediaDevicesSettingsContext();
  const videoRef = useRef<HTMLVideoElement>(null);
  const facingMode = getCameraFacingMode(mediaStream);
  const shouldMirrorVideo = facingMode !== CameraFacingMode.BACK;
  const room = useMaybeRoomContext();

  useEffect(() => {
    handleVideoChange(videoRef);
    const videoElement = videoRef.current;

    return () => {
      if (videoElement) videoElement.srcObject = null;
    };
  }, [handleVideoChange, isVideoEnabled, mediaStream]);

  useEffect(() => {
    //NOTE: Attach camera to preview when joined meeting without cam and turns it on in settings
    if (isVideoEnabled && !mediaStream && room && videoRef.current) {
      const track = room.localParticipant.getTrackPublication(Track.Source.Camera)?.videoTrack;
      track?.attach(videoRef.current);
    }
  }, [isVideoEnabled, mediaStream, room]);

  return (
    <div className={cx('bg-gray-20 h-[260px] w-full', containerRadius)}>
      {!isVideoEnabled ? (
        <NoVideo>
          <span className="text-size-md m-4 text-center">
            {camOffExplanation && !mediaStream ? camOffExplanation : t('preview_cam_off')}
          </span>
        </NoVideo>
      ) : (
        <video
          ref={videoRef}
          muted
          autoPlay
          playsInline
          className={cx('touch-auto h-full w-full object-cover', containerRadius, {
            '-scale-x-1': shouldMirrorVideo,
          })}
        />
      )}
    </div>
  );
};

export default CameraPreview;
