import { ComponentType, FC } from 'react';

import useLogValue from 'hooks/useLogValue';

const withMountLog = <T extends object>(Component: ComponentType<T>, logMessage: string): FC<T> => {
  const WrappedComponent: FC<T> = (props) => {
    useLogValue(logMessage || `Component ${Component.name} loaded`);

    return <Component {...props} />;
  };

  return WrappedComponent;
};

export default withMountLog;
