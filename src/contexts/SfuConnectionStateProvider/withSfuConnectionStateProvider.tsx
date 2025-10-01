import { ComponentType, FC } from 'react';
import { useParams } from 'react-router-dom';

import { SfuConnectionStateProvider } from './SfuConnectionStateProvider';

function withSfuConnectionStateProvider<T extends object>(Component: ComponentType<T>) {
  const WithSfuConnectionStateProvider: FC<T> = (props) => {
    const { roomId } = useParams();

    return (
      <SfuConnectionStateProvider key={roomId}>
        <Component {...props} />
      </SfuConnectionStateProvider>
    );
  };

  WithSfuConnectionStateProvider.displayName = `withSfuConnectionStateProvider(${
    Component.displayName || Component.name
  }`;

  return WithSfuConnectionStateProvider;
}

export default withSfuConnectionStateProvider;
