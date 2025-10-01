import { animated } from '@react-spring/web';
import cx from 'classnames';
import { PropsWithChildren } from 'react';

import { ChildrenProperties } from 'contexts/VideoGridContext/utils';

const AnimatedTile = ({
  children,
  className,
  isStatic = false,
  ...rest
}: PropsWithChildren<Omit<ChildrenProperties, 'item' | 'focused' | 'zoomState' | 'isTileInSidebar'>>) => (
  <animated.div
    className={cx(
      'dark:bg-gray-90 bg-gray-10 will-change-animation group absolute flex justify-center overflow-hidden rounded-2xl tap-highlight-none',
      { 'touch-none': !isStatic },
      className
    )}
    {...rest}
  >
    {children}
  </animated.div>
);

export default AnimatedTile;
