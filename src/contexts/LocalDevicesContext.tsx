import { createContext, PropsWithChildren, useContext, useEffect } from 'react';

import useDevices from 'hooks/useDevices/useDevices';
import useIsMounted from 'hooks/useIsMounted';
import useLocalStorage from 'hooks/useLocalStorage/useLocalStorage';
import constants from 'utils/Constants';
import { SetState } from 'utils/types';

type LocalDevicesContextType = {
  videoInputId: string;
  setVideoInputId: SetState<string>;
  audioInputId: string;
  setAudioInputId: SetState<string>;
  audioOutputId: string;
  setAudioOutputId: SetState<string>;
};

export const LocalDevicesContext = createContext<LocalDevicesContextType | null>(null);

export const LocalDevicesProvider = ({ children }: PropsWithChildren) => {
  const {
    inputs: { video },
    outputs: { audio },
  } = useDevices(true);
  const isMounted = useIsMounted();
  const [videoInputId, setVideoInputId] = useLocalStorage(constants.VIDEO_DEVICE_ID, '', false);
  const [audioInputId, setAudioInputId] = useLocalStorage(constants.AUDIO_INPUT_DEVICE_ID, 'default', false);
  const [audioOutputId, setAudioOutputId] = useLocalStorage('audioOutputId', '');

  useEffect(() => {
    const [videoInput] = video;
    const [audioOutput] = audio;

    if (isMounted()) {
      if (video.length && !videoInputId) setVideoInputId(videoInput.deviceId);
      if (audio.length && !audioOutputId) setAudioOutputId(audioOutput.deviceId);

      const doesVideoInputExist = video.some(({ deviceId }) => deviceId === videoInputId);
      const doesAudioOutputExist = audio.some(({ deviceId }) => deviceId === audioOutputId);

      if (!doesVideoInputExist && video.length) setVideoInputId(videoInput.deviceId);
      if (!doesAudioOutputExist && audio.length) setAudioOutputId(audioOutput.deviceId);
    }
  }, [audio, audioOutputId, isMounted, setAudioOutputId, setVideoInputId, video, videoInputId]);

  const state = { videoInputId, setVideoInputId, audioInputId, setAudioInputId, audioOutputId, setAudioOutputId };

  return <LocalDevicesContext.Provider value={state}>{children}</LocalDevicesContext.Provider>;
};

export function useLocalDevicesContext() {
  const context = useContext(LocalDevicesContext);
  if (!context) throw new Error('useLocalDevicesContext must be used within a LocalDevicesProvider');

  return context;
}
