import { useRoomContext } from '@livekit/components-react';
import { RemoteTrackPublication, RoomEvent, Track } from 'livekit-client';
import { useEffect } from 'react';

import entrySound from 'assets/sounds/entrySound.mp3';
import { useLiveKitDevicesStateContext } from 'contexts/LiveKitDevicesStateContext/LiveKitDevicesStateContext';
import useSound from 'hooks/useSound/useSound';

const useEntrySound = () => {
  const room = useRoomContext();
  const { audioOutputId } = useLiveKitDevicesStateContext();
  const { playSound } = useSound(entrySound, audioOutputId);

  useEffect(() => {
    const playSoundOnScreenShare = ({ source }: RemoteTrackPublication) => {
      if (source === Track.Source.ScreenShare) playSound();
    };

    room.on(RoomEvent.ParticipantConnected, playSound);
    room.on(RoomEvent.TrackPublished, playSoundOnScreenShare);

    return () => {
      room.off(RoomEvent.ParticipantConnected, playSound);
      room.off(RoomEvent.TrackPublished, playSoundOnScreenShare);
    };
  }, [playSound, room]);
};

export default useEntrySound;
