import { HTMLAttributes, ReactNode } from 'react';

import { IconType } from 'utils/types';

export interface PopupButtonProps extends HTMLAttributes<HTMLButtonElement> {
  onClick: () => void;
  variant: 'secondaryTertiary' | 'destructive' | 'primary';
  disabled?: boolean;
  loading?: boolean;
}

export interface ConfirmationPopupProps {
  isVisible: boolean;
  onClose: () => void;
  children: ReactNode;
  dataTestId?: string;
  afterLeave?: () => void;
}

export interface ConfirmationContentProps {
  children?: ReactNode;
  icon: IconType;
  iconClassName?: string;
  className?: string;
  containerClassName?: string;
}
