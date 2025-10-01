import { faker } from '@faker-js/faker';
import { IOpenIDToken, MatrixClient } from 'matrix-js-sdk/src/matrix';
import { LivekitFocus } from 'matrix-js-sdk/src/matrixrtc/LivekitFocus';

import logger from './logging/faro';

export interface SFUConfig {
  url: string;
  jwt: string;
}

export type OpenIDClientParts = Pick<MatrixClient, 'getOpenIdToken' | 'getDeviceId'>;

const getLiveKitJWT = async (
  client: OpenIDClientParts,
  livekitServiceURL: string,
  roomName: string,
  openIDToken: IOpenIDToken,
  fakeId = false
): Promise<SFUConfig> => {
  try {
    const res = await fetch(livekitServiceURL + '/sfu/get', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        room: roomName,
        openid_token: openIDToken,
        device_id: fakeId ? faker.string.uuid() : client.getDeviceId(),
      }),
    });

    if (!res.ok) {
      logger.error('SFU Config fetch failed with status code', res.status);
      throw new Error('SFU Config fetch failed with status code ' + res.status);
    }

    return await res.json();
  } catch (e) {
    logger.error('SFU Config fetch failed with exception', e);
    throw new Error('SFU Config fetch failed with exception ' + e);
  }
};

export const getSFUConfigWithOpenID = async (client: OpenIDClientParts, activeFocus: LivekitFocus, fakeId = false) => {
  const openIdToken = await client.getOpenIdToken().catch((e) => {
    logger.error('cannot get open id token', e);
    throw e;
  });

  const sfuConfig = await getLiveKitJWT(
    client,
    activeFocus.livekit_service_url,
    activeFocus.livekit_alias,
    openIdToken,
    fakeId
  );

  return sfuConfig;
};
