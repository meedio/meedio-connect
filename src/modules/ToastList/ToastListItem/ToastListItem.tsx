import { Transition } from '@headlessui/react';
import ToastComponent from '@shared/components/ToastComponent/Toast';
import { useCallback, useEffect, useState } from 'react';

import useToast from 'contexts/ToastProvider/useToast';

import { toastTransformAnimations, placeholderTransformAnimations, ToastItem } from './utils';

const TTL = 6000;

const ToastListItem = ({
  id,
  variant,
  icon,
  title,
  description,
  size,
  autoDismiss = true,
  hasCloseButton,
  duration,
  onClose,
  onComplete,
  onAction,
  actionText,
  actionButtonVariant,
}: ToastItem) => {
  const { removeToast } = useToast();
  const [show, setShow] = useState(false);

  const initClose = useCallback(() => {
    setShow(false);
    if (onClose) onClose();
  }, [onClose]);

  useEffect(() => {
    setShow(true);

    if (!autoDismiss) return;

    const toastTimeout = setTimeout(initClose, TTL);

    return () => clearTimeout(toastTimeout);
  }, [autoDismiss, initClose]);

  const deleteToast = () => removeToast(id);

  return (
    <Transition show={show}>
      <Transition.Child {...placeholderTransformAnimations} afterLeave={deleteToast} className="overflow-y-hidden">
        <Transition.Child {...toastTransformAnimations} className="flex justify-end">
          <ToastComponent
            size={size}
            variant={variant}
            icon={icon}
            description={description}
            className="mt-2"
            hasCloseButton={hasCloseButton}
            onClose={initClose}
            onComplete={onComplete}
            duration={duration}
            onAction={onAction}
            actionText={actionText}
            actionButtonVariant={actionButtonVariant}
          >
            {title}
          </ToastComponent>
        </Transition.Child>
      </Transition.Child>
    </Transition>
  );
};

export default ToastListItem;
