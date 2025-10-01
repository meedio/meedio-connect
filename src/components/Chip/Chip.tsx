import { defaultHoverTransition } from '@shared/utils';
import cx from 'classnames';
import { PropsWithChildren } from 'react';

interface ChipProps {
  onClick: () => void;
  badgeValue?: number;
  isActive?: boolean;
}

const Chip = ({ children, onClick, badgeValue, isActive = false }: PropsWithChildren<ChipProps>) => (
  <div
    className={cx(
      'group flex items-center justify-center py-1 px-2 sm:px-2.5 gap-2 cursor-pointer text-size-sm font-medium rounded-xl whitespace-nowrap select-none',
      isActive ? 'text-primary-70 bg-primary-10 hover:bg-primary-20' : 'text-gray-80 hover:bg-gray-30',
      badgeValue ? 'sm:py-1' : 'sm:py-1.5',
      defaultHoverTransition
    )}
    onClick={onClick}
  >
    <span>{children}</span>
    {typeof badgeValue === 'number' && (
      <span
        className={cx(
          'flex items-center justify-center bg-primary-30 group-hover:bg-primary-40 text-white h-5 min-w-[20px] sm:h-6 sm:min-w-[24px] w-fit text-size-xs rounded-md sm:rounded-lg px-1',
          defaultHoverTransition
        )}
      >
        {badgeValue}
      </span>
    )}
  </div>
);

export default Chip;
