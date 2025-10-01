import React from 'react';

import { SimpleRoomProvider } from 'contexts/SimpleRoomContext/SimpleRoomContext';
import { OpenIdSfuProvider } from 'contexts/OpenIdSfuContext/OpenIdSfuContext';
import RoomIdentityProvider from 'contexts/RoomIdentityContext/RoomIdentityProvider';
import { RoomMembershipProvider } from 'contexts/RoomMembershipContext/RoomMembershipContext';
import RoomStateContextProvider from 'contexts/RoomStateContext/RoomStateContext';
import useRoomStateContext from 'contexts/RoomStateContext/useRoomStateContext';
import { SfuConnectionStateProvider } from 'contexts/SfuConnectionStateProvider/SfuConnectionStateProvider';
import Room from 'modules/Room/Room';
import RoomPageWrapper from 'modules/RoomPageWrapper/RoomPageWrapper';

import useSubscribeSlugChanges from './useSubscribeSlugChanges';

const RoomPageContent = () => {
  useSubscribeSlugChanges();
  const { activeRoomId } = useRoomStateContext();

  return (
    <RoomMembershipProvider>
      <SfuConnectionStateProvider>
        <SimpleRoomProvider key={activeRoomId}>
          <OpenIdSfuProvider>
            <RoomPageWrapper>
              <Room />
            </RoomPageWrapper>
          </OpenIdSfuProvider>
        </SimpleRoomProvider>
      </SfuConnectionStateProvider>
    </RoomMembershipProvider>
  );
};

const RoomPage = () => {
  return (
    <RoomIdentityProvider>
      <RoomStateContextProvider>
        <RoomPageContent />
      </RoomStateContextProvider>
    </RoomIdentityProvider>
  );
};

export default React.memo(RoomPage);
