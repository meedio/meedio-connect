import { create } from '@ebay/nice-modal-react';
import Popup from '@shared/components/Popup/Popup';
import { useTranslation } from 'react-i18next';

import PermissionsSkeleton from './PermissionsSkeleton';

const WaitingForPermissionsModal = create(() => {
  const { t } = useTranslation();

  return (
    <Popup className="!m-auto box-content !h-auto !w-full !max-w-[512px] !py-0 px-4" isVisible isViewportScrollable>
      <Popup.Container className="!my-4 !max-w-[400px] p-4">
        <PermissionsSkeleton />
        <div className="mt-8 mb-4 text-center">
          <p className="mb-1 font-medium text-black">{t('press_allow_to_turn_on_access')}</p>
          <p className="text-size-sm text-grayscale-gray80">{t('press_allow_to_turn_on_access_desc')}</p>
        </div>
      </Popup.Container>
    </Popup>
  );
});

export default WaitingForPermissionsModal;
