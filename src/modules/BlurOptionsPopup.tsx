import { create, useModal } from '@ebay/nice-modal-react';
import Popup from '@shared/components/Popup/Popup';
import cx from 'classnames';
import { useTranslation } from 'react-i18next';

import { ReactComponent as Tick } from 'assets/icons/Tick.svg';
import { getBlurOptions } from 'components/VideoEffectsButton/utils';
import { VideoEffectOptions } from 'contexts/LiveKitDevicesStateContext/LiveKitDevicesStateContext';
import { SetState } from 'utils/types';

type BlurOptionsPopupProps = {
  setBlurLevel: SetState<VideoEffectOptions> | ((level: VideoEffectOptions) => Promise<void> | undefined);
  blurLevel: VideoEffectOptions;
};

const BlurOptionsPopup = create(({ setBlurLevel, blurLevel }: BlurOptionsPopupProps) => {
  const { t } = useTranslation();
  const { remove } = useModal(BlurOptionsPopup);

  const onOptionSelect = (level: VideoEffectOptions) => {
    setBlurLevel(level);
    remove();
  };

  const blurOptions = getBlurOptions({ blurLevel, setBlurLevel: onOptionSelect, iconClassName: 'mr-2' });

  return (
    <Popup
      className="!m-auto box-content !h-auto !w-full !max-w-[512px] !py-0 px-4"
      isVisible
      closePopup={remove}
      wrapperId="blurOptionsPopup"
    >
      <Popup.FullScreenContainer className="!my-4 !max-w-[400px] rounded-2xl">
        <Popup.Header className="md:justify-between">
          {t('blur.options')}
          <Popup.CloseIcon closePopup={remove} />
        </Popup.Header>
        <div className="m-4 space-y-3">
          {blurOptions.map(({ title, icon, isSelected, onClick }) => (
            <div
              className={cx('flex w-full justify-between p-3 border rounded-2xl', { 'bg-gray-20': isSelected })}
              key={title}
              onClick={onClick}
            >
              <div className="flex space-x-2 items-center">
                {icon}
                {title}
              </div>
              {isSelected && <Tick className="stroke-1.5 stroke-grayscale-black ml-2 h-5 w-5 shrink-0" />}
            </div>
          ))}
        </div>
      </Popup.FullScreenContainer>
    </Popup>
  );
});

export default BlurOptionsPopup;
