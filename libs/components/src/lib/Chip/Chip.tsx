import cx from 'classnames';
import { PropsWithChildren } from 'react';

interface ChipProps {
  onClick: () => void;
  isActive: boolean;
}

const activeClass = '!bg-primary-10 !border-primary-50';

const Chip = ({ onClick, children, isActive }: PropsWithChildren<ChipProps>) => (
  <div
    onClick={onClick}
    className={cx(
      'rounded-100 border-grayscale-gray30 text-size-sm text-grayscale-black hover:border-grayscale-black box-border flex h-8 w-fit cursor-pointer items-center justify-center border bg-white px-3',
      isActive && activeClass
    )}
  >
    {children}
  </div>
);

export default Chip;
