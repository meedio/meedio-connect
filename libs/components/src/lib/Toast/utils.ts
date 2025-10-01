import { ReactNode } from 'react';

import { variants } from './Toast';

export interface ToastProps {
  variant: ToastVariant;
  className?: string;
  children?: ReactNode;
}

export type ToastVariant = keyof typeof variants;
export type SubtitleProps = Pick<ToastProps, 'children' | 'variant'>;
export type ActionProps = SubtitleProps & { onClick: () => void };
export type OuterContainerProps = Pick<ToastProps, 'children' | 'className'>;
export type HeaderProps = OuterContainerProps & { title: string };
export type CloseIconProps = { onClose: () => void };
export type NotificationProps = { children: ReactNode; appName?: string };
