import cx from 'classnames';
import { useTranslation } from 'react-i18next';

import AudioTestButton from './AudioTestButton';
import { useMediaDevicesSettingsContext } from '../MediaDevicesSettingsContext';
import OptionsDropdown from '../OptionsDropdown';
import { hasSupportSetSinkId } from '../utils';

const AudioOutputSelect = () => {
  const { t } = useTranslation();
  const { audioOutputOptions } = useMediaDevicesSettingsContext();

  const hasOutputOptions = hasSupportSetSinkId && !!audioOutputOptions.length;

  return (
    <div
      className={cx('flex flex-col items-start space-y-2', {
        'md:space-y-0 md:flex-row md:space-x-2 md:items-end': hasOutputOptions,
      })}
    >
      {hasOutputOptions ? (
        <OptionsDropdown title={t('speakers')} options={audioOutputOptions} disabledTitle={t('no_speakers_detected')} />
      ) : (
        <p className="text-black font-medium text-size-sm">{t('speakers')}</p>
      )}
      <AudioTestButton />
    </div>
  );
};

export default AudioOutputSelect;
