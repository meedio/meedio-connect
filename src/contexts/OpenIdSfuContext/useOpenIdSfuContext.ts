import { useContext } from 'react';

import { OpenIdSfuContext } from './OpenIdSfuContext';

const useOpenIdSfuContext = () => {
  const context = useContext(OpenIdSfuContext);
  if (!context) throw new Error('useOpenIdSfuContext must be used within a OpenIdSfuProvider');

  return context;
};

export default useOpenIdSfuContext;
