import { createContext, PropsWithChildren } from 'react';

import { SFUConfig } from 'utils/openIDSFU';

import useOpenIDSFU from './useOpenIDSFU';

type OpenIdSfuContextType = {
  sfuConfig?: SFUConfig;
  error?: string;
  setError: React.Dispatch<React.SetStateAction<string | undefined>>;
};

export const OpenIdSfuContext = createContext<OpenIdSfuContextType | null>(null);

export const OpenIdSfuProvider = ({ children }: PropsWithChildren) => {
  const { error, setError, sfuConfig } = useOpenIDSFU();

  return <OpenIdSfuContext.Provider value={{ sfuConfig, error, setError }}>{children}</OpenIdSfuContext.Provider>;
};
