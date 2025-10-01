import { useParticipants, useRoomContext } from '@livekit/components-react';
import Avatar from '@shared/components/Avatar/Avatar';
import { TrackPublication, ConnectionQuality } from 'livekit-client';
import React, { useEffect } from 'react';
import { Key, PropsWithChildren, useRef } from 'react';

import AnimatedTile from 'components/AnimatedTile';
import NoVideo from 'components/NoVideo';
import ParticipantDetails from 'components/ParticipantDetails/ParticipantDetails';
import ReconnectingIndicator from 'components/ReconnectingIndicator';
import WaitingPlaceholder from 'components/WaitingPlaceholder/WaitingPlaceholder';
import useRoomUIContext from 'contexts/RoomUIContext/useRoomUIContext';
import { findParticipantById, getIsScreenShareTile } from 'contexts/VideoGridContext/layoutUtils';
import { ChildrenProperties } from 'contexts/VideoGridContext/utils';
import useContain from 'hooks/useContain';
import VideoZoomWrapper from 'modules/Zoom/VideoZoomWrapper';
import logger from 'utils/logging/faro';
import { getShouldMirrorVideo } from 'utils/tracks/utils';
import { getZoomControlsVideoThreshold } from 'utils/utils';

import { getIsParticipantTile } from './utils';
import VideoFeed from './VideoFeed';

export type TileChildrenProperties = ChildrenProperties & { publication?: TrackPublication };

interface VideoTileProps extends TileChildrenProperties {
  id: Key;
  hasParticipantDetails?: boolean;
  isTileInSidebar?: boolean;
}

const RECORDING_CONTROLS_HEIGHT_THRESHOLD = 187;

const VideoTile = ({
  item,
  hasParticipantDetails = false,
  children,
  id,
  focused,
  isTileInSidebar,
  ...rest
}: PropsWithChildren<VideoTileProps>) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const { isContain, toggleIsContain } = useContain(id, item);
  const participants = useParticipants();
  const {
    state: { isLocalViewFloating },
  } = useRoomUIContext();
  const room = useRoomContext();

  const currentParticipant = participants.find((participant) => findParticipantById(participant, item.id));
  const isScreenShareTile = getIsScreenShareTile(item.id);

  useEffect(() => {
    if (!currentParticipant || !getIsParticipantTile(item)) return;

    const onQualityChanged = (quality: ConnectionQuality) => {
      logger.info(
        `connection quality has changed to ${quality}, participant id: ${currentParticipant.identity}, room id: ${room.name}`,
      );
      const hasRemoteLostConnection =
        currentParticipant.connectionQuality === ConnectionQuality.Lost && currentParticipant.isLocal;
      if (hasRemoteLostConnection) logger.info(`Participant lost connection, id: ${currentParticipant.identity}`);
    };
    currentParticipant.on('connectionQualityChanged', onQualityChanged);

    return () => {
      currentParticipant.off('connectionQualityChanged', onQualityChanged);
    };
  }, [currentParticipant, item, room]);

  if (!getIsParticipantTile(item)) {
    return (
      <AnimatedTile {...rest}>
        <WaitingPlaceholder isInSidebar={isTileInSidebar} />
      </AnimatedTile>
    );
  }

  const {
    participant: { name, publication },
    isLocal,
    id: tileId,
  } = item;

  const hasRemoteLostConnection = currentParticipant?.connectionQuality === ConnectionQuality.Lost && !isLocal;
  const isVideoOn = currentParticipant?.isCameraEnabled;
  const isFloatingParticipant = isLocalViewFloating && isLocal;
  const objectStyle = isContain && !isFloatingParticipant ? 'contain' : 'cover';
  const isRecordingControlsMinimized = rest.height < RECORDING_CONTROLS_HEIGHT_THRESHOLD;
  const canShowVideoModeChangeBtn = !!(isScreenShareTile && focused);
  const isMinimalZoomControls = rest.width < getZoomControlsVideoThreshold(canShowVideoModeChangeBtn);
  const shouldMirrorVideo = getShouldMirrorVideo({ videoTrack: publication?.videoTrack, isScreenShareTile, isLocal });
  const videoClassName = (shouldMirrorVideo && '-scale-x-1') || undefined;

  return (
    <AnimatedTile {...rest} data-test-participant-frame={name}>
      {hasRemoteLostConnection && <ReconnectingIndicator isTileInSidebar={isTileInSidebar} />}
      {(!isVideoOn && !isScreenShareTile) || hasRemoteLostConnection ? (
        <NoVideo>
          <Avatar name={name} size={isRecordingControlsMinimized ? 'sm' : 'lg'} className="relative" />
        </NoVideo>
      ) : (
        <VideoZoomWrapper
          isDisabled={!focused || isLocalViewFloating}
          toggleIsContain={toggleIsContain}
          isContain={isContain}
          id={tileId}
          canShowVideoModeChangeBtn={canShowVideoModeChangeBtn}
          isMinimalControls={isMinimalZoomControls}
        >
          {currentParticipant && (
            <VideoFeed
              publication={publication}
              participant={currentParticipant}
              //NOTE: if it's a local participant we rerender the frame when audioInputId changes, this fixes safari echo problem (frontend/issues/466)
              key={(isLocal && id) || null}
              videoRef={videoRef}
              objFit={objectStyle}
              id={tileId}
              className={videoClassName}
            />
          )}
        </VideoZoomWrapper>
      )}
      {hasParticipantDetails && currentParticipant && (
        <ParticipantDetails
          participant={currentParticipant}
          id={item.id}
          name={name}
          isPinned={focused && !isLocalViewFloating}
        />
      )}
      {children}
    </AnimatedTile>
  );
};

export default React.memo(VideoTile);
