import { meetingTestingConstants } from '@shared/constants';
import cx from 'classnames';

import { ReactComponent as Loader } from '../../assets/icons/Loader.svg';

const variants = {
  disabledPrimary: 'text-gray-40',
  gray: 'text-gray-100',
  gray50: 'text-grayscale-gray50',
  gray80: 'text-grayscale-gray80',
  white: 'text-white',
  black: 'text-black',
};

const sizes = {
  xxxs: 'w-4 h-4',
  xxs: 'w-5 h-5',
  xs: 'w-6 h-6',
  md: 'w-8 h-8',
};

type SizeType = keyof typeof sizes;
export type SpinnerVariantType = keyof typeof variants;

interface SpinnerProps {
  variant?: SpinnerVariantType;
  className?: string;
  size?: SizeType;
}

const Spinner = ({ variant = 'white', className, size = 'md' }: SpinnerProps) => (
  <Loader
    data-testid={meetingTestingConstants.spinner}
    className={cx('shrink-0 animate-spin-slow stroke-current', variants[variant], sizes[size], className)}
  />
);

export default Spinner;
