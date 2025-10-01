import { Placement } from '@floating-ui/react-dom-interactions';
import { Transition } from '@headlessui/react';
import cx from 'classnames';
import { MouseEvent, PropsWithChildren } from 'react';

import useTooltip from './useTooltip';
import { getTransitionAnimation } from './utils';
import ConditionalWrapper from '../ConditionalWrapper/ConditionalWrapper';
import Portal from '../Portal/Portal';

const variants = {
  light: { backgroundColor: 'bg-white', labelColor: 'text-black', descriptionColor: 'text-gray-80' },
  dark: { backgroundColor: 'bg-gray-80', labelColor: 'text-white', descriptionColor: 'text-white80' },
};

export type TooltipVariant = keyof typeof variants;
export type TooltipType = 'hover' | 'click';

export interface TooltipProps {
  variant?: TooltipVariant;
  label: string;
  description?: string;
  placement?: Placement;
  type?: TooltipType;
  isVisible?: boolean;
  inGroup?: boolean;
  stopPropagation?: boolean;
  hoverDesktopOnly?: boolean;
  className?: string;
  inPortal?: boolean;
  portalWrapperId?: string;
}

const Tooltip = ({
  children,
  variant = 'light',
  label,
  description,
  placement = 'top',
  type = 'hover',
  isVisible,
  inPortal = false,
  inGroup = false,
  stopPropagation = true,
  hoverDesktopOnly = false,
  portalWrapperId,
  className,
}: PropsWithChildren<TooltipProps>) => {
  const { arrowRef, ref, open, floating, tooltipPlacement, arrowPlacement, getReferenceProps, getFloatingProps } =
    useTooltip(label, placement, type, inGroup, hoverDesktopOnly, isVisible);

  const onClick = (event: MouseEvent<HTMLDivElement>) => {
    if (type === 'click' && stopPropagation) event.stopPropagation();
  };

  const { backgroundColor, descriptionColor, labelColor } = variants[variant];

  return (
    // NOTE: using div, because it unblocks space-x/y usability inside parent
    <div className={className}>
      <div {...getReferenceProps({ onClick })} ref={ref}>
        {children}
      </div>
      <ConditionalWrapper
        condition={inPortal}
        wrapper={(children) => <Portal wrapperId={portalWrapperId}>{children}</Portal>}
      >
        <div className="z-tooltip" style={tooltipPlacement} ref={floating} {...getFloatingProps()}>
          <Transition
            show={open}
            className={cx(
              'shadow-tooltip flex w-max max-w-[180px] cursor-default flex-col rounded-lg p-4 text-center',
              backgroundColor
            )}
            {...getTransitionAnimation(placement)}
          >
            <span className={cx('text-size-sm overflow-hidden whitespace-pre-wrap break-words', labelColor)}>
              {label}
            </span>
            {!!description && (
              <span className={cx('text-size-sm mt-1 overflow-hidden break-words', descriptionColor)}>
                {description}
              </span>
            )}
            <div ref={arrowRef} className={cx('absolute h-2 w-2 rotate-45', backgroundColor)} style={arrowPlacement} />
          </Transition>
        </div>
      </ConditionalWrapper>
    </div>
  );
};

export default Tooltip;
