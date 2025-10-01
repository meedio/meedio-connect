import { useEffect } from 'react';

import { useSimpleRoomContext } from 'contexts/SimpleRoomContext/useSimpleRoomContext';
import { ConnectionStatus } from 'contexts/SfuConnectionStateProvider/SfuConnectionStateProvider';
import useSfuConnectionStateContext from 'contexts/SfuConnectionStateProvider/useSfuConnectionStateContext';

type UseLivekitActiveDeviceSyncProps = {
  videoDeviceId: string;
  audioDeviceId: string;
  audioOutputId: string;
};

const useLivekitActiveDeviceSync = ({
  videoDeviceId,
  audioDeviceId,
  audioOutputId,
}: UseLivekitActiveDeviceSyncProps) => {
  const { room } = useSimpleRoomContext();
  const { connectionStatus } = useSfuConnectionStateContext();

  // We need to have a correct active device map in the pre-meeting to be able to correctly display device change toasts later
  useEffect(() => {
    if (connectionStatus === ConnectionStatus.CONNECTED) return;

    const devices: { kind: MediaDeviceKind; id: string }[] = [
      { kind: 'videoinput', id: videoDeviceId },
      { kind: 'audioinput', id: audioDeviceId },
      { kind: 'audiooutput', id: audioOutputId },
    ];

    devices.forEach(({ kind, id }) => {
      if (id !== room.localParticipant.activeDeviceMap.get(kind))
        room.localParticipant.activeDeviceMap.set(kind, id);
    });
  }, [
    audioDeviceId,
    audioOutputId,
    connectionStatus,
    room.localParticipant.activeDeviceMap,
    videoDeviceId,
  ]);
};

export default useLivekitActiveDeviceSync;
