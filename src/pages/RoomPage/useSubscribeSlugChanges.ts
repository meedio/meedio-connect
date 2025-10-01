import { SyncState, EventType, ClientEvent, EventTimeline } from 'matrix-js-sdk/src';
import { useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';

import useMatrixContext from 'contexts/MatrixContext/useMatrixContext';
import useRoomIdentityContext from 'contexts/RoomIdentityContext/useRoomIdentityContext';
import { attachHomeServerToAlias } from 'contexts/RoomIdentityContext/utils';
import useToast from 'contexts/ToastProvider/useToast';
import { extractAliasAsPath } from 'modules/CreateRoomModal/utils';
import { commonStateKeys } from 'utils/matrixUtils';

const useSubscribeSlugChanges = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { matrixClient } = useMatrixContext();
  const { pushToast } = useToast();
  const { roomId: roomIdOrAlias } = useParams();
  const {
    state: { roomId },
  } = useRoomIdentityContext();

  const handleSlugChange = useCallback(
    (state: SyncState) => {
      if (!roomIdOrAlias || state !== SyncState.Syncing) return;

      const room = matrixClient.getRoom(roomId);
      if (!room) return;

      const aliasEvent = room
        .getLiveTimeline()
        .getState(EventTimeline.FORWARDS)
        ?.getStateEvents(EventType.RoomCanonicalAlias, commonStateKeys.default);
      const aliasEventContent = aliasEvent?.getContent().alias;

      if (!aliasEventContent || aliasEventContent === attachHomeServerToAlias(roomIdOrAlias, roomId)) return;

      pushToast({ variant: 'info', title: t('room_slug_changed') });
      const alias = extractAliasAsPath(aliasEventContent);
      navigate(`/rooms/${alias}`);
    },
    [matrixClient, navigate, pushToast, roomIdOrAlias, roomId, t]
  );

  useEffect(() => {
    const isUsingAlias = !!roomIdOrAlias && !roomIdOrAlias.startsWith('!');

    if (!isUsingAlias) return;

    matrixClient.on(ClientEvent.Sync, handleSlugChange);
    return () => {
      matrixClient.off(ClientEvent.Sync, handleSlugChange);
    };
  }, [matrixClient, roomIdOrAlias, handleSlugChange]);
};

export default useSubscribeSlugChanges;
