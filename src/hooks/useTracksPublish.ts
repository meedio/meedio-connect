import { Room, Track } from 'livekit-client';

import { useLiveKitDevicesStateContext } from 'contexts/LiveKitDevicesStateContext/LiveKitDevicesStateContext';
import { useTrackContext } from 'contexts/TrackContext/TrackContext';

const useTracksPublish = (room: Room) => {
  const { isVideoEnabled, isAudioEnabled } = useLiveKitDevicesStateContext();
  const { audioTrack, videoTrack } = useTrackContext();

  const publishTracks = () => {
    const publications = room.localParticipant.getTrackPublications();
    const hasVideoPublication = publications.some(({ kind }) => kind === Track.Kind.Video);
    const hasAudioPublication = publications.some(({ kind }) => kind === Track.Kind.Audio);

    if (videoTrack && isVideoEnabled && !hasVideoPublication) room.localParticipant.publishTrack(videoTrack);
    if (audioTrack && isAudioEnabled && !hasAudioPublication) room.localParticipant.publishTrack(audioTrack);
  };

  return publishTracks;
};

export default useTracksPublish;
