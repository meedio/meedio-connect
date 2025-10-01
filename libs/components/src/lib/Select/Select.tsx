import { Placement } from '@floating-ui/react-dom-interactions';
import cx from 'classnames';
import { PropsWithChildren } from 'react';

import { IconType } from 'utils/types';

import { ReactComponent as ArrowDown } from '../../assets/icons/ArrowDown.svg';
import { DefaultFormProps } from '../../types/sharedTypes';
import { defaultHoverTransition } from '../../utils/utils';
import DropdownButton, { SelectOptionType } from '../DropdownButton/DropdownButton';
import { DropdownSelectionProps } from '../DropdownButton/DropdownSelection';

const variants = {
  normal: {
    default: 'border-gray-40 text-gray-70 bg-white hover:border-primary-50',
    open: 'border-primary-50 text-black bg-white',
    alert: '!border-alert-50 !text-black',
    disabled: 'border-gray-40 text-gray-50 bg-gray-20 cursor-default',
  },
  contrast: {
    default: 'border-white40 text-white bg-transparent hover:border-white',
    open: 'border-white text-white bg-transparent',
    alert: '!border-alert-50',
    disabled: 'border-white40 text-white40 bg-white20 cursor-default',
  },
};

const iconColors = {
  normal: { disabled: 'stroke-gray-50', icon: 'stroke-gray-60', arrow: 'stroke-black' },
  contrast: { disabled: 'stroke-white40', icon: 'stroke-white', arrow: 'stroke-white' },
};

const selectSizes = {
  lg: 'h-14 px-4 space-x-4 text-size-lg rounded-2xl',
  md: 'h-12 px-4 space-x-3 text-size-md rounded-2xl',
  sm: 'h-10 px-3 space-x-2 text-size-sm rounded-xl',
  mdCompact: 'h-12 px-3 space-x-3 text-size-md rounded-2xl',
};

export type SelectSize = keyof typeof selectSizes;

export interface SelectProps extends DefaultFormProps {
  icon?: IconType;
  placement?: Placement;
  options: DropdownSelectionProps[];
  setSelectedOption?: SelectOptionType;
  dropdownContainerClass?: string;
  renderDropdown?: boolean;
  id?: string;
  className?: string;
  wrapperClassName?: string;
}

const Select = ({
  children,
  size = 'md',
  isContrast = false,
  isAlert = false,
  icon: Icon,
  placement = 'bottom',
  disabled = false,
  options,
  setSelectedOption,
  dropdownContainerClass,
  renderDropdown = true,
  id,
  className,
  wrapperClassName,
}: PropsWithChildren<SelectProps>) => {
  const iconClassNames = `stroke-1.5 shrink-0 ${size === 'sm' ? 'w-5 h-5' : 'w-6 h-6'}`;
  const [stateStyles, iconColor] = isContrast
    ? [variants.contrast, iconColors.contrast]
    : [variants.normal, iconColors.normal];

  return (
    <DropdownButton
      options={options}
      placement={placement}
      wrapperClassName={wrapperClassName}
      disabled={disabled}
      setSelectedOption={setSelectedOption}
      dropdownContainerClass={cx('w-full', dropdownContainerClass)}
      id={id}
    >
      {({ open }) => {
        const selectOpenStateClassNames = open ? stateStyles.open : stateStyles.default;
        const selectClassNames = disabled ? stateStyles.disabled : selectOpenStateClassNames;

        const isOpeningDown = placement?.includes('bottom');
        const shouldArrowPointUp = (isOpeningDown && open) || (!isOpeningDown && !open);

        return (
          <div
            className={cx(
              'flex w-full select-none items-center border',
              defaultHoverTransition,
              selectClassNames,
              selectSizes[size],
              className,
              {
                [stateStyles.alert]: isAlert,
              }
            )}
          >
            {Icon && <Icon className={cx(iconClassNames, disabled ? iconColor.disabled : iconColor.icon)} />}
            {children && <span className="w-full truncate text-left">{children}</span>}
            {renderDropdown && (
              <ArrowDown
                className={cx(iconClassNames, disabled ? iconColor.disabled : iconColor.arrow, {
                  'rotate-180': shouldArrowPointUp,
                })}
              />
            )}
          </div>
        );
      }}
    </DropdownButton>
  );
};

export default Select;
