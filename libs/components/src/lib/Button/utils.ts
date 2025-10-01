import cx from 'classnames';

import { ButtonVariant, ButtonSize } from './Button';

const iconMargins = {
  lg: 4,
  md: 3,
  sm: 2,
  // TODO: Potentially remove these after new design system
  xs: 3,
  icon: 0,
  textButton: 3,
  neutral: 3,
};

export const getIconMargins = (size: ButtonSize, variant?: ButtonVariant) => {
  if (variant?.toLowerCase().includes('text')) return 2;
  return iconMargins[size];
};

export const getIconStyle = (size: ButtonSize, iconClass?: string) =>
  cx(size === 'sm' ? 'h-5 w-5' : 'h-6 w-6', iconClass);
