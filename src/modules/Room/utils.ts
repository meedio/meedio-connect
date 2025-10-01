import { ConnectionState, Room } from 'livekit-client';

import { formatUrl } from 'modules/Matrix/utils';
import logger from 'utils/logging/faro';

export const isRoomAliasOrId = (roomId: string) => {
  const guestHomeserverUrl = formatUrl(import.meta.env.REACT_APP_GUEST_MATRIX_URL, true);
  const isRoomId = roomId.at(0) === '!';
  return isRoomId ? roomId : `#${roomId}:${guestHomeserverUrl}`;
};

type GetConnectionMethodProps = { candidateType: string; protocol: string; relayProtocol?: string };

enum ConnectionMethods {
  ICE_DIRECT_UDP = 'ice-direct-udp',
  ICE_DIRECT_TCP = 'ice-direct-tcp',
  TURN_RELAY_UDP = 'turn-relay-udp',
  TURN_RELAY_TLS = 'turn-relay-tls',
  UNKNOWN = 'unknown',
}

const getConnectionMethod = ({ candidateType, protocol, relayProtocol }: GetConnectionMethodProps) => {
  const isUdp = protocol === 'udp';
  const isPrflx = candidateType === 'prflx';
  const isRelay = candidateType === 'relay';
  const isTls = relayProtocol === 'tls';

  if (isPrflx && isUdp) return { name: ConnectionMethods.ICE_DIRECT_UDP, order: 1 };
  if (isPrflx && protocol === 'tcp') return { name: ConnectionMethods.ICE_DIRECT_TCP, order: 2 };
  if (isRelay && isUdp && !isTls) return { name: ConnectionMethods.TURN_RELAY_UDP, order: 3 };
  if (isRelay && isTls) return { name: ConnectionMethods.TURN_RELAY_TLS, order: 4 };

  return { name: ConnectionMethods.UNKNOWN };
};

export const logConnectionMethod = async (room: Room, connectionState: ConnectionState) => {
  if (connectionState !== ConnectionState.Connected) return;

  const stats = await room.engine.pcManager?.publisher
    .getStats()
    .catch((error) => logger.error('Unable to get WebRTC stats', error));

  if (!stats) return logger.error('WebRTC stats are undefined');

  const activeCandidatePairs = Array.from(stats.values()).filter(
    ({ type, state, nominated, writable }) =>
      type === 'candidate-pair' && state === 'succeeded' && nominated && writable
  );

  if (!activeCandidatePairs.length) return logger.error('No activeCandidatePairs detected');
  if (activeCandidatePairs.length > 1) logger.warn(`${activeCandidatePairs.length} activeCandidatePairs detected`);

  activeCandidatePairs.forEach(({ localCandidateId, remoteCandidateId }) => {
    const local = stats.get(localCandidateId);
    const remote = stats.get(remoteCandidateId);
    if (!local || !remote) {
      return logger.error('Candidate is missing in the pair', { hasLocal: !!local, hasRemote: !!remote });
    }

    const { candidateType, protocol, relayProtocol } = local;
    const { name, order } = getConnectionMethod({ candidateType, protocol, relayProtocol });

    if (order) return logger.info(`Successfully connected to SFU (method ${order}/4, name: ${name}).`);

    logger.error('Unknown webRTC connection type', { candidateType, protocol, relayProtocol });
  });
};
