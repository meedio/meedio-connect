import { ComponentType } from 'react';

import RoomsListProvider from './RoomsListContext';

function withRoomsListContextProvider(Component: ComponentType) {
  const WithRoomsListContextProvider: React.FC = () => (
    <RoomsListProvider>
      <Component />
    </RoomsListProvider>
  );

  return WithRoomsListContextProvider;
}

export default withRoomsListContextProvider;
