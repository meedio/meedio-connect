import cx from 'classnames';
import { ForwardedRef, forwardRef, InputHTMLAttributes, useImperativeHandle, useRef } from 'react';

import { IconType } from 'utils/types';

import { inputSizes, InputSizeType, inputVariants, InputVariantType } from './utils';
import { defaultHoverTransition } from '../../utils/utils';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  variant?: InputVariantType;
  inputSize?: InputSizeType;
  containerClassName?: string;
  iconClassName?: string;
  isRounded?: boolean;
  hasBorder?: boolean;
  hasError?: boolean;
  icon?: IconType;
  onIconClick?: () => void;
  onContainerClick?: () => void;
}

const Input = (
  {
    variant = 'regular',
    inputSize = 'md',
    containerClassName,
    isRounded = true,
    hasBorder = true,
    hasError,
    icon: Icon,
    onIconClick,
    onContainerClick,
    iconClassName,
    className,
    disabled,
    ...rest
  }: InputProps,
  ref?: ForwardedRef<HTMLInputElement>
) => {
  const internalRef = useRef<HTMLInputElement>(null);
  useImperativeHandle<HTMLInputElement | null, HTMLInputElement | null>(ref, () => internalRef.current);

  const { inputStyle, borderStyle, iconColor } = inputVariants[variant];
  const isInputEmpty = !internalRef.current?.value;
  const isInputActive = !isInputEmpty && !hasError && !disabled;

  return (
    <div
      className={cx(
        'relative flex w-full items-center overflow-hidden focus-within:ring-4',
        defaultHoverTransition,
        {
          '!border-alert-50 border': hasError,
          [borderStyle.disabledColor]: disabled,
          [borderStyle.activeColor]: isInputActive,
          [borderStyle.defaultColor]: !disabled && !hasError && !isInputActive,
          'rounded-2xl': isRounded,
          border: hasBorder,
        },
        borderStyle.main,
        containerClassName
      )}
      onClick={onContainerClick}
    >
      <input
        className={cx(
          'peer w-full border-none font-light placeholder-shown:truncate focus:outline-none focus:ring-transparent',
          { 'rounded-2xl': isRounded, '!pr-12': Icon },
          inputStyle,
          inputSizes[inputSize],
          className
        )}
        ref={internalRef}
        disabled={disabled}
        required
        {...rest}
      />
      {Icon && (
        <Icon
          className={cx(
            'absolute right-4 h-6 w-6 select-none',
            { 'cursor-pointer': onIconClick },
            iconColor,
            iconClassName
          )}
          onClick={onIconClick}
        />
      )}
    </div>
  );
};

export default forwardRef(Input);
