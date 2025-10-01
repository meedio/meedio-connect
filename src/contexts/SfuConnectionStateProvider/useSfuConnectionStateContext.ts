import { useContext } from 'react';

import { SfuConnectionStateContext } from './SfuConnectionStateProvider';

const useSfuConnectionStateContext = () => {
  const context = useContext(SfuConnectionStateContext);
  if (!context) {
    throw new Error('useSfuConnectionStateContext must be used within a SfuConnectionStateProvider');
  }

  return context;
};

export default useSfuConnectionStateContext;
