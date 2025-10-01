import { autoUpdate, flip, offset, Placement, shift, useFloating } from '@floating-ui/react-dom-interactions';
import { Menu } from '@headlessui/react';
import cx from 'classnames';
import { ComponentPropsWithoutRef, memo, ReactNode, useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import DropdownSelection, { DropdownSelectionProps } from './DropdownSelection';
import Filter from './Filter';
import { meetingTestingConstants } from '../../../../constants/src/index';
import ConditionalWrapper from '../ConditionalWrapper/ConditionalWrapper';
import Portal from '../Portal/Portal';

export type SelectOptionType = (index: number) => Promise<void> | void;
type FallbackStrategy = 'bestFit' | 'initialPlacement';

export interface DropdownButtonProps extends Omit<ComponentPropsWithoutRef<'div'>, 'children'> {
  placement?: Placement;
  fallbackStrategy?: FallbackStrategy;
  options: DropdownSelectionProps[];
  children: JSX.Element[] | (({ open }: { open: boolean }) => JSX.Element) | ReactNode;
  openButtonClassName?: string;
  setSelectedOption?: SelectOptionType;
  optionClassName?: string;
  disabled?: boolean;
  dropdownContainerClass?: string;
  wrapperClassName?: string;
  dataTestId?: string;
  openInPortal?: boolean;
  shouldPreventPropogation?: boolean;
  hasFilter?: boolean;
  dropdownOffset?: number;
}

const Items = memo(function Items({ className, children }: Pick<DropdownButtonProps, 'className' | 'children'>) {
  return (
    <Menu.Items className={cx('flex h-full flex-col space-y-1 p-2 rounded-2xl outline-none', className)}>
      {children}
    </Menu.Items>
  );
});

const DropdownButton = ({
  className,
  options,
  placement = 'bottom-end',
  fallbackStrategy = 'initialPlacement',
  children,
  setSelectedOption,
  openButtonClassName,
  optionClassName,
  disabled = false,
  dropdownContainerClass,
  wrapperClassName,
  dataTestId,
  openInPortal = false,
  shouldPreventPropogation = true,
  id,
  hasFilter,
  dropdownOffset = 0,
  ...rest
}: DropdownButtonProps) => {
  const { t } = useTranslation();
  const [filteredOptions, setFilteredOptions] = useState(options);
  const { x, y, reference, floating, strategy } = useFloating({
    placement,
    middleware: [offset(dropdownOffset), flip({ fallbackStrategy }), shift()],
    whileElementsMounted: autoUpdate,
  });

  useEffect(() => setFilteredOptions(options), [options]);

  const handleOptionFilter = useCallback(
    (value: string) =>
      setFilteredOptions(options.filter(({ title }) => title.toLowerCase().includes(value.toLowerCase()))),
    [options]
  );

  const optionsToRender = hasFilter ? filteredOptions : options;

  const preventPropagation = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => (shouldPreventPropogation ? event.stopPropagation() : undefined),
    [shouldPreventPropogation]
  );

  return (
    <Menu
      className={cx('relative w-auto', wrapperClassName)}
      as="div"
      id={id}
      onClick={preventPropagation}
      data-testid={dataTestId}
    >
      {({ open }) => (
        <>
          <Menu.Button
            as="div"
            className={cx('w-full outline-none', open && openButtonClassName)}
            onClick={preventPropagation}
            ref={reference}
            tabIndex={0}
            role="button"
            {...rest}
          >
            {children}
          </Menu.Button>
          {open && !disabled && (
            <ConditionalWrapper
              condition={openInPortal}
              wrapper={(children) => <Portal wrapperId="dropdownOptions">{children}</Portal>}
            >
              <div
                className={cx(
                  'z-dropdown rounded-2xl bg-white shadow-dropdown absolute min-w-fit my-2',
                  dropdownContainerClass
                )}
                ref={floating}
                style={{ position: strategy, top: y ?? 0, left: x ?? 0 }}
              >
                <Menu.Items>
                  {hasFilter && <Filter handleOptionFilter={handleOptionFilter} />}
                  <Items className={className}>
                    {!optionsToRender.length && (
                      <p className="text-black py-2 text-center text-size-sm">{t('no_results_found')}</p>
                    )}
                    {optionsToRender.map(
                      (
                        {
                          icon,
                          title,
                          isSelected,
                          hasDivider,
                          onClick,
                          link,
                          className,
                          containerClassName,
                          selectionClassName,
                          dataTestId,
                          endText,
                        },
                        index
                      ) => {
                        const selectItem = () => {
                          if (onClick) onClick();
                          if (setSelectedOption) setSelectedOption(index);
                        };

                        return (
                          <div key={title} className={containerClassName}>
                            <Menu.Item as="div">
                              <DropdownSelection
                                title={title}
                                isSelected={isSelected}
                                icon={icon}
                                endText={endText}
                                data-testid={`${meetingTestingConstants.dropdownOption}-${dataTestId || index}`}
                                textClassName={className}
                                className={cx('cursor-pointer', optionClassName, selectionClassName)}
                                onClick={selectItem}
                                link={link}
                              />
                            </Menu.Item>
                            {hasDivider && <div className="border-gray-5 mx-3 border-t" />}
                          </div>
                        );
                      }
                    )}
                  </Items>
                </Menu.Items>
              </div>
            </ConditionalWrapper>
          )}
        </>
      )}
    </Menu>
  );
};

export default memo(DropdownButton);
