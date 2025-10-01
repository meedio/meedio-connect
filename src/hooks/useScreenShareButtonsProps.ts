import { useModal } from '@ebay/nice-modal-react';
import { useLocalParticipant } from '@livekit/components-react';
import { Track } from 'livekit-client';
import { useEffect } from 'react';

import StopScreenSharePopup, { StopScreenSharePopupProps } from 'components/StopScreenSharePopup/StopScreenSharePopup';

const useScreenShareButtonsProps = () => {
  const stopScreenSharePopup = useModal(StopScreenSharePopup);
  const { localParticipant } = useLocalParticipant();

  const getLocalScreenShareTrack = () => {
    const track = localParticipant
      .getTrackPublications()
      .find((t) => t.source === Track.Source.ScreenShare && t.videoTrack?.mediaStream);
    return track?.videoTrack?.mediaStream;
  };

  const localScreenShareStream = getLocalScreenShareTrack();
  const hasScreenShare = !!localScreenShareStream;

  const showStopScreenShare = () => {
    if (!localScreenShareStream) return;

    const stopTrack = () => {
      const videoTrack = localScreenShareStream.getVideoTracks()[0];
      if (videoTrack) {
        localParticipant.unpublishTrack(videoTrack);
      }
    };

    const stopScreenShareProps: StopScreenSharePopupProps = {
      stopTrack,
      screenMediaStream: localScreenShareStream,
    };

    stopScreenSharePopup.show(stopScreenShareProps);
  };
  const showStopScreenShareModal = () => showStopScreenShare();

  useEffect(() => {
    if (!hasScreenShare && stopScreenSharePopup.visible) stopScreenSharePopup.remove();
  }, [hasScreenShare, stopScreenSharePopup]);

  return showStopScreenShareModal;
};

export default useScreenShareButtonsProps;
