import { ComponentType, FC, MouseEvent } from 'react';

import logger from './faro';

type LogOptions = {
  message?: string;
  name?: string;
};

interface WithClickLogProps {
  onClick?: (e: MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
  'data-component-name'?: string;
}

function withClickLog<T>(Component: ComponentType<T>, options?: LogOptions): FC<T & WithClickLogProps> {
  const WrappedComponent: FC<T & WithClickLogProps> = (props) => {
    const { disabled, onClick } = props;
    const name = options?.name || props['data-component-name'];

    if (disabled) {
      const logMessage = options?.message || `Clicked on disabled element: ${name}`;
      const handleDisabledClick = () => logger.info(logMessage);

      return (
        <div onClick={handleDisabledClick}>
          <Component {...props} />
        </div>
      );
    }

    const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
      if (name) logger.info(options?.message || `Click on ${name}`);
      if (onClick) onClick(e);
    };

    return <Component {...props} onClick={handleClick} />;
  };

  return WrappedComponent;
}

export default withClickLog;
