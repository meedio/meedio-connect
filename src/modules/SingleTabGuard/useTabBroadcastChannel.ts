import { useCallback, useEffect, useState } from 'react';

import useBroadcastChannel, {
  BroadcastActions,
  BroadcastChannels,
  BroadcastMessage,
} from 'modules/Broadcast/useBroadcastChannel';

type UseTabBroadcastChannelProps = {
  tabId: string;
  onForceClaim: (senderTabId: string) => void;
};

export default function useTabBroadcastChannel({ tabId, onForceClaim }: UseTabBroadcastChannelProps) {
  const [message, setMessage] = useState<BroadcastMessage | null>(null);
  const { sendMessage, channel } = useBroadcastChannel(BroadcastChannels.WINDOW_LOCK, setMessage);

  const sendForceClaim = useCallback(() => {
    sendMessage({
      type: BroadcastActions.FORCE_CLAIM,
      payload: { tabId },
    });
  }, [sendMessage, tabId]);

  useEffect(() => {
    if (!message) return;
    if (message.type === BroadcastActions.FORCE_CLAIM && message.payload?.tabId !== tabId) {
      onForceClaim(message.payload.tabId);
      channel.close();
    }
  }, [message, tabId, onForceClaim, channel]);

  return { sendForceClaim, channel };
}
