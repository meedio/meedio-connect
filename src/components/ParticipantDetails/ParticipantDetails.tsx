import { useConnectionQualityIndicator } from '@livekit/components-react';
import { ConnectionQuality, LocalParticipant, RemoteParticipant, Track } from 'livekit-client';

import { ReactComponent as MicOff } from 'assets/icons/MicrophoneOff.svg';
import { ReactComponent as Pin } from 'assets/icons/Pin.svg';
import { ReactComponent as ScreenShare } from 'assets/icons/ScreenShare.svg';
import { ReactComponent as VideoOff } from 'assets/icons/VideoOff.svg';
import { getIsScreenShareTile } from 'contexts/VideoGridContext/layoutUtils';
import useVolumeIndicator from 'hooks/useVolumeIndicator/useVolumeIndicator';
import { GRADIENT_COLORS } from 'modules/MediaDevicesSettings/AudioSettings/MicrophoneIndicator';

import ParticipantDetailsIcon from './ParticipantDetailsIcon';
import ParticipantDetailsWrapper from './ParticipantDetailsWrapper';
import NetworkIndicator from '../NetworkIndicator/NetworkIndicator';

interface ParticipantDetailsProps {
  id: string;
  className?: string;
  name: string;
  participant: LocalParticipant | RemoteParticipant;
  isPinned?: boolean;
}

const ParticipantDetails = ({ participant, id, className, name, isPinned }: ParticipantDetailsProps) => {
  const track = participant.getTrackPublication(Track.Source.Microphone)?.audioTrack;

  const { quality } = useConnectionQualityIndicator({ participant });
  const ref = useVolumeIndicator(participant.isMicrophoneEnabled || false, GRADIENT_COLORS, track?.mediaStream);

  const isScreenShareTile = getIsScreenShareTile(id);

  const hasMicOffIndicator = !participant.isMicrophoneEnabled && !isScreenShareTile;
  const hasCamOffIndicator = !participant.isCameraEnabled && !isScreenShareTile;
  const hasNetworkIndicator = quality !== ConnectionQuality.Unknown;
  const hasIconLeft = isPinned || hasMicOffIndicator || hasCamOffIndicator || hasNetworkIndicator;
  const iconLeft = hasIconLeft && (
    <>
      {hasNetworkIndicator && <NetworkIndicator quality={quality} id={id} />}
      {isPinned && <ParticipantDetailsIcon icon={Pin} variant="gray" />}
      {hasMicOffIndicator && <ParticipantDetailsIcon icon={MicOff} />}
      {hasCamOffIndicator && <ParticipantDetailsIcon icon={VideoOff} />}
    </>
  );

  return (
    <ParticipantDetailsWrapper
      key={track?.mediaStreamID}
      className={className}
      ref={ref}
      iconLeft={iconLeft}
      iconRight={isScreenShareTile && <ParticipantDetailsIcon icon={ScreenShare} variant="gray" />}
    >
      {name}
    </ParticipantDetailsWrapper>
  );
};

export default ParticipantDetails;
