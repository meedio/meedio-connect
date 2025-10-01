import {
  SyncState,
  ClientEvent,
  KnownMembership,
  EventType,
} from 'matrix-js-sdk/src/matrix';
import { useCallback, useEffect } from 'react';

import useMatrixContext from 'contexts/MatrixContext/useMatrixContext';
import { sortRooms } from 'modules/RoomsListItem/utils';

const useUpdateMatrixRooms = () => {
  const { setRooms, matrixClient, setIsRoomsLoading } = useMatrixContext();

  const updateRooms = useCallback(() => {
    const sortedRooms = sortRooms(matrixClient.getRooms());
    const filteredRooms = sortedRooms.filter((room) => {
      if (
        [KnownMembership.Leave, KnownMembership.Ban].includes(
          room.getMyMembership() as KnownMembership
        )
      ) {
        return false;
      }

      const isReferencedAsChatChild = matrixClient
        .getRooms()
        .some((spaceRoom) => {
          if (spaceRoom.roomId === room.roomId) return false; // stop itterating over itself

          const spaceChildEvents = spaceRoom.currentState.getStateEvents(
            EventType.SpaceChild
          );
          return spaceChildEvents.some(
            (event) =>
              event.getContent()?.roomType === 'CHAT' && // TODO: move to constants and check for refference to roomType.CHAT
              event.getStateKey() === room.roomId
          );
        });

      if (isReferencedAsChatChild) {
        return false; // chat rooms should not be displayed in the main rooms list..
      }

      return true;
    });

    setRooms(filteredRooms);

    setIsRoomsLoading(false);
  }, [matrixClient, setIsRoomsLoading, setRooms]);

  useEffect(() => {
    const onSync = (state: SyncState) => {
      if (state === SyncState.Syncing) updateRooms();
    };

    matrixClient.on(ClientEvent.Sync, onSync);

    return () => {
      matrixClient.off(ClientEvent.Sync, onSync);
    };
  }, [matrixClient, updateRooms]);

  useEffect(() => {
    setIsRoomsLoading(true);

    // NOTE: we will stuck on loading if we click navigate back to rooms list from another route.
    if (matrixClient.getSyncState() === SyncState.Syncing) return updateRooms();
  }, [matrixClient, setIsRoomsLoading, updateRooms]);
};

export default useUpdateMatrixRooms;
