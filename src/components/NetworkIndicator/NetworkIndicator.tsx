import Tooltip from '@shared/components/Tooltip/Tooltip';
import { ConnectionQuality } from 'livekit-client';
import { useTranslation } from 'react-i18next';

import useTheme from 'hooks/useTheme';

import { capitalizeFirstLetter, getNetworkIndicatorIcon } from './utils';

interface NetworkIndicatorProps {
  quality: ConnectionQuality;
  id: string;
}

const NetworkIndicator = ({ quality, id }: NetworkIndicatorProps) => {
  const { t } = useTranslation();
  const { tooltipVariant } = useTheme();

  const Icon = getNetworkIndicatorIcon(quality);
  const translation = capitalizeFirstLetter(t('network_connection_state', { quality }));

  return (
    <Tooltip label={translation} variant={tooltipVariant} inPortal portalWrapperId={id} placement="top-start">
      <Icon className="w-4 h-4" />
    </Tooltip>
  );
};

export default NetworkIndicator;
