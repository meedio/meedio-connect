import Divider from '@shared/components/Divider/Divider';
import Switch from '@shared/components/Switch/Switch';
import { useTranslation } from 'react-i18next';

import SettingsCard from 'modules/SettingsModal/SettingsCard/SettingsCard';

import CameraPreview from './CameraPreview';
import { useMediaDevicesSettingsContext } from '../MediaDevicesSettingsContext';
import OptionsDropdown from '../OptionsDropdown';

const VideoSettings = () => {
  const { t } = useTranslation();
  const { videoOptions, isVideoEnabled, toggleCamera, isVideoLoading } = useMediaDevicesSettingsContext();

  const isEnabled = isVideoEnabled && !!videoOptions.length;
  const title = isEnabled ? t('camera_on') : t('camera_off');

  return (
    <SettingsCard>
      <SettingsCard.Content className="space-y-4">
        {!!videoOptions.length && <CameraPreview />}
        <OptionsDropdown title={t('camera')} options={videoOptions} disabledTitle={t('no_camera_detected')} />
        <Divider />
        <SettingsCard.Content.DescriptionWrapper title={title} subtitle={t('you_can_enable_or_disable_your_camera')}>
          <Switch checked={isEnabled} onChange={toggleCamera} isLoading={isVideoLoading} />
        </SettingsCard.Content.DescriptionWrapper>
      </SettingsCard.Content>
    </SettingsCard>
  );
};

export default VideoSettings;
