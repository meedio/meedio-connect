import cx from 'classnames';

const verticalSpaces = {
  xs: 'my-1',
  sm: 'my-2',
  md: 'my-4',
  lg: 'my-6',
  xl: 'my-8',
  none: '',
};

interface DividerProps {
  className?: string;
  isVertical?: boolean;
  verticalSpace?: keyof typeof verticalSpaces;
}

const Divider = ({ className, isVertical, verticalSpace = 'none' }: DividerProps) => (
  <div
    className={cx(
      'bg-gray-30',
      isVertical ? 'my-0 h-full w-px' : 'h-px w-full',
      verticalSpaces[verticalSpace],
      className
    )}
  />
);

export default Divider;
