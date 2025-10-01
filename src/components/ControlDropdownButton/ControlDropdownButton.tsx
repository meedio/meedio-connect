import { buttonStyle } from '@shared/components/Button/Button';
import ControlButton from '@shared/components/ControlButton/ControlButton';
import DropdownButton from '@shared/components/DropdownButton/DropdownButton';
import { DropdownSelectionProps } from '@shared/components/DropdownButton/DropdownSelection';
import { defaultHoverTransition } from '@shared/utils';
import cx from 'classnames';
import { HTMLAttributes, memo, MouseEventHandler, ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

import { ReactComponent as AlertCircleFilled } from 'assets/icons/AlertCircleFilled.svg';
import { ReactComponent as ArrowDown } from 'assets/icons/ArrowDown.svg';

interface ControlDropdownButtonProps extends HTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  options: DropdownSelectionProps[];
  disabled?: boolean;
  isActive: boolean;
  isArrowHoverLight?: boolean;
  arrowClassName?: string;
  areDevicesBlocked?: boolean;
  isDisabledModalShown?: boolean;
  loading?: boolean;
  openInPortal?: boolean;
  showModal: () => void;
}

const ControlDropdownButton = ({
  children,
  className,
  options,
  onClick,
  disabled,
  isActive,
  isArrowHoverLight = false,
  arrowClassName,
  areDevicesBlocked = false,
  isDisabledModalShown = true,
  loading = false,
  openInPortal = false,
  showModal,
  ...rest
}: ControlDropdownButtonProps) => {
  const { t } = useTranslation();
  const buttonVariant = isActive ? 'contrastSecondary' : 'destructivePrimary';
  const hasMultipleOptions = options.length > 1;

  const showDisabledModal = isDisabledModalShown ? showModal : undefined;
  const isDisabledAlertCircleVisible = disabled && !loading && isDisabledModalShown;

  const handleClick =
    disabled && !loading ? (showDisabledModal as MouseEventHandler<HTMLButtonElement> | undefined) : onClick;

  return (
    <div className="flex items-center">
      <ControlButton
        className={cx(
          'relative flex items-center md:!mx-0 md:pr-2',
          { 'md:space-x-2': hasMultipleOptions, '!bg-gray-80 !text-gray-50': disabled },
          className
        )}
        onClick={handleClick}
        variant={buttonVariant}
        {...rest}
      >
        {children}
        {isDisabledAlertCircleVisible && <AlertCircleFilled className="absolute -right-[3px] -top-[3px] h-5 w-5" />}
        {hasMultipleOptions && !areDevicesBlocked && (
          <DropdownButton
            options={options}
            //TODO: use compound pattern
            placement="top"
            dropdownOffset={32}
            className="min-w-56 flex flex-col"
            openButtonClassName="bg-white20 !rounded-lg"
            dropdownContainerClass="max-w-[70vw]"
            aria-label={t('select_device')}
            openInPortal={openInPortal}
          >
            {({ open }) => (
              <div
                className={cx(
                  'h-fit-content z-10 hidden !rounded-lg border-none p-0.5 text-gray-100 md:block',
                  isArrowHoverLight && isActive ? 'hover:bg-black5' : 'hover:bg-white20',
                  buttonStyle,
                  defaultHoverTransition,
                  { 'bg-black5': isArrowHoverLight && open }
                )}
              >
                <ArrowDown
                  className={cx(
                    'stroke-1.5 dark:text-white72 h-4 w-4 stroke-current',
                    isActive ? 'text-gray-60' : 'text-white',
                    {
                      'text-gray-60': disabled,
                      'rotate-180': !open,
                    },
                    arrowClassName
                  )}
                />
              </div>
            )}
          </DropdownButton>
        )}
      </ControlButton>
    </div>
  );
};

export default memo(ControlDropdownButton);
