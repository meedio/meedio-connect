import { LocalParticipant, RemoteParticipant, TrackPublication } from 'livekit-client';

import '@livekit/components-styles';
import { TileDescriptor, TileTypeEnum } from './utils';

export const WAITING_PLACEHOLDER = 'waiting-placeholder';

export const USER_CHOICES = {
  videoInput: 'livekit_videoinput',
  audioInput: 'livekit_audioinput',
  audioOutput: 'livekit_output',
  videoDeviceId: 'livekit_video_device_id',
  audioDeviceId: 'livekit_audio_device_id',
  audioOutputId: 'livekit_audio_output_id',
};

export type LivekitParticipant = {
  name: string;
  userId?: string;
  isScreenSharing?: boolean;
  id: string;
  publication?: TrackPublication;
  isLocal: boolean;
};

export const countWithProperty = <T>(array: T[], property: keyof T) =>
  array.reduce((count, item) => count + (item[property] ? 1 : 0), 0);

export const getGridItems = (allParticipants: LivekitParticipant[], placeholder = true) => {
  const participantCount = allParticipants.length - countWithProperty(allParticipants, 'isScreenSharing');

  const tileDescriptors: TileDescriptor[] = allParticipants.map((participant) => {
    const { id, isLocal, isScreenSharing } = participant;

    return {
      id,
      type: TileTypeEnum.PARTICIPANT,
      participant,
      isLocal,
      isScreenSharing,
    };
  });

  if (participantCount < 2 && placeholder) {
    tileDescriptors.push({
      id: WAITING_PLACEHOLDER,
      type: TileTypeEnum.PLACEHOLDER,
      replace: true,
    });
  }

  return tileDescriptors;
};

export const findParticipantById = ({ identity }: RemoteParticipant | LocalParticipant, id: string) => {
  const [realId] = id.split('_');
  return realId === identity;
};

export const getIsScreenShareTile = (id: string) => id.split('_').includes('screen');

export const hashPassphrase = async (passphrase: string) => {
  const encoder = new TextEncoder();
  const data = encoder.encode(passphrase);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map((byte) => byte.toString(16).padStart(2, '0')).join('');

  return hashHex;
};
