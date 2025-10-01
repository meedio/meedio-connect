import { isLivekitFocus, LivekitFocus } from 'matrix-js-sdk/src/matrixrtc/LivekitFocus';
import { MatrixRTCSessionEvent } from 'matrix-js-sdk/src/matrixrtc/MatrixRTCSession';
import { deepCompare } from 'matrix-js-sdk/src/utils';
import { useCallback, useEffect, useState } from 'react';

import useRoomStateContext from 'contexts/RoomStateContext/useRoomStateContext';
import { ConnectionStatus } from 'contexts/SfuConnectionStateProvider/SfuConnectionStateProvider';
import useSfuConnectionStateContext from 'contexts/SfuConnectionStateProvider/useSfuConnectionStateContext';
import logger from 'utils/logging/faro';

function useActiveLivekitFocus() {
  const { mxRtcSession } = useRoomStateContext();
  const { connectionStatus } = useSfuConnectionStateContext();
  const [activeFocus, setActiveFocus] = useState<LivekitFocus>();

  useEffect(() => {
    //NOTE: cleanup active focus in pre-meeting
    if (activeFocus && connectionStatus === ConnectionStatus.DISCONNECTED) setActiveFocus(undefined);
  }, [activeFocus, connectionStatus]);

  const onMembershipsChanged = useCallback(() => {
    if (!mxRtcSession) return;

    logger.info('onMembershipsChanged handler runs in useActiveLivekitFocus');

    const newActiveFocus = mxRtcSession.getActiveFocus();
    if (!newActiveFocus || (newActiveFocus && !isLivekitFocus(newActiveFocus))) return;

    if (!deepCompare(activeFocus, newActiveFocus)) {
      logger.info('setting active focus');
      setActiveFocus(newActiveFocus);
      const event = new CustomEvent('focusChanged', { detail: newActiveFocus });
      document.dispatchEvent(event);
    }
  }, [activeFocus, mxRtcSession]);

  useEffect(() => {
    if (!mxRtcSession) return;

    const onJoin = (isJoined: boolean) => {
      if (isJoined) onMembershipsChanged();
    };

    onMembershipsChanged();

    logger.info('MembershipsChanged and JoinStateChanged event listeners are added');
    mxRtcSession.on(MatrixRTCSessionEvent.JoinStateChanged, onJoin);
    mxRtcSession.on(MatrixRTCSessionEvent.MembershipsChanged, onMembershipsChanged);
    return () => {
      mxRtcSession.off(MatrixRTCSessionEvent.MembershipsChanged, onMembershipsChanged);
      mxRtcSession.off(MatrixRTCSessionEvent.JoinStateChanged, onJoin);
    };
  }, [mxRtcSession, onMembershipsChanged]);

  return activeFocus;
}

export default useActiveLivekitFocus;
