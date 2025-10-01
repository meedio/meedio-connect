import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { ReactComponent as Effects } from 'assets/icons/Effects.svg';
import { ReactComponent as Microphone } from 'assets/icons/Microphone.svg';
import { ReactComponent as Video } from 'assets/icons/Video.svg';
import SettingsModal from 'modules/SettingsModal/SettingsModal';

import AudioSettings from './AudioSettings/AudioSettings';
import { MediaDevicesSettingsContext, MediaDevicesSettingsContextType } from './MediaDevicesSettingsContext';
import VideoSettings from './VideoSettings/VideoSettings';
import VisualEffectsSettings from './VisualEffectsSettings/VisualEffectsSettings';

enum Tabs {
  VIDEO,
  MICROPHONE,
  VIDEO_EFFECTS,
}

interface MediaDevicesSettingsProps extends MediaDevicesSettingsContextType {
  onClose: () => void;
  isBlurEnabled: boolean;
}

const MediaDevicesSettings = ({ onClose, isBlurEnabled, ...props }: MediaDevicesSettingsProps) => {
  const { t } = useTranslation();

  const videoSettingsTab = {
    id: Tabs.VIDEO,
    title: t('video'),
    icon: Video,
    contentComponent: VideoSettings,
  };

  const initialTabs = [
    videoSettingsTab,
    {
      id: Tabs.MICROPHONE,
      title: t('audio'),
      icon: Microphone,
      contentComponent: AudioSettings,
    },
  ];

  const [tabs, setTabs] = useState(initialTabs);

  useEffect(() => {
    const hasVideoEffectsTab = tabs.some(({ id }) => id === Tabs.VIDEO_EFFECTS);

    if (isBlurEnabled && !hasVideoEffectsTab) {
      setTabs((prevTabs) => [
        ...prevTabs,
        {
          id: Tabs.VIDEO_EFFECTS,
          title: t('video_effects'),
          icon: Effects,
          contentComponent: VisualEffectsSettings,
        },
      ]);
    }
  }, [isBlurEnabled, t, tabs]);

  return (
    <MediaDevicesSettingsContext.Provider value={props}>
      <SettingsModal size="md" tabs={tabs} title={t('settings')} onClose={onClose} />
    </MediaDevicesSettingsContext.Provider>
  );
};

export default MediaDevicesSettings;
