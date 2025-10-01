import { create, useModal } from '@ebay/nice-modal-react';
import Button from '@shared/components/Button/Button';
import Popup from '@shared/components/Popup/Popup';
import { useTranslation } from 'react-i18next';

import { ReactComponent as Microphone } from 'assets/icons/Microphone.svg';
import { ReactComponent as Video } from 'assets/icons/Video.svg';
import GradientIconWithShadow from 'components/GradientIconWithShadow/GradientIconWithShadow';

interface RequestPermissionsPopupProps {
  onRequestPermissions: () => void;
}

const RequestPermissionsPopup = create(({ onRequestPermissions }: RequestPermissionsPopupProps) => {
  const { t } = useTranslation();
  const { remove } = useModal(RequestPermissionsPopup);

  const handleRequestPermissions = () => {
    onRequestPermissions();
    remove();
  };

  return (
    <Popup className="!m-auto box-content !h-auto !w-full !max-w-[512px] !py-0 px-4" isVisible isViewportScrollable>
      <Popup.Container className="!my-4 !max-w-[400px] p-4">
        <div className="mt-6 flex w-full justify-center space-x-4">
          <GradientIconWithShadow icon={Video} />
          <GradientIconWithShadow icon={Microphone} />
        </div>
        <div className="my-8 text-center text-black">
          <p className="text-size-md mb-2 font-medium">{t('allow_camera_microphone')}</p>
          <p className="text-size-sm text-grayscale-gray80">{t('permissions_explanation')}</p>
        </div>
        <Button className="w-full" variant="primary" onClick={handleRequestPermissions}>
          <div className="whitespace-normal break-words">{t('request_permissions')}</div>
        </Button>
      </Popup.Container>
    </Popup>
  );
});

export default RequestPermissionsPopup;
