import { defaultHoverTransition } from '@shared/utils';
import cx from 'classnames';
import { PropsWithChildren } from 'react';

import Spinner from 'components/Spinner/Spinner';

interface VisualEffectButtonProps {
  path?: string;
  title?: string;
  isActive: boolean;
  isLoading: boolean;
  isDisabled: boolean;
  onClick?: () => void;
}

const VisualEffectButton = ({
  children,
  title,
  path,
  isActive,
  isLoading,
  isDisabled,
  onClick,
}: PropsWithChildren<VisualEffectButtonProps>) => (
  <button className="w-full group flex flex-col items-center space-y-2" onClick={onClick} disabled={isDisabled}>
    <div
      className={cx(
        'flex w-full items-center justify-center rounded-2xl aspect-video overflow-hidden relative group-hover:shadow-elevation-small',
        defaultHoverTransition,
        isActive
          ? 'border-2 border-complementary-50 shadow-elevation-small'
          : 'border border-gray-30 group-hover:border-gray-50',
        { 'bg-gray-10 group-hover:bg-white': !path && !isActive }
      )}
    >
      {isLoading ? <Spinner variant="gray50" size="xs" className="absolute" /> : children}
      {path && <img src={path} className={cx({ 'bg-white': isActive })} />}
    </div>
    {title && <span className="text-grayscale-gray80 text-sm">{title}</span>}
  </button>
);

export default VisualEffectButton;
