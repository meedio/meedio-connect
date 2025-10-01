import cx from 'classnames';
import { Children, Fragment, PropsWithChildren } from 'react';

import Divider from '../Divider/Divider';

export interface ButtonGroupProps {
  className?: string;
  hasDivider?: boolean;
  supportTheme?: boolean;
  dividersAt?: number[];
}

const ButtonGroup = ({
  children,
  className,
  hasDivider = true,
  supportTheme = false,
  dividersAt = [],
}: PropsWithChildren<ButtonGroupProps>) => {
  const nonNullChildren = Children.toArray(children).filter((child) => !!child);
  const childrenCount = nonNullChildren.length;

  return (
    <div
      className={cx(
        'w-fit-content flex items-center space-x-1 rounded-2xl p-1',
        supportTheme ? 'bg-gray-20 dark:bg-white10' : 'bg-black80',
        className
      )}
    >
      {nonNullChildren.map((child, index) => {
        const isLast = childrenCount - 1 <= index;
        const showDivider = (!isLast && hasDivider) || dividersAt.includes(index);

        return (
          <Fragment key={`${child.toString()}-${index}`}>
            {child}
            {showDivider && (
              <Divider className="dark:bg-white20 mr-2 hidden !h-8 md:block" verticalSpace="xs" isVertical />
            )}
          </Fragment>
        );
      })}
    </div>
  );
};

export default ButtonGroup;
