import { create, useModal } from '@ebay/nice-modal-react';
import Button from '@shared/components/Button/Button';
import Popup from '@shared/components/Popup/Popup';
import { useTranslation } from 'react-i18next';

import { ReactComponent as MicrophoneOff } from 'assets/icons/MicrophoneOff.svg';
import { ReactComponent as VideoOff } from 'assets/icons/VideoOff.svg';
import GradientIconWithShadow from 'components/GradientIconWithShadow/GradientIconWithShadow';

interface NoDeviceModalProps {
  kind: MediaDeviceKind;
}

const NoDeviceModal = create(({ kind }: NoDeviceModalProps) => {
  const { t } = useTranslation();
  const { remove } = useModal(NoDeviceModal);

  const [deviceType, icon, context] =
    kind === 'audioinput'
      ? [t('microphone').toLowerCase(), MicrophoneOff, 'male']
      : [t('camera').toLowerCase(), VideoOff, 'female'];

  const title = t('no_device_title', { deviceType, context });
  const description = t('no_device_description', { deviceType, context });

  return (
    <Popup
      closePopup={remove}
      className="!m-auto box-content !h-auto !w-full !max-w-[512px] !py-0 px-4"
      isViewportScrollable
      isVisible
      wrapperId="noDeviceModal"
    >
      <Popup.Container className="!my-4 !max-w-[400px] p-4 space-y-8">
        <div className="mt-6 flex w-full justify-center space-x-4">
          <GradientIconWithShadow icon={icon} bgVariant="default" iconVariant="default" />
        </div>
        <div className="my-8 text-black">
          <p className="text-size-lg text-center mb-2 font-medium">{title}</p>
          <p className="mx-4 font-light text-size-sm text-grayscale-gray80">{description}</p>
        </div>
        <Button variant="secondaryTertiary" size="sm" className="w-full" onClick={remove}>
          {t('dismiss')}
        </Button>
      </Popup.Container>
    </Popup>
  );
});

export default NoDeviceModal;
