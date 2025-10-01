import cx from 'classnames';
import { PropsWithChildren, useLayoutEffect } from 'react';

import useTheme from 'hooks/useTheme';

const ThemeWrapper = ({ children }: PropsWithChildren) => {
  const { isLightTheme } = useTheme();

  useLayoutEffect(() => {
    document.body.classList.toggle('font-poppins', true);
  }, []);

  return <div className={cx('h-full w-full', { dark: !isLightTheme })}>{children}</div>;
};

export default ThemeWrapper;
