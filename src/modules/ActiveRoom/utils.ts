import { TrackReferenceOrPlaceholder } from '@livekit/components-react';
import { t } from 'i18next';
import { Track, TrackPublication } from 'livekit-client';
import { Room } from 'matrix-js-sdk/src';

export type LivekitParticipant = {
  name: string;
  userId?: string;
  isScreenSharing?: boolean;
  id: string;
  publication?: TrackPublication;
  isLocal: boolean;
};
export const formatLiveKitParticipants = (
  participants: TrackReferenceOrPlaceholder[],
  room?: Room | null,
): LivekitParticipant[] => {
  if (!room) return [];

  return participants.map(({ publication, participant }) => {
    const { identity, isLocal } = participant;
    const mxId = identity.split(':').slice(0, 2).join(':'); // Extract Matrix ID
    const isScreenSharing = publication?.source === Track.Source.ScreenShare;

    const matrixMember = room.getJoinedMembers().find(({ userId }) => userId === mxId);
    const participantName = matrixMember?.rawDisplayName || t('participant');

    const screenSharingId = isScreenSharing ? 'screen' : 'participant';

    return {
      id: `${identity}_${screenSharingId}`,
      name: participantName,
      isScreenSharing,
      publication,
      isLocal,
    };
  });
};
