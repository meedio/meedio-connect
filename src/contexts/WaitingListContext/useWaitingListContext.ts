import { useContext } from 'react';

import { WaitingListContext } from './WaitingListContext';

export function useWaitingListContext() {
  const context = useContext(WaitingListContext);
  if (!context) throw new Error('useWaitingListContext must be used within a WaitingListProvider');

  return context;
}
