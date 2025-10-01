import { Switch as SwitchHeadless } from '@headlessui/react';
import cx from 'classnames';
import { HTMLAttributes, PropsWithChildren } from 'react';

import { switchSizes } from './utils';
import { ReactComponent as Ellipse } from '../../assets/icons/Ellipse.svg';
import TextBox from '../Checkbox/TextBox';
import { CheckboxSizeType } from '../Checkbox/utils';

export interface SwitchProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
  checked: boolean;
  description?: string;
  onChange?: (state: boolean) => void;
  dataTestId?: string;
  size?: CheckboxSizeType;
  disabled?: boolean;
  isLoading?: boolean;
}

const Switch = ({
  checked,
  onChange,
  className,
  dataTestId,
  description,
  size = 'md',
  children,
  disabled,
  isLoading = false,
}: // ...rest
PropsWithChildren<SwitchProps>) => {
  const { containerSize, dotSize, dotPosition } = switchSizes[size];

  const bgColor = isLoading ? 'bg-primaryComp-30' : 'bg-primaryComp-50';
  const [backgroundColor, hoverBackgroundColor, thumbPosition] = checked
    ? [bgColor, 'hover:bg-primaryComp-20', dotPosition]
    : ['bg-gray-40', 'hover:bg-primaryComp-30', `-${dotPosition}`];

  return (
    <div className={cx('flex', { 'space-x-3': children || description })}>
      <SwitchHeadless
        disabled={disabled || isLoading}
        checked={checked}
        onChange={onChange}
        className={cx(
          'cursor-pointer rounded-full border-transparent',
          { 'disabled:bg-gray-40 disabled:cursor-default': !isLoading },
          backgroundColor,
          containerSize,
          className
        )}
        data-testid={dataTestId}
        // TODO: fix this, not sure whether we need rest here or not?
        // {...rest}
      >
        <span
          className={cx(
            'pointer-events-none inline-block transform self-center rounded-full bg-white ring-0 transition duration-100 ease-in-out',
            thumbPosition,
            hoverBackgroundColor,
            dotSize,
            { '!bg-gray-20': disabled }
          )}
        >
          {isLoading && <Ellipse className={cx('stroke-gray-40 stroke-1.5 animate-spin', dotSize)} />}
        </span>
      </SwitchHeadless>
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

export default Switch;
