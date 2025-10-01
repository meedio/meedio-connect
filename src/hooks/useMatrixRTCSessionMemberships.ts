import { CallMembership } from 'matrix-js-sdk/src/matrixrtc/CallMembership';
import { MatrixRTCSession, MatrixRTCSessionEvent } from 'matrix-js-sdk/src/matrixrtc/MatrixRTCSession';
import { useCallback, useEffect, useState } from 'react';

import logger from 'utils/logging/faro';

export default function useMatrixRTCSessionMemberships(rtcSession?: MatrixRTCSession): CallMembership[] {
  const [memberships, setMemberships] = useState(rtcSession?.memberships || []);

  const onMembershipsChanged = useCallback(() => {
    const memberships = rtcSession?.memberships;

    logger.info('Memberships state:', memberships);
    setMemberships(memberships || []);
  }, [rtcSession]);

  useEffect(() => {
    if (!rtcSession) return;

    setMemberships(rtcSession.memberships);

    rtcSession.on(MatrixRTCSessionEvent.MembershipsChanged, onMembershipsChanged);

    return () => {
      rtcSession.off(MatrixRTCSessionEvent.MembershipsChanged, onMembershipsChanged);
    };
  }, [rtcSession, onMembershipsChanged]);

  return memberships;
}
