import { ClientEvent, KnownMembership, RoomMemberEvent } from 'matrix-js-sdk/lib/matrix';
import {
  EventType,
  JoinRule,
  MatrixClient,
  Room,
  Direction,
  Filter,
  MatrixEvent,
  IEvent,
  IFilterDefinition,
  EventTimeline,
  RoomMember,
} from 'matrix-js-sdk/src';
import {
  LivekitFocus,
  LivekitFocusActive,
  isLivekitFocus,
  isLivekitFocusConfig,
} from 'matrix-js-sdk/src/matrixrtc/LivekitFocus';
import { MatrixRTCSession } from 'matrix-js-sdk/src/matrixrtc/MatrixRTCSession';

import logger from './logging/faro';
import { RoomSecretEventContent, RoomTopicEventContent } from './types';

enum RoomType {
  MAIN = 'main',
  CHAT = 'chat',
  UNKNOWN = 'unknown',
}

const FOCI_WK_KEY = 'org.matrix.msc4143.rtc_foci';

const defaultFocus: LivekitFocusActive = {
  type: 'livekit',
  focus_selection: 'oldest_membership',
};

function getLivekitFoci(rtcSession: MatrixRTCSession, livekitAlias: string) {
  const preferredFoci: LivekitFocus[] = [];
  const focusInUse = rtcSession.getFocusInUse();
  if (focusInUse && isLivekitFocus(focusInUse)) preferredFoci.push(focusInUse);

  const wellKnownFoci = rtcSession.room.client.getClientWellKnown()?.[FOCI_WK_KEY];
  if (Array.isArray(wellKnownFoci)) {
    preferredFoci.push(
      ...wellKnownFoci
        .filter((f) => !!f)
        .filter(isLivekitFocusConfig)
        .map((wellKnownFocus) => ({
          ...wellKnownFocus,
          livekit_alias: livekitAlias,
        })),
    );
  }

  const livekitServiceUrl = import.meta.env.REACT_APP_LIVEKIT_SERVICE_URL;
  if (livekitServiceUrl) {
    const focusFormConf: LivekitFocus = {
      type: 'livekit',
      livekit_service_url: livekitServiceUrl,
      livekit_alias: livekitAlias,
    };
    preferredFoci.push(focusFormConf);
  }

  if (preferredFoci.length === 0) {
    throw new Error(
      `No livekit_service_url is configured so we could not create a focus.
    Currently we skip computing a focus based on other users in the room.`,
    );
  }

  return preferredFoci;
}

export const enterRTCSession = (rtcSession: MatrixRTCSession) => {
  const livekitAlias = rtcSession.room.roomId;
  rtcSession.joinRoomSession(getLivekitFoci(rtcSession, livekitAlias), defaultFocus, {
    manageMediaKeys: true,
    makeKeyDelay: 5000,
    useNewMembershipManager: true,
    delayedLeaveEventDelayMs: 80_000,
    delayedLeaveEventRestartMs: 50_000,
    //NOTE: default values:
    // delayedLeaveEventRestartMs: 5_000,
    // delayedLeaveEventDelayMs: 8_000,
    // maximumRateLimitRetryCount: 10,
    // maximumNetworkErrorRetryCount: 10,
    // networkErrorRetryMs: 3_000
    // membershipEventExpiryHeadroomMs: 5_000,
    // membershipEventExpiryMs: 1000 * 60 * 60 * 4,
  });
};

