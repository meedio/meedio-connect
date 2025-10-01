import cx from 'classnames';
import { HTMLAttributes, ReactNode } from 'react';

const containerVariants = {
  gray: 'bg-gray-100',
  'gray-0': 'bg-gray-0',
  'gray-10': 'bg-grayscale-gray10',
  primary: 'bg-primary-50',
  alert: 'bg-alert-50',
  white: 'bg-white',
  white10: 'bg-white10',
  gray20: 'bg-gray-20',
  neutral: '',
};

const borderRadius = {
  '100': 'rounded-100',
  rounded: 'rounded',
  lg: 'rounded-lg',
  '2xl': 'rounded-2xl',
};

const containerSizes = {
  sm: 'p-1',
  md: 'p-2',
  lg: 'p-4',
  xl: 'p-6',
};

type SizeVariant = keyof typeof containerSizes;
type RadiusVariant = keyof typeof borderRadius;

export type RoundedContainerVariant = keyof typeof containerVariants;

export interface RoundedContainerProps extends HTMLAttributes<HTMLDivElement> {
  variant?: RoundedContainerVariant;
  children: ReactNode;
  dataTestId?: string;
  radiusVariant?: RadiusVariant;
  size?: SizeVariant;
}

const RoundedContainer = ({
  variant = 'gray',
  children,
  className,
  dataTestId,
  radiusVariant = '100',
  size = 'md',
  ...rest
}: RoundedContainerProps) => (
  <div
    className={cx(
      className,
      containerVariants[variant],
      containerSizes[size],
      borderRadius[radiusVariant],
      'w-fit-content flex flex-row items-center'
    )}
    data-testid={dataTestId}
    {...rest}
  >
    {children}
  </div>
);

export default RoundedContainer;
