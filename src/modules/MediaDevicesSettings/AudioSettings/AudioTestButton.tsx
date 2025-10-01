import Button from '@shared/components/Button/Button';
import { useTranslation } from 'react-i18next';

import { ReactComponent as Sound } from 'assets/icons/Sound.svg';
import clip from 'assets/sounds/testClip.mp3';
import useSound from 'hooks/useSound/useSound';

import { useMediaDevicesSettingsContext } from '../MediaDevicesSettingsContext';

const AudioTestButton = () => {
  const { t } = useTranslation();
  const { activeAudioOutputId } = useMediaDevicesSettingsContext();
  const { isPlaying, playSound } = useSound(clip, activeAudioOutputId);

  return (
    <Button
      variant="secondaryTertiary"
      disabled={isPlaying}
      size="sm"
      className="flex !px-6 py-2.5"
      onClick={playSound}
    >
      <Sound className="mr-2 h-5 w-5 stroke-current" />
      <span className="text-size-sm truncate font-medium !leading-5">{isPlaying ? t('playing') : t('test')}</span>
    </Button>
  );
};

export default AudioTestButton;
