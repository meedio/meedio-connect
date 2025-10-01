import cx from 'classnames';
import { ReactNode, MouseEvent } from 'react';

import { meetingTestingConstants } from '../../../../constants/src';
import { ReactComponent as X } from '../../assets/icons/X.svg';
import { defaultHoverTransition, insetZero } from '../../utils/utils';
import Portal from '../Portal/Portal';

export interface PopupProps {
  children?: ReactNode;
  isVisible: boolean;
  closePopup?: () => void;
  className?: string;
  backdropClassName?: string;
  isViewportScrollable?: boolean;
  isDesktopViewportScrollable?: boolean;
  dataTestId?: string;
  wrapperId?: string;
}

type PopupElementProps = Pick<PopupProps, 'children' | 'className' | 'dataTestId'>;
type IconProps = Pick<PopupProps, 'children'>;
type BackDropProps = Pick<PopupProps, 'className' | 'closePopup'>;
type PopupFooterProps = PopupElementProps & {
  wrapperClassName?: string;
};

export const popupContainerWidthStyle = 'md:max-w-100 max-w-[21.4375rem]';

const Icon = ({ children }: IconProps) => <div className="mb-8 mt-4 flex w-full justify-center">{children}</div>;

const Footer = ({ children, className, wrapperClassName }: PopupFooterProps) => (
  <div className={cx('flex w-full pb-4 md:mb-0 md:flex-row md:px-6 md:pb-6', wrapperClassName)}>
    <div
      className={cx('border-gray-20 bottom-area-padding flex w-full border-t px-6 pt-6 md:flex-row md:px-0', className)}
    >
      {children}
    </div>
  </div>
);

const Header = ({ children, className }: PopupElementProps) => (
  <span
    className={cx(
      'border-gray-20 text-size-lg shadow-modal relative flex h-16 shrink-0 items-center justify-center border-b font-medium text-black md:mx-4 md:shadow-none',
      className
    )}
  >
    {children}
  </span>
);

//NOTE: HeaderRegular is header version that doesn't change style at mobile sizes
const HeaderRegular = ({ children, className }: PopupElementProps) => (
  <div className={cx('border-gray-20 flex items-center justify-between border-b px-6 py-4 font-medium', className)}>
    {children}
  </div>
);

const CloseIcon = ({ closePopup, className }: BackDropProps) => (
  <div
    className={cx(
      'absolute right-4 cursor-pointer p-1.5 md:right-0 hover:bg-gray-30 rounded-xl',
      defaultHoverTransition,
      className
    )}
    onClick={closePopup}
    data-testid={meetingTestingConstants.closeModalButton}
  >
    <X className={cx('h-5 w-5 stroke-black', className)} />
  </div>
);

const ScrollContainer = ({ children, className }: PopupElementProps) => (
  <div className={cx('m-auto flex w-full flex-grow flex-col overflow-y-auto p-6', className)}>{children}</div>
);

const Spacing = () => <div className="h-4 w-4 flex-shrink-0" />;
const Divider = () => <div className="border-gray-20 w-full border-t" />;

const BackDrop = ({ closePopup, className }: BackDropProps) => (
  <div className={cx('bg-black15 fixed h-full w-full', insetZero, className)} onClick={closePopup} />
);

const mobileContainerStyle = 'z-20 flex flex-col w-full max-h-full bg-white shadow-xs md:h-auto';

const FullScreenContainer = ({ children, className }: PopupElementProps) => (
  <div className={cx('h-full rounded-t-2xl md:rounded-2xl', mobileContainerStyle, className)}>{children}</div>
);

const Container = ({ children, className, dataTestId }: PopupElementProps) => (
  <div
    className={cx('mb-14 h-auto rounded-2xl md:mb-0', mobileContainerStyle, popupContainerWidthStyle, className)}
    data-testid={dataTestId}
  >
    {children}
  </div>
);

const Popup = ({
  children,
  isVisible,
  closePopup,
  className,
  backdropClassName,
  isViewportScrollable = false,
  isDesktopViewportScrollable = false,
  wrapperId = 'popup-root',
}: PopupProps) => {
  if (!isVisible) return null;

  const preventPropagation = (event: MouseEvent<HTMLDivElement>) => event.stopPropagation();

  const isScrollable = isViewportScrollable || isDesktopViewportScrollable;

  return (
    <Portal wrapperId={wrapperId}>
      <div
        className={cx(
          'fixed flex h-full w-full',
          insetZero,
          {
            'bg-black15': isScrollable,
            'overflow-auto': isViewportScrollable,
            'md:overflow-auto': isDesktopViewportScrollable,
          },
          backdropClassName
        )}
        onClick={(isScrollable && closePopup) || undefined}
      >
        <div
          className={cx(
            'md:w-100 relative mx-auto mt-14 flex h-full w-full flex-col items-center justify-center pb-14 md:mt-0 md:pb-4 md:pt-4',
            className
          )}
          onClick={preventPropagation}
        >
          {children}
        </div>
        {!isScrollable && <BackDrop closePopup={closePopup} className={backdropClassName} />}
      </div>
    </Portal>
  );
};

Popup.Spacing = Spacing;
Popup.Divider = Divider;
Popup.Icon = Icon;
Popup.Header = Header;
Popup.HeaderRegular = HeaderRegular;
Popup.Footer = Footer;
Popup.ScrollContainer = ScrollContainer;
Popup.CloseIcon = CloseIcon;
Popup.Container = Container;
Popup.FullScreenContainer = FullScreenContainer;

export default Popup;
