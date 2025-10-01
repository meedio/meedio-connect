import cx from 'classnames';
import { HTMLAttributes, PropsWithChildren } from 'react';

import TextBox from './TextBox';
import { checkboxSizes, CheckboxSizeType } from './utils';
import { defaultHoverTransition } from '../../utils/utils';

const variants = {
  contrast:
    'checked:bg-primaryComp-50 checked:hover:bg-primaryComp-50 checked:focus:bg-primaryComp-50 bg-transparent border-white40 hover:bg-white10 hover:border-complementary-50 checked:hover:ring-2 checked:hover:ring-white20 disabled:!bg-gray-80 disabled:!border-gray-70',
  regular:
    'checked:bg-primaryComp-50 checked:hover:bg-primaryComp-50 checked:focus:bg-primaryComp-50 bg-white border-gray-40 hover:bg-gray-10 hover:border-complementary-50 checked:hover:ring-2 checked:hover:ring-primaryComp-20 disabled:bg-gray-30 disabled:border-gray-40',
};

export type CheckboxVariant = keyof typeof variants;

export interface CheckboxProps extends HTMLAttributes<HTMLDivElement> {
  description?: string;
  size?: CheckboxSizeType;
  checked: boolean;
  hasError?: boolean;
  variant?: CheckboxVariant;
  className?: string;
  containerClassName?: string;
  disabled?: boolean;
}

const Checkbox = ({
  children,
  description,
  size = 'md',
  hasError,
  className,
  containerClassName,
  variant = 'regular',
  disabled,
  ...props
}: PropsWithChildren<CheckboxProps>) => {
  const { checkboxSize } = checkboxSizes[size];

  return (
    <div className={cx('flex space-x-3', containerClassName)}>
      <input
        {...props}
        type="checkbox"
        className={cx(
          'cursor-pointer rounded border outline-0 focus:ring-0 focus:ring-offset-0',
          { '!border-red-500': hasError, 'pointer-events-none': disabled },
          defaultHoverTransition,
          variants[variant],
          checkboxSize,
          className
        )}
        disabled={disabled}
      />
      <TextBox>
        {children && (
          <TextBox.Label size={size} disabled={disabled}>
            {children}
          </TextBox.Label>
        )}
        {description && <TextBox.Description description={description} size={size} disabled={disabled} />}
      </TextBox>
    </div>
  );
};

export default Checkbox;
