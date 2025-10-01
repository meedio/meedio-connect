import { iconSizes, variants } from './Banner';

export type BannerVariant = keyof typeof variants;
export type IconSize = keyof typeof iconSizes;
export type ClassNameProp = Pick<BannerProps, 'className'>;

export interface BannerProps {
  variant: BannerVariant;
  className?: string;
}

export interface CloseIconProps {
  onClose: () => void;
}

export interface ActionProps {
  onClick: () => void;
}

export interface IconProps extends Pick<BannerProps, 'variant'> {
  size?: IconSize;
}
