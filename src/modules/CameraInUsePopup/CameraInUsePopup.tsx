import { create, useModal } from '@ebay/nice-modal-react';
import Button from '@shared/components/Button/Button';
import Popup from '@shared/components/Popup/Popup';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { ReactComponent as VideoOff } from 'assets/icons/VideoOff.svg';
import GradientIconWithShadow from 'components/GradientIconWithShadow/GradientIconWithShadow';
import useToast from 'contexts/ToastProvider/useToast';
import { CreateVideoTrack } from 'hooks/useCreateLivekitTracks/useCreateLivekitTracks';
import logger from 'utils/logging/faro';

interface CameraInUsePopup {
  onTryAgain?: CreateVideoTrack;
}

const CameraInUsePopup = create(({ onTryAgain }: CameraInUsePopup) => {
  const { t } = useTranslation();
  const { remove } = useModal(CameraInUsePopup);
  const [isLoading, setIsLoading] = useState(false);
  const { pushToast } = useToast();

  const handleTryAgain = () => {
    logger.info('Trying to start camera again in CameraInUsePopup');
    if (!onTryAgain) return;

    setIsLoading(true);
    onTryAgain()
      .then((track) => {
        if (track) return remove();

        pushToast({ variant: 'info', title: t('can_not_start_camera') });
      })
      .finally(() => setIsLoading(false));
  };

  return (
    <Popup
      className="!m-auto box-content !h-auto !w-full !max-w-[512px] !py-0 px-4"
      isVisible
      isViewportScrollable
      wrapperId="cameraInUsePopup"
    >
      <Popup.Container className="!my-4 !max-w-[600px] p-4">
        <div className="mt-6 flex w-full justify-center space-x-4">
          <GradientIconWithShadow icon={VideoOff} bgVariant="alert" iconVariant="white" />
        </div>
        <div className="my-8 text-center text-black">
          <p className="text-size-lg mb-2 font-medium">{t('can_not_start_camera')}</p>
          <p className="mx-4 font-light text-size-sm text-grayscale-gray80">{t('camera_in_use_explanation')}</p>
        </div>
        <div className="flex flex-col space-y-4">
          {onTryAgain && (
            <Button className="w-full" variant="primary" onClick={handleTryAgain} loading={isLoading}>
              {t('try_again')}
            </Button>
          )}
          <Button className="w-full" variant="tertiary" onClick={remove}>
            {t('close')}
          </Button>
        </div>
      </Popup.Container>
    </Popup>
  );
});

export default CameraInUsePopup;
