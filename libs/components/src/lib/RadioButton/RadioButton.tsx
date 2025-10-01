import cx from 'classnames';
import { HTMLAttributes, PropsWithChildren } from 'react';

import { ReactComponent as Circle } from '../../assets/icons/Circle.svg';
import { defaultHoverTransition } from '../../utils/utils';
import TextBox from '../Checkbox/TextBox';
import { CheckboxSizeType, radioSizes } from '../Checkbox/utils';

export interface Props extends HTMLAttributes<HTMLInputElement> {
  id: string;
  checked: boolean;
  description?: string;
  size?: CheckboxSizeType;
  disabled?: boolean;
  readonly?: boolean;
  value?: string;
  containerClassName?: string;
}

const RadioButton = ({
  children,
  description,
  disabled,
  checked,
  size = 'md',
  className,
  readonly,
  id,
  containerClassName,
  ...props
}: PropsWithChildren<Props>) => {
  const { radioSize, checkedSize } = radioSizes[size];

  const hasTextBox = !!(children || description);

  return (
    <div className={cx('flex', { 'space-x-3 items-center font-light': hasTextBox }, containerClassName)}>
      <div className="flex items-center justify-center h-fit relative">
        <input
          {...props}
          id={id}
          type="radio"
          checked={checked}
          disabled={disabled}
          readOnly={readonly}
          className={cx(
            'border border-gray-40 cursor-pointer rounded-full', //general styles
            'disabled:bg-gray-20 disabled:border-gray-40 disabled:cursor-default disabled:hover:ring-0', //disabled styles
            'hover:bg-white hover:ring-2 ring-complementary-20 hover:border-complementary-50', //not checked styles
            'checked:hover:border-complementary-50 checked:hover:bg-white checked:bg-white checked:border-complementary-50', //checked styles
            'focus:ring-0 focus:hover:ring-2 focus:ring-offset-0 focus:ring-complementary-20 focus-within:!bg-white focus-within:border focus-within:!border-complementary-50 focus-within:hover:!border-complementary-50', //focus styles
            radioSize,
            defaultHoverTransition,
            className
          )}
        />
        {checked && (
          <Circle
            className={cx(
              'fill-primaryComp-50 pointer-events-none absolute bottom-1.5 left-1.5 rounded-full',
              checkedSize,
              { '!bg-gray-40': disabled }
            )}
          />
        )}
      </div>
      {hasTextBox && (
        <TextBox>
          {children && (
            <TextBox.Label size={size} disabled={disabled}>
              {children}
            </TextBox.Label>
          )}
          {description && <TextBox.Description description={description} size={size} disabled={disabled} />}
        </TextBox>
      )}
    </div>
  );
};

export default RadioButton;
