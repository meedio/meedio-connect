import cx from 'classnames';

import { IconType } from 'utils/types';

const variants = {
  gray: 'bg-white20',
  alert: 'bg-tertiary-50',
};

interface ParticipantDetailsIconProps {
  icon: IconType;
  variant?: keyof typeof variants;
}

const ParticipantDetailsIcon = ({ icon: Icon, variant = 'alert', ...rest }: ParticipantDetailsIconProps) => (
  <div className={cx('flex h-full items-center rounded-full p-0.5', variants[variant])} {...rest}>
    <Icon className="stroke-1.5 h-4 w-4 stroke-current" />
  </div>
);

export default ParticipantDetailsIcon;
