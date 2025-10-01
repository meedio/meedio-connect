import { memo, SVGProps } from 'react';

import { IconType } from 'utils/types';

interface IconProps extends SVGProps<SVGSVGElement> {
  isActive: boolean;
  offIcon: IconType;
  onIcon: IconType;
}

const ToggleIcon = ({ isActive, offIcon, onIcon, ...rest }: IconProps) => {
  const Icon = isActive ? onIcon : offIcon;

  return <Icon {...rest} />;
};

export default memo(ToggleIcon);
