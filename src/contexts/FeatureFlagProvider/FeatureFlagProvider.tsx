import { PropsWithChildren, createContext, useCallback, useEffect, useRef, useState } from 'react';
import { UnleashClient, IConfig, IToggle } from 'unleash-proxy-client';

import LoadingScreen from 'components/LoadingScreen/LoadingScreen';
import { FeatureFlag, featureFlagsDisabledByDefault } from 'utils/Constants';

const config: IConfig = {
  url: import.meta.env.REACT_APP_UNLEASH_EDGE_URL,
  clientKey: import.meta.env.REACT_APP_UNLEASH_API_KEY,
  refreshInterval: 15,
  appName: 'meedio-client',
};

type FeatureFlagContext = {
  isEnabled: (flag: FeatureFlag) => boolean;
  init: () => void;
  isLoading: boolean;
};

export const FeatureFlagContext = createContext<FeatureFlagContext | null>(null);

const FeatureFlagProvider = ({ children }: PropsWithChildren) => {
  const [isLoading, setIsLoading] = useState(true);
  const [toggles, setToggles] = useState<IToggle[] | undefined>(undefined);
  const unleashClient = useRef<UnleashClient | undefined>(undefined);

  const attachListeners = useCallback(() => {
    unleashClient.current?.on('update', () => setToggles(unleashClient.current?.getAllToggles()));
    unleashClient.current?.on('error', () => setIsLoading(false));
  }, []);

  const init = useCallback(async () => {
    unleashClient.current?.stop();

    await unleashClient.current?.start();
    setToggles(unleashClient.current?.getAllToggles());
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (unleashClient.current) return;

    if (!config.url || !config.clientKey) return setIsLoading(false);

    unleashClient.current = new UnleashClient(config);
    attachListeners();
    init();
  }, [attachListeners, init]);

  const isEnabled = useCallback(
    (flag: FeatureFlag) => {
      if (!unleashClient.current) {
        //NOTE: if env vars are not provided and feature flag is in list disabled by default - we return false (on premise)
        if (featureFlagsDisabledByDefault.includes(flag)) return false;

        //NOTE: if env vars are not provided the unleash client will be undefined. (for on premise solution)
        return true;
      }

      return (toggles && toggles.find(({ name }) => name === flag)?.enabled) || false;
    },
    [toggles]
  );

  if (isLoading) return <LoadingScreen />;

  return <FeatureFlagContext.Provider value={{ isEnabled, init, isLoading }}>{children}</FeatureFlagContext.Provider>;
};

export default FeatureFlagProvider;
