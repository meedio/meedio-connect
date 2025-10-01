import { animated, useSpring } from '@react-spring/web';
import cx from 'classnames';
import { PropsWithChildren } from 'react';

interface AnimatedToolbarProps {
  id?: string;
  isHeader?: boolean;
  isVisible: boolean;
  isHeaderAndFooterShown: boolean;
}

const AnimatedToolbar = ({
  children,
  id,
  isHeader = false,
  isVisible,
  isHeaderAndFooterShown,
}: PropsWithChildren<AnimatedToolbarProps>) => {
  const translateValue = isHeader ? ['-100%'] : ['300%'];

  const toolbarProps = useSpring({
    transform: isVisible ? 'translateY(0%)' : `translateY(${translateValue})`,
  });

  return (
    <animated.div
      id={id}
      style={toolbarProps}
      className={cx('relative z-30 !h-fit transform', {
        '!absolute w-full': !isHeaderAndFooterShown,
        'bottom-0': !isHeaderAndFooterShown && !isHeader,
      })}
    >
      {children}
    </animated.div>
  );
};

export default AnimatedToolbar;
