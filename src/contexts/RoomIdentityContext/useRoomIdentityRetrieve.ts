import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import useMatrixContext from 'contexts/MatrixContext/useMatrixContext';
import logger from 'utils/logging/faro';

import { RoomIdentityState } from './types';
import { handleRoomIdentityUsingIdOrAlias, handleRoomIdentityUsingToken, IdentityRetrieveStatus } from './utils';

const useRoomIdentityRetrieve = (onIdentityRetrieve: (values: Partial<RoomIdentityState>) => void) => {
  const { matrixClient } = useMatrixContext();
  const params = useParams();
  const [identityRetrieveStatus, setIdentityRetrieveStatus] = useState(IdentityRetrieveStatus.INITIAL);

  const { inviteToken, roomId: roomIdOrAlias } = params;

  const handleFail = useCallback(() => setIdentityRetrieveStatus(IdentityRetrieveStatus.ERROR), []);
  const handleSuccess = useCallback(
    (roomIdentityState: Partial<RoomIdentityState>) => {
      onIdentityRetrieve(roomIdentityState);
      setIdentityRetrieveStatus(IdentityRetrieveStatus.SUCCESS);
    },
    [onIdentityRetrieve]
  );

  const getRoomIdentity = useCallback(async () => {
    const handleRoomIdentityPayload = { matrixClient, onFail: handleFail, onSuccess: handleSuccess };

    if (roomIdOrAlias) {
      handleRoomIdentityUsingIdOrAlias({ ...handleRoomIdentityPayload, roomIdOrAlias });
    } else if (inviteToken) {
      handleRoomIdentityUsingToken({ ...handleRoomIdentityPayload, inviteToken });
    } else {
      logger.error('Unable to retrieve room identity missing roomIdOrAlias and inviteToken');
      handleFail();
    }
  }, [handleFail, handleSuccess, inviteToken, matrixClient, roomIdOrAlias]);

  useEffect(() => {
    if (identityRetrieveStatus !== IdentityRetrieveStatus.INITIAL) return;

    setIdentityRetrieveStatus(IdentityRetrieveStatus.LOADING);
    getRoomIdentity();
  }, [getRoomIdentity, identityRetrieveStatus]);

  useEffect(() => () => setIdentityRetrieveStatus(IdentityRetrieveStatus.INITIAL), [params]);

  return { identityRetrieveStatus };
};

export default useRoomIdentityRetrieve;
