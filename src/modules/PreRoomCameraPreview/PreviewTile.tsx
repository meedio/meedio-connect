import { useModal } from '@ebay/nice-modal-react';
import { useMaybeRoomContext } from '@livekit/components-react';
import Avatar from '@shared/components/Avatar/Avatar';
import ButtonGroup from '@shared/components/ButtonGroup/ButtonGroup';
import cx from 'classnames';
import { PropsWithChildren, useEffect } from 'react';

import { ReactComponent as Mic } from 'assets/icons/Microphone.svg';
import { ReactComponent as MicOff } from 'assets/icons/MicrophoneOff.svg';
import { ReactComponent as Settings } from 'assets/icons/Settings.svg';
import { ReactComponent as Video } from 'assets/icons/Video.svg';
import { ReactComponent as VideoOff } from 'assets/icons/VideoOff.svg';
import AnimatedTile from 'components/AnimatedTile';
import LivekitFlipCameraButton from 'components/LivekitFlipCameraButton';
import NoVideo from 'components/NoVideo';
import StatusLabel from 'components/StatusLabel/StatusLabel';
import VideoEffectsButton from 'components/VideoEffectsButton/VideoEffectsButton';
import { useLiveKitDevicesStateContext } from 'contexts/LiveKitDevicesStateContext/LiveKitDevicesStateContext';
import { useTrackContext } from 'contexts/TrackContext/TrackContext';
import { ChildrenProperties } from 'contexts/VideoGridContext/utils';
import useLocalVideoPreview from 'hooks/useLocalVideoPreview';
import LivekitMediaDevicesSettingsModal from 'modules/LivekitMediaDevicesSettingsModal/LivekitMediaDevicesSettingsModal';
import { getIsMobile } from 'utils/browsers';
import { ControlButtonWithLogging } from 'utils/logging/buttonsWithLogging';
import { hasFacingModeSupport } from 'utils/tracks/utils';

import LivekitTrackToggle from './LivekitTrackToggle';

// import LivekitBlurButton from '../LivekitBlurButton/LivekitBlurButton';

const PreviewTile = (props: PropsWithChildren<ChildrenProperties>) => {
  const { isVideoEnabled, isAudioEnabled } = useLiveKitDevicesStateContext();
  // const { isCameraInUse } = useDevicePermissionsContext();
  const { shouldMirrorVideo, internalVideoRef, shouldHideVideo, hasAudioDevices, hasVideoDevices } =
    useLocalVideoPreview();
  const { show, remove } = useModal(LivekitMediaDevicesSettingsModal);
  const room = useMaybeRoomContext();
  // const { isEnabled } = useFeatureFlagContext();
  const { videoTrack } = useTrackContext();

  const isFacingModeSupported = hasFacingModeSupport(videoTrack?.mediaStream);
  const isSfuBlurEnabled = !getIsMobile();
  // const isVideoToggleDisabled = !hasVideoDevices || isCameraInUse;

  const displayDeviceSettingsModal = () => show({ room });

  useEffect(() => remove, [remove]);

  return (
    <AnimatedTile {...props}>
      <StatusLabel
        className="absolute top-2 mx-2"
        isVideoOn={isVideoEnabled && hasVideoDevices}
        isAudioOn={isAudioEnabled && hasAudioDevices}
        isAcquiringTracks={false}
      />
      {shouldHideVideo ? (
        <NoVideo>
          <Avatar size="lg" className="relative" />
        </NoVideo>
      ) : (
        <video
          ref={internalVideoRef}
          muted
          autoPlay
          playsInline
          className={cx('!h-full !w-full object-cover', { '-scale-x-1': shouldMirrorVideo })}
        />
      )}
      <div className="absolute bottom-2 left-0 right-0 z-50 flex justify-center space-x-2">
        <ButtonGroup hasDivider={false}>
          <LivekitTrackToggle
            kind="videoinput"
            offIcon={VideoOff}
            onIcon={Video}
            data-component-name="video LivekitTrackToggle"
          />
          <LivekitTrackToggle
            kind="audioinput"
            offIcon={MicOff}
            disabled={!hasAudioDevices}
            onIcon={Mic}
            data-component-name="audio LivekitTrackToggle"
          />
          {isFacingModeSupported && videoTrack && <LivekitFlipCameraButton localVideoTrack={videoTrack} />}
        </ButtonGroup>
        <ButtonGroup hasDivider={false}>
          {isSfuBlurEnabled && <VideoEffectsButton isPreRoom />}
          <ControlButtonWithLogging onClick={displayDeviceSettingsModal} data-component-name="Settings button">
            <Settings className="stroke-1.5 h-6 w-6 stroke-white" />
          </ControlButtonWithLogging>
        </ButtonGroup>
      </div>
    </AnimatedTile>
  );
};

export default PreviewTile;
