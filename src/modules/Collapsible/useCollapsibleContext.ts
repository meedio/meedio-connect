import { useContext } from 'react';

import { CollapsibleContext } from './Collapsible';

const useCollapsibleContext = () => {
  const context = useContext(CollapsibleContext);
  if (!context) throw new Error('useCollapsibleContext must be used within a Collapsible');

  return context;
};

export default useCollapsibleContext;
