import { ButtonVariant } from '@shared/components/Button/Button';
import { ToastProps } from '@shared/components/ToastComponent/Toast';
import { ReactElement } from 'react';

const transition = 'transition-all duration-300';
const openedTransition = 'transform opacity-0';
const closedTransition = 'transform opacity-100';

export const toastTransformAnimations = {
  enter: transition,
  enterFrom: openedTransition,
  enterTo: closedTransition,
  leave: transition,
  leaveFrom: closedTransition,
  leaveTo: openedTransition,
};

export const placeholderTransformAnimations = {
  leave: 'transition-all duration-300 delay-600',
  leaveFrom: 'transform h-16',
  leaveTo: 'transform h-0',
};

export type ToastId = string;
export type ToastOptions = Pick<
  ToastProps,
  'variant' | 'icon' | 'hasCloseButton' | 'description' | 'size' | 'duration'
> & {
  id?: ToastId;
  title: string | ReactElement;
  autoDismiss?: boolean;
  onClose?: () => void;
  onComplete?: () => void;
  onAction?: () => void;
  actionText?: string;
  actionButtonVariant?: ButtonVariant;
};

export interface ToastItem extends ToastOptions {
  id: ToastId;
}
