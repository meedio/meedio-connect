import { useLocalParticipant, useTracks } from '@livekit/components-react';
import { LocalVideoTrack, RoomEvent, Track } from 'livekit-client';
import { EventType, KnownMembership, MatrixEvent, RoomEvent as MatrixRoomEvent } from 'matrix-js-sdk/src/matrix';
import { useEffect } from 'react';

import useMatrixContext from 'contexts/MatrixContext/useMatrixContext';
import useRoomStateContext from 'contexts/RoomStateContext/useRoomStateContext';
import VideoGridProvider from 'contexts/VideoGridContext/VideoGridContext';
import { WaitingListProvider } from 'contexts/WaitingListContext/WaitingListContext';
import useIsRoomOwner from 'hooks/useIsRoomOwner';
import PeopleSidebar from 'modules/PeopleSidebar/PeopleSidebar';
import logger from 'utils/logging/faro';
import withMountLog from 'utils/logging/withMountLog';

import ActiveRoomHeader from './ActiveRoomHeader/ActiveRoomHeader';
import ActiveRoomLayout from './ActiveRoomLayout';
import ActiveRoomWrapper from './ActiveRoomWrapper';
import { formatLiveKitParticipants } from './utils';

type KeyContent = {
  index: number;
  key: string;
};

const anonymizeKey = (str: string) => {
  const anonymized = '***';
  const middle = str.slice(3, -3); // Keep the middle part intact

  return `${anonymized}${middle}${anonymized}`;
};

const ActiveRoom = () => {
  const localParticipant = useLocalParticipant();
  const { mxRtcSession, setRtcSession } = useRoomStateContext();
  const { matrixClient } = useMatrixContext();
  const { activeRoomId: roomId } = useRoomStateContext();
  const isOwner = useIsRoomOwner();
  const tracks = useTracks(
    [
      { source: Track.Source.Camera, withPlaceholder: true },
      { source: Track.Source.ScreenShare, withPlaceholder: false },
    ],
    { updateOnlyOn: [RoomEvent.ActiveSpeakersChanged], onlySubscribed: false },
  );

  const participants = formatLiveKitParticipants(tracks, matrixClient.getRoom(roomId));

  const localVideoTrack = localParticipant.cameraTrack?.videoTrack as LocalVideoTrack | undefined;

  useEffect(() => {
    if (localVideoTrack?.mediaStreamTrack.muted && localParticipant.isCameraEnabled) localVideoTrack.restartTrack();
  }, [localParticipant.isCameraEnabled, localVideoTrack]);

  useEffect(() => {
    const leaveRoomSession = async () => {
      if (!mxRtcSession) return;

      const membership = mxRtcSession.room.getMyMembership();
      if (membership === KnownMembership.Join) {
        await mxRtcSession.leaveRoomSession();
      }

      setRtcSession(undefined);
    };

    window.addEventListener('beforeunload', leaveRoomSession);

    return () => {
      window.removeEventListener('beforeunload', leaveRoomSession);
      leaveRoomSession();
    };
  }, [mxRtcSession, matrixClient, setRtcSession]);

  useEffect(() => {
    if (!mxRtcSession) return;

    const onTimelineEvent = ({ event }: MatrixEvent) => {
      const { type, room_id, sender } = event;
      if (
        event.content &&
        type === EventType.CallEncryptionKeysPrefix &&
        mxRtcSession &&
        room_id === mxRtcSession.room.roomId
      ) {
        let keys = [...event.content.keys];
        keys = keys.map((key: KeyContent) => ({
          ...key,
          key: anonymizeKey(key.key),
        }));
        logger.info(`key event from participant: ${sender}`, {
          ...event,
          content: { ...event.content, keys },
        });
      }
    };

    matrixClient.on(MatrixRoomEvent.Timeline, onTimelineEvent);
    return () => {
      matrixClient.off(MatrixRoomEvent.Timeline, onTimelineEvent);
    };
  }, [matrixClient, mxRtcSession]);

  return (
    <WaitingListProvider>
      <ActiveRoomWrapper headerComponent={ActiveRoomHeader}>
        <VideoGridProvider>
          <ActiveRoomLayout allParticipants={participants} />
        </VideoGridProvider>
        {isOwner && <PeopleSidebar />}
      </ActiveRoomWrapper>
    </WaitingListProvider>
  );
};

export default withMountLog(ActiveRoom, 'Joined room');