export const getMatrixIdFromLivekitId = (input: string) => {
  const lastColonIndex = input.lastIndexOf(':');
  return input.slice(0, lastColonIndex);
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const CUSTOM_MEEDIO_EVENTS: Record<string, any> = {
  ROOM_SECRET: 'meedio.room.account_data.secret',
};

export const waitingListState = {
  type: EventType.RoomJoinRules,
  content: {
    join_rule: JoinRule.Knock,
  },
};

export const buildRoomPowerLevelOverrides = (userId: string | null) => ({
  invite: 100,
  kick: 100,
  ban: 100,
  redact: 50,
  state_default: 50,
  events_default: 0,
  users_default: 0,
  events: {
    'org.matrix.msc3401.call.member': 0,
  },
  ...(userId ? { users: { [userId]: 100 } } : {}),
});

export const commonStateKeys = {
  default: '',
};

export const isValidRoomSecretEvent = (obj: unknown): obj is RoomSecretEventContent =>
  typeof obj === 'object' && obj != null && 'roomSecret' in obj;

export const isValidRoomTopicStateEvent = (obj: unknown): obj is RoomTopicEventContent =>
  typeof obj === 'object' && obj != null && 'topic' in obj;

export const SPACE_CHILD_FILTER = {
  room: {
    timeline: {
      types: [EventType.SpaceChild],
    },
  },
};

export const getChatRoomIdFromSpace = async (space: Room, matrixClient: MatrixClient) => {
  const childEvent: MatrixEvent | undefined = space.currentState.getStateEvents(EventType.SpaceChild)[0];
  if (childEvent && childEvent.event.state_key) return childEvent.event.state_key;

  logger.info('Unable to get chat room ID from the matrix storage, will try to fetch the event');

  const filter = getFilter(SPACE_CHILD_FILTER, matrixClient.getUserId());
  const { chunk } = await matrixClient.createMessagesRequest(space.roomId, null, 1, Direction.Forward, filter);

  const event = chunk[0] as Partial<IEvent> | undefined;
  if (!event) throw new Error('event is undefined');

  const { state_key } = event;
  if (!state_key) throw new Error('state_key is undefined');

  return state_key;
};

export const getFilter = (definition: IFilterDefinition, userId?: string | null) => {
  const filter = new Filter(userId);
  filter.setDefinition(definition);

  return filter;
};

export const getSpaceChildEvents = (room?: Room | null) => {
  if (!room)
    return {
      chatChildEvents: [],
      childEvents: [],
    };

  const spaceChildEvents =
    room?.getLiveTimeline().getState(EventTimeline.FORWARDS)?.getStateEvents(EventType.SpaceChild) || [];

  return spaceChildEvents.reduce(
    (acc, evt) => {
      if (evt.isRedacted()) return acc;

      const type = evt.getContent()?.roomType;
      if (type === RoomType.CHAT) {
        acc.chatChildEvents.push(evt);
      } else {
        acc.childEvents.push(evt);
      }
      return acc;
    },
    { chatChildEvents: [], childEvents: [] } as {
      chatChildEvents: MatrixEvent[];
      childEvents: MatrixEvent[];
    },
  );
};

export const waitForRoomSync = (client: MatrixClient, roomId: string, timeoutMs = 5000) => {
  const existingRoom = client.getRoom(roomId);
  if (existingRoom) return;

  return new Promise<void>((resolve, reject) => {
    const timer = setTimeout(() => {
      client.removeListener(ClientEvent.Room, onRoom);

      if (client.getRoom(roomId)) {
        logger.info(`Matrix client has the room ${roomId} after the timeout ran out`);
        return resolve();
      }

      reject(new Error(`Timed out waiting for room ${roomId} to sync`));
    }, timeoutMs);

    const onRoom = (room: Room) => {
      if (room.roomId === roomId) {
        clearTimeout(timer);
        client.removeListener(ClientEvent.Room, onRoom);
        resolve();
      }
    };

    client.on(ClientEvent.Room, onRoom);
  });
};

export const waitForRoomMembers = async (room: Room, maxRetries = 5, delayMs = 250) => {
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    await room.clearLoadedMembersIfNeeded();
    const members = room.getMembers();

    if (members.length > 0) return members;

    await new Promise((resolve) => setTimeout(resolve, delayMs));
  }

  return room.getMembers();
};

export const hasMembership = (
  room: Room | undefined | null,
  userId: string,
  expectedMembership: KnownMembership | KnownMembership[],
): boolean => {
  if (!room) return false;

  const member: RoomMember | null = room.getMember(userId);
  const membership = member?.membership;

  const expectedArray = Array.isArray(expectedMembership) ? expectedMembership : [expectedMembership];
  return expectedArray.includes(membership as KnownMembership);
};

export const isInvitedOrJoined = (membership: string | undefined) =>
  !!membership && [KnownMembership.Join, KnownMembership.Invite].includes(membership as KnownMembership);

export const getHomeserverFromRoomId = (roomId: string) => {
  const parts = roomId.split(':');

  if (parts.length !== 2 || !parts[1]) {
    throw new Error(`Invalid roomId format: ${roomId}`);
  }

  return parts[1];
};

export const getHomeserverFromClient = (client: MatrixClient): string => {
  const userId = client.getUserId();
  if (!userId) throw new Error('Client has no userId');

  const [, domain] = userId.split(':');
  if (!domain) throw new Error(`Invalid Matrix userId format: ${userId}`);

  return domain;
};

export const getViaServers = (roomId: string, client: MatrixClient): string[] => {
  const roomHs = getHomeserverFromRoomId(roomId);
  const clientHs = getHomeserverFromClient(client);

  return Array.from(new Set([roomHs, clientHs]));
};

export const waitForMembership = (
  matrixClient: MatrixClient,
  roomId: string,
  userId: string,
  expected: KnownMembership,
  timeout = 10000,
) =>
  new Promise<void>((resolve) => {
    const start = Date.now();

    const check = () => {
      const room = matrixClient.getRoom(roomId);
      const current = room?.getMember(userId)?.membership;
      if (current === expected) {
        cleanup();
        resolve();
      } else if (Date.now() - start > timeout) {
        logger.warn(`waited for membership ${expected}, but it didn't arrive`);
        cleanup();
      }
    };

    const handler = (_ev: MatrixEvent, member: RoomMember) => {
      if (member.roomId === roomId && member.userId === userId && member.membership === expected) {
        cleanup();
        resolve();
      }
    };

    const cleanup = () => {
      clearInterval(pollId);
      matrixClient.removeListener(RoomMemberEvent.Membership, handler);
    };

    const pollId = setInterval(check, 500);

    matrixClient.on(RoomMemberEvent.Membership, handler);
    check();
  });
