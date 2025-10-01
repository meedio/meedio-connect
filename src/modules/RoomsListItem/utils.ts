import { fromUnixTime, differenceInMilliseconds } from 'date-fns';
import {
  EventTimeline,
  EventType,
  KnownMembership,
  MatrixClient,
  type Room,
} from 'matrix-js-sdk/src/matrix';

import { isValidRoomTopicStateEvent } from 'utils/matrixUtils';

const compareByDates = (firstRoom: Room, secondRoom: Room) => {
  if (!firstRoom.timeline.length || !secondRoom.timeline.length) return 0;

  const firstRoomTime = timestampToDate(
    firstRoom.timeline[firstRoom.timeline.length - 1].localTimestamp
  );
  const secondRoomTime = timestampToDate(
    secondRoom.timeline[secondRoom.timeline.length - 1].localTimestamp
  );

  return differenceInMilliseconds(secondRoomTime, firstRoomTime);
};

export const sortRooms = (rooms?: Room[]) =>
  rooms ? rooms.slice().sort(compareByDates) : [];
export const timestampToDate = (timestamp: number) =>
  fromUnixTime(timestamp / 1000);

export const getRoomPathIdentifier = (room: Room) => {
  const canonicalAlias = room.getCanonicalAlias();
  if (canonicalAlias) return canonicalAlias.slice(1).split(':')[0];

  return room.roomId;
};

export const getRoomMetadata = (room: Room) => {
  let description: string | null = null;

  const roomState = room.getLiveTimeline().getState(EventTimeline.FORWARDS);

  const descriptionContent = roomState
    ?.getStateEvents(EventType.RoomTopic)[0]
    ?.getContent();
  if (isValidRoomTopicStateEvent(descriptionContent))
    description = descriptionContent.topic;

  return { description };
};

type SessionDetails = {
  isActive: boolean;
  participantsCount: number;
  endedAt: number | null;
};
const initialSessionDetails = {
  isActive: false,
  participantsCount: 0,
  endedAt: null,
};

export const getCallSessionDetails = (
  matrixClient: MatrixClient,
  room: Room
) => {
  // State events might be missing a 'leave' event, RTC session seem to be more reliable for detecting activity
  const isRoomActive = !!matrixClient.matrixRTC.getActiveRoomSession(room);

  // callEvent === a matrix user in the room
  // a matrix user should have a single event that gets updated based on whether they are in the meeting or not
  const callEvents = room
    .getLiveTimeline()
    .getState(EventTimeline.FORWARDS)
    ?.getStateEvents(EventType.GroupCallMemberPrefix);

  // No one joined this call yet
  if (!callEvents?.length) return initialSessionDetails;

  const sessionDetails = callEvents.reduce<SessionDetails>((acc, event) => {
    const contentExists = !!Object.keys(event.getContent()).length;
    const isParticipantBanned =
      room.getMember(event.getSender() || '')?.membership ===
      KnownMembership.Ban;

    if (contentExists && isRoomActive && !isParticipantBanned) {
      // The event and rtc session state indicates that this participant is in the meeting

      const newParticipantsCount = acc.participantsCount + 1;

      return {
        participantsCount: newParticipantsCount,
        isActive: true,
        endedAt: null,
      };
    } else {
      // The event indicates that this participant was previously in the meeting but is no longer present

      const { endedAt } = acc;
      const eventTimestamp = event.getTs();
      const latestTimestamp =
        endedAt && endedAt > eventTimestamp ? endedAt : eventTimestamp;
      const newEndedAt = acc.isActive ? null : latestTimestamp;

      return { ...acc, endedAt: newEndedAt };
    }
  }, initialSessionDetails);

  return sessionDetails;
};
