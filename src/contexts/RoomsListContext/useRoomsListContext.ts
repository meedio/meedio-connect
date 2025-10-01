import { useContext } from 'react';

import { RoomsListContext } from './RoomsListContext';

const useRoomsListContext = () => {
  const context = useContext(RoomsListContext);
  if (!context) throw new Error('useRoomsListContext must be used within a RoomsListProvider');

  return context;
};

export default useRoomsListContext;
