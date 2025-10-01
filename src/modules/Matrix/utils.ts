import { AutoDiscovery } from 'matrix-js-sdk/src';

export const getHomeserverBaseUrl = async (homeserver: string): Promise<string | null> => {
  const formattedHomeserver = formatUrl(homeserver, true);
  const rawConfig = await AutoDiscovery.getRawClientConfig(formattedHomeserver);
  return rawConfig['m.homeserver']?.base_url || null;
};

export const formatUrl = (url: string, removeProtocol = false): string =>
  removeProtocol ? url.replace(/^https?:\/\//i, '') : url.startsWith('http') ? url : `https://${url}`;
