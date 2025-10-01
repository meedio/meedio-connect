import { Room } from 'matrix-js-sdk/src/matrix';

type SidebarParticipant = {
  identity: string;
  matrixUserId: string;
  name?: string;
};

export enum SidebarTab {
  PARTICIPANTS = 'PARTICIPANTS',
  WAITING_LIST = 'WAITING_LIST',
}

export const getSidebarParticipants = (sfuIdentities: string[], room?: Room): SidebarParticipant[] =>
  sfuIdentities.map((identity) => {
    const matrixUserId = identity.split(':').slice(0, 2).join(':');
    const name = room?.getMember(matrixUserId)?.rawDisplayName;

    return { identity, matrixUserId, name };
  });
