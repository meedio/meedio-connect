import { useContext } from 'react';

import { SingleTabContext } from './SingleTabProvider';

const useSingleTabContext = () => {
  const ctx = useContext(SingleTabContext);
  if (!ctx) throw new Error('useSingleTabContext must be used within <SingleTabProvider>');
  return ctx;
};

export default useSingleTabContext;
