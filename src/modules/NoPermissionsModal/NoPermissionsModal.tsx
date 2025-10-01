import { create, useModal } from '@ebay/nice-modal-react';
import Button from '@shared/components/Button/Button';
import Popup from '@shared/components/Popup/Popup';
import { useTranslation, Trans } from 'react-i18next';

import { ReactComponent as Lock } from 'assets/icons/Lock.svg';
import { ReactComponent as NotAllowedChromeScreen } from 'assets/images/NotAllowedChromeScreen.svg';
import { ReactComponent as NotAllowedSafariScreen } from 'assets/images/NotAllowedSafariScreen.svg';
import { isSafari } from 'utils/browsers';

const NoPermissionsModal = create(() => {
  const { t } = useTranslation();
  const { remove } = useModal(NoPermissionsModal);

  const safariDescription = (
    <>
      <li>{t('device_permissions_description_items.safari_first')}</li>
      <li>{t('device_permissions_description_items.safari_second')}</li>
    </>
  );

  const chromeDescription = (
    <>
      <li>
        <Trans
          i18nKey="device_permissions_description_items.chrome_first"
          components={{ Icon: <Lock className="w-5 h-5 stroke-1.5 inline stroke-gray-80" /> }}
        />
      </li>
      <li>{t('device_permissions_description_items.chrome_second')}</li>
    </>
  );

  const [PermissionsImage, description] = isSafari
    ? [NotAllowedSafariScreen, safariDescription]
    : [NotAllowedChromeScreen, chromeDescription];

  return (
    <Popup
      closePopup={remove}
      className="!m-auto box-content !h-auto !w-full !max-w-[512px] !py-0 px-4"
      isViewportScrollable
      isVisible
      wrapperId="noPermissionsModal"
    >
      <Popup.Container className="!my-4 !max-w-[400px] p-4 space-y-8">
        <div className="shadow-icon bg-gradient-white w-full rounded-3xl p-2">
          <PermissionsImage className="max-w-full h-auto" />
        </div>
        <div className="space-y-1">
          <p className="font-medium text-black text-center">{t('missing_permissions')}</p>
          <ul className="text-size-sm text-gray-80 list-decimal text-left px-4 font-light space-y-3">{description}</ul>
        </div>
        <Button variant="secondaryTertiary" size="sm" className="w-full" onClick={remove}>
          {t('dismiss')}
        </Button>
      </Popup.Container>
    </Popup>
  );
});

export default NoPermissionsModal;
