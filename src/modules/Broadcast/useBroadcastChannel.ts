import { useCallback, useEffect, useMemo } from 'react';

export type BroadcastMessage = {
  type: string;
  payload: Record<string, string>;
};

export enum BroadcastChannels {
  WINDOW_LOCK = 'window-lock-channel',
}

export enum BroadcastActions {
  FORCE_CLAIM = 'force-claim',
}

const useBroadcastChannel = (channelName: BroadcastChannels, handleMessage: (msg: BroadcastMessage) => void) => {
  const channel = useMemo(() => new BroadcastChannel(channelName), [channelName]);

  const sendMessage = useCallback((msg: BroadcastMessage) => channel.postMessage(msg), [channel]);

  useEffect(() => {
    const listener = (event: MessageEvent) => handleMessage(event.data as BroadcastMessage);
    channel.addEventListener('message', listener);

    return () => {
      channel.removeEventListener('message', listener);
      channel.close();
    };
  }, [channel, handleMessage]);

  return { sendMessage, channel };
};

export default useBroadcastChannel;
