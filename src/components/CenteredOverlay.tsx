import cx from 'classnames';
import { PropsWithChildren } from 'react';

type CenteredOverlayProps = {
  className?: string;
};

const CenteredOverlay = ({ className, children }: PropsWithChildren<CenteredOverlayProps>) => (
  <div
    className={cx(
      'bg-black50 absolute left-1/2 top-1/2 z-20 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-2xl',
      className
    )}
  >
    {children}
  </div>
);

export default CenteredOverlay;
