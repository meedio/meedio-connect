import { LocalAudioTrack, LocalVideoTrack } from 'livekit-client';
import { useCallback, useEffect } from 'react';

import { useLiveKitDevicesStateContext } from 'contexts/LiveKitDevicesStateContext/LiveKitDevicesStateContext';
import { getHasDefaultDevice } from 'hooks/useLivekitPermissions/utils';
import { SetState } from 'utils/types';

interface UseInitializeDeviceIdsProps {
  audioTrack?: LocalAudioTrack;
  videoTrack?: LocalVideoTrack;
}

const useInitializeDeviceIds = ({ audioTrack, videoTrack }: UseInitializeDeviceIdsProps) => {
  const { videoDeviceId, audioDeviceId, setAudioDeviceId, setVideoDeviceId } = useLiveKitDevicesStateContext();

  const initializeDeviceId = useCallback(
    async (track: LocalAudioTrack | LocalVideoTrack, setDeviceId: SetState<string>) => {
      const deviceId = (await track.getDeviceId()) || track.constraints.deviceId?.toString();

      if (track && deviceId) {
        if (track.kind === 'audio') {
          const hasDefaultDevice = await getHasDefaultDevice();
          if (hasDefaultDevice) return setDeviceId('default');
        }
        setDeviceId(deviceId);
      }
    },
    []
  );

  useEffect(() => {
    if (audioTrack && !audioDeviceId) initializeDeviceId(audioTrack, setAudioDeviceId);
  }, [audioDeviceId, audioTrack, setAudioDeviceId, initializeDeviceId]);

  useEffect(() => {
    if (videoTrack && !videoDeviceId) initializeDeviceId(videoTrack, setVideoDeviceId);
  }, [videoDeviceId, videoTrack, setVideoDeviceId, initializeDeviceId]);
};

export default useInitializeDeviceIds;
