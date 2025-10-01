import { create } from '@ebay/nice-modal-react';
import Button from '@shared/components/Button/Button';
import Popup from '@shared/components/Popup/Popup';
import { useTranslation } from 'react-i18next';

import { ReactComponent as Microphone } from 'assets/icons/Microphone.svg';
import { ReactComponent as Video } from 'assets/icons/Video.svg';
import GradientIconWithShadow from 'components/GradientIconWithShadow/GradientIconWithShadow';
import testingConstants from 'utils/testingConstants';

type PermissionsAlertProps = {
  onContinueWithoutDevices: () => void;
};

const PermissionsAlert = create(({ onContinueWithoutDevices }: PermissionsAlertProps) => {
  const { t } = useTranslation();

  return (
    <Popup
      className="!m-auto box-content !h-auto !w-full !max-w-[512px] !py-0 px-4"
      isVisible
      isViewportScrollable
      wrapperId="deniedPermissionsPopup"
    >
      <Popup.Container className="!my-4 !max-w-[400px] p-4">
        <div className="mt-6 flex w-full justify-center space-x-4">
          <GradientIconWithShadow icon={Video} bgVariant="alert" iconVariant="white" />
          <GradientIconWithShadow icon={Microphone} bgVariant="alert" iconVariant="white" />
        </div>
        <div className="my-8 text-center text-black">
          <p className="text-size-md mb-2 font-medium">{t('cannot_access_devices')}</p>
          <p className="text-size-sm text-grayscale-gray80">{t('devices_access_explanation')}</p>
        </div>
        <Button
          className="w-full"
          variant="tertiary"
          onClick={onContinueWithoutDevices}
          data-testid={testingConstants.continueWithoutDevices}
        >
          {t('continue_without_devices')}
        </Button>
      </Popup.Container>
    </Popup>
  );
});

export default PermissionsAlert;
