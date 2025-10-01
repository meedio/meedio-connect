import cx from 'classnames';
import { createContext, forwardRef, PropsWithChildren, Ref } from 'react';

import InputComponent, { InputProps } from './Input';
import InputDetails from './InputDetails';
import useInputContext from './useInputContext';
import { InputSizeType, InputVariantType } from './utils';
import ErrorMessage, { ValidationError } from '../ErrorMessage/ErrorMessage';

export const InputContext = createContext<InputGroupProps | null>(null);

interface ClassNameProp {
  className?: string;
}

export interface InputGroupProps extends ClassNameProp {
  label?: string;
  description?: string;
  errorMessage?: ValidationError | string;
  size?: InputSizeType;
  variant?: InputVariantType;
  disabled?: boolean;
}

const roundedStyle = 'first:rounded-l-xl last:rounded-r-xl';
const borderStyle = 'border-y border-gray-40 first:border-l last:border-r';

const TextBlock = ({ children, className }: PropsWithChildren<ClassNameProp>) => (
  <span
    className={cx(
      'bg-gray-10 inline-flex items-center justify-center px-4 py-3 font-light text-black',
      borderStyle,
      roundedStyle,
      className
    )}
  >
    {children}
  </span>
);

const InputBlock = ({ containerClassName, ...rest }: InputProps) => {
  const { variant, size, errorMessage, disabled } = useInputContext();

  return (
    <InputComponent
      containerClassName={cx('group hover:!border focus-within:!border', borderStyle, roundedStyle, containerClassName)}
      className={cx({
        'focus-within:px-[15px] hover:px-[15px] group-first:px-4 focus-within:group-first:pr-[15px] hover:group-first:pr-[15px] group-last:px-4 focus-within:group-last:pl-[15px] hover:group-last:pl-[15px] focus-within:group-only:px-4 hover:group-only:px-4':
          !errorMessage,
      })}
      variant={variant}
      hasError={!!errorMessage}
      inputSize={size}
      hasBorder={false}
      isRounded={false}
      disabled={disabled}
      {...rest}
    />
  );
};

const Input = forwardRef((props: InputProps, ref: Ref<HTMLInputElement> | undefined) => {
  const { variant, size, errorMessage, disabled } = useInputContext();

  return (
    <InputComponent
      variant={variant}
      inputSize={size}
      hasError={!!errorMessage}
      disabled={disabled}
      ref={ref}
      {...props}
    />
  );
});

Input.displayName = 'Input';

const InputGroup = ({
  label,
  description,
  children,
  errorMessage,
  variant = 'regular',
  size = 'md',
  disabled,
  className,
}: PropsWithChildren<InputGroupProps>) => (
  <div className={cx('flex w-full flex-col space-y-2', className)}>
    <InputContext.Provider value={{ size, variant, errorMessage, label, description, disabled }}>
      <InputDetails>
        <div className="flex">{children}</div>
      </InputDetails>
    </InputContext.Provider>
    <ErrorMessage message={errorMessage} />
  </div>
);

InputGroup.Input = Input;
InputGroup.TextBlock = TextBlock;
InputGroup.InputBlock = InputBlock;

export default InputGroup;
