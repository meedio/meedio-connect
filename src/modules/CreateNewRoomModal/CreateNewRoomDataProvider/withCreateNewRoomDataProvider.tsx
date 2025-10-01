import { ComponentType } from 'react';

import CreateNewRoomDataProvider, {
  CreateNewRoomDataProviderProps,
} from './CreateNewRoomDataProvider';

const withCreateNewRoomDataProvider = <
  T extends CreateNewRoomDataProviderProps,
>(
  Component: ComponentType
) => {
  const WithCreateNewRoomDataProvider: React.FC<T> = ({ room, ...props }) => (
    <CreateNewRoomDataProvider room={room}>
      <Component {...props} />
    </CreateNewRoomDataProvider>
  );

  return WithCreateNewRoomDataProvider;
};

export default withCreateNewRoomDataProvider;
