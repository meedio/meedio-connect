import { Dialog, Transition } from '@headlessui/react';
import Button from '@shared/components/Button/Button';
import { insetZero } from '@shared/utils';
import cx from 'classnames';
import { FC, PropsWithChildren, useRef } from 'react';

import useOnClickOutside from 'hooks/useOnClickOutside';

import { transformAnimations, opacityAnimations } from './animations';
import { ConfirmationContentProps, ConfirmationPopupProps, PopupButtonProps } from './types';

const PopupButton: FC<PopupButtonProps> = ({ children, onClick, variant, disabled = false, loading, ...rest }) => (
  <Button
    {...rest}
    className="w-full !font-medium"
    size="sm"
    variant={variant}
    onClick={onClick}
    disabled={disabled}
    loading={loading}
  >
    {children}
  </Button>
);

const Footer = ({ children }: PropsWithChildren) => (
  <div className="flex flex-col-reverse items-center justify-between space-y-4 space-y-reverse md:flex-row md:space-x-4 md:space-y-0">
    {children}
  </div>
);

const Content = ({ children, icon: Icon, iconClassName, className, containerClassName }: ConfirmationContentProps) => (
  <div className={cx('flex flex-col items-center space-y-4 p-4', containerClassName)}>
    <Icon className={cx('h-8 w-8 stroke-current stroke-2', iconClassName)} />
    <p className={cx('text-gray-80 text-size-sm text-center', className)}>{children}</p>
  </div>
);

const ConfirmationPopup = ({ isVisible, onClose, children, dataTestId, afterLeave }: ConfirmationPopupProps) => {
  const childRef = useRef<HTMLDivElement>(null);
  useOnClickOutside(childRef, onClose);

  return (
    <Transition.Root show={isVisible} as="div" appear afterLeave={afterLeave}>
      <Dialog onClose={onClose} className={cx('side-area-padding absolute z-50', insetZero)} as="div">
        <div className="flex h-full w-full items-center justify-center">
          <Transition.Child
            {...opacityAnimations}
            className={cx('-z-modal bg-black15 absolute h-full w-full items-center', insetZero)}
            onClick={onClose}
            as="div"
          />
          <Transition.Child
            {...transformAnimations}
            className="z-modal max-w-100 fixed box-content flex h-full w-full items-center justify-center overflow-hidden px-3 py-4"
            as="div"
          >
            <div
              data-testid={dataTestId}
              className="flex max-h-full w-full flex-col space-y-4 overflow-y-auto rounded-2xl bg-white p-4 m-4"
              ref={childRef}
            >
              {children}
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

ConfirmationPopup.Content = Content;
ConfirmationPopup.Footer = Footer;
ConfirmationPopup.Button = PopupButton;

export default ConfirmationPopup;
