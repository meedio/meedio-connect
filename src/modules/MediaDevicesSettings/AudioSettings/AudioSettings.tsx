import { useModal } from '@ebay/nice-modal-react';
import Divider from '@shared/components/Divider/Divider';
import Switch from '@shared/components/Switch/Switch';
import { useTranslation } from 'react-i18next';

import NoPermissionsModal from 'modules/NoPermissionsModal/NoPermissionsModal';
import SettingsCard from 'modules/SettingsModal/SettingsCard/SettingsCard';

import AudioOutputSelect from './AudioOutputSelect';
import MicrophoneIndicator from './MicrophoneIndicator';
import { useMediaDevicesSettingsContext } from '../MediaDevicesSettingsContext';
import OptionsDropdown from '../OptionsDropdown';

const AudioSettings = () => {
  const { t } = useTranslation();
  const { audioOptions, isAudioEnabled, toggleMicrophone, isAudioLoading } = useMediaDevicesSettingsContext();
  const { show } = useModal(NoPermissionsModal);

  const isEnabled = isAudioEnabled && !!audioOptions.length;
  const title = isEnabled ? t('microphone_on') : t('microphone_off');

  const handleToggle = audioOptions.length ? toggleMicrophone : show;

  return (
    <SettingsCard>
      <SettingsCard.Content className="space-y-4">
        <div className="flex md:items-end md:space-x-2 md:space-y-0 md:flex-row flex-col space-y-2">
          <OptionsDropdown title={t('microphone')} options={audioOptions} disabledTitle={t('no_microphone_detected')} />
          {!!audioOptions.length && <MicrophoneIndicator />}
        </div>
        <AudioOutputSelect />
        <>
          <Divider />
          <SettingsCard.Content.DescriptionWrapper
            title={title}
            subtitle={t('you_can_enable_or_disable_your_microphone')}
          >
            <Switch checked={isEnabled} onChange={() => handleToggle()} isLoading={isAudioLoading} />
          </SettingsCard.Content.DescriptionWrapper>
        </>
      </SettingsCard.Content>
    </SettingsCard>
  );
};

export default AudioSettings;
