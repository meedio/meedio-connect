import cx from 'classnames';
import { useTranslation } from 'react-i18next';

import { IconType } from 'utils/types';

import RoundedContainer from './RoundedContainer/RoundedContainer';
import { getStatusLabelProps } from './utils';

interface StatusLabelProps {
  className?: string;
  isVideoOn: boolean;
  isAudioOn: boolean;
  isAcquiringTracks: boolean;
}

interface StatusLabelIconProps {
  icon: IconType;
}

const StatusLabelIcon = ({ icon: Icon }: StatusLabelIconProps) => (
  <div className="bg-white20 rounded-full p-0.5">
    <Icon className="stroke-1.5 h-4 w-4 stroke-current text-white" />
  </div>
);

const StatusLabel = ({ className, isVideoOn, isAudioOn, isAcquiringTracks }: StatusLabelProps) => {
  const { t } = useTranslation();
  const { text, icons } = getStatusLabelProps({ isAcquiringTracks, isVideoOn, isAudioOn, t });

  if (!text) return null;

  return (
    <RoundedContainer className={cx('z-30 hidden space-x-1 !pr-4 md:flex', { '!pl-4': !icons }, className)}>
      {icons && icons.map((icon, index) => <StatusLabelIcon key={index} icon={icon} />)}
      <span className="text-size-xs">{t(text)}</span>
    </RoundedContainer>
  );
};

export default StatusLabel;
