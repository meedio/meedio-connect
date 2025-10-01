import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';

import useRoomStateContext from 'contexts/RoomStateContext/useRoomStateContext';
import { ConnectionStatus } from 'contexts/SfuConnectionStateProvider/SfuConnectionStateProvider';
import useSfuConnectionStateContext from 'contexts/SfuConnectionStateProvider/useSfuConnectionStateContext';
import useToast from 'contexts/ToastProvider/useToast';
import { logAndSendToSentry } from 'utils/utils';

const criticalErrors = ['could not establish pc connection', 'could not establish signal connection'];

// NOTE: livekit threw an error with undefined error.message, need to adjust the type accordingly
type LivekitError = {
  message?: string;
};

const useHandleLivekitRoomErrors = () => {
  const { t } = useTranslation();
  const { pushToast } = useToast();
  const { mxRtcSession, setRtcSession } = useRoomStateContext();
  const { setConnectionStatus } = useSfuConnectionStateContext();

  const handleRoomErrors = useCallback(
    (e: LivekitError) => {
      const hasCriticalError = criticalErrors.some((message) => e.message?.includes(message));

      //NOTE: adding this to find what kind of error with undefined error.message livekit throws
      if (!e.message) return logAndSendToSentry('Received livekit error without message', e);
      if (!hasCriticalError) return console.error(e);

      mxRtcSession?.leaveRoomSession();
      setConnectionStatus(ConnectionStatus.DISCONNECTED);
      setRtcSession(undefined);
      pushToast({ variant: 'error', title: t('error'), description: t('cannot_join_room') });
    },
    [mxRtcSession, pushToast, setConnectionStatus, setRtcSession, t]
  );

  return handleRoomErrors;
};

export default useHandleLivekitRoomErrors;
