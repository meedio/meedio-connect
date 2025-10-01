import { facingModeFromLocalTrack, LocalAudioTrack, LocalVideoTrack, RemoteVideoTrack } from 'livekit-client';

import { getIsMobile, isFirefox } from 'utils/browsers';

export enum CameraFacingMode {
  FRONT = 'user',
  BACK = 'environment',
}

interface getShouldMirrorVideoProps {
  videoTrack?: RemoteVideoTrack | LocalVideoTrack;
  isScreenShareTile: boolean;
  isLocal: boolean;
}

export const getIsTrackEnded = (track?: LocalVideoTrack | LocalAudioTrack) =>
  track?.mediaStreamTrack.readyState === 'ended';

export const getShouldMirrorVideo = ({
  videoTrack,
  isScreenShareTile,
  isLocal,
}: getShouldMirrorVideoProps): boolean => {
  const facingMode =
    videoTrack instanceof LocalVideoTrack ? facingModeFromLocalTrack(videoTrack).facingMode : undefined;

  return isLocal && !isScreenShareTile && facingMode !== CameraFacingMode.BACK;
};

export const hasFacingModeSupport = (mediaStream?: MediaStream) => {
  // NOTE: firefox for android does not support facingMode, but firefox for iOS does.
  // Also on firefox for desktop we are unable to tell if facingMode is supported
  // so we are disabling facingMode for firefox desktop only
  if (isFirefox && !getIsMobile()) return false;

  if (!mediaStream || !mediaStream.getVideoTracks().length) return false;

  const [track] = mediaStream.getVideoTracks();

  return !!track.getSettings().facingMode;
};

export const getCameraFacingMode = (mediaStream?: MediaStream) => {
  if (!mediaStream) return;

  const [track] = mediaStream.getVideoTracks();
  if (!track) return;

  return track.getSettings().facingMode as CameraFacingMode;
};
