import { useContext } from 'react';

import { CreateNewRoomDataContext } from './CreateNewRoomDataProvider';

export const useCreateNewRoomDataContext = () => {
  const context = useContext(CreateNewRoomDataContext);
  if (!context) throw new Error('useCreateNewRoomDataContext must be used within a CreateNewRoomDataProvider');

  return context;
};

export default useCreateNewRoomDataContext;
