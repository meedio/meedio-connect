import { create, useModal } from '@ebay/nice-modal-react';
import Button from '@shared/components/Button/Button';
import Popup from '@shared/components/Popup/Popup';
import { useTranslation } from 'react-i18next';

import ShareRoomButton from 'components/ShareRoomButton/ShareRoomButton';

import ShareRoomButtonBlock from './ShareRoomButtonBlock';

type ShareRoomPopupProps = {
  matrixRoomId: string;
};

const ShareRoomPopup = create(({ matrixRoomId }: ShareRoomPopupProps) => {
  const { remove } = useModal(ShareRoomPopup);
  const { t } = useTranslation();

  const currentUrl = window.location.href;
  const shareTranslation = t('share_room');

  return (
    <Popup closePopup={remove} className="md:!m-auto md:h-auto" isVisible isDesktopViewportScrollable>
      <Popup.FullScreenContainer className="!max-h-unset space-y-4 md:min-w-[512px]">
        <Popup.Header className="items-center justify-center md:justify-start">
          {shareTranslation}
          <Popup.CloseIcon closePopup={remove} />
        </Popup.Header>
        <div className="h-full w-full space-y-4 overflow-y-auto px-4 pb-4 md:overflow-visible">
          <ShareRoomButtonBlock label={t('direct_link')} link={currentUrl} />
          {matrixRoomId && <ShareRoomButtonBlock label={t('matrix_link')} link={matrixRoomId} />}
          <div className="ml-12">
            <ShareRoomButton>{shareTranslation}</ShareRoomButton>
          </div>
        </div>
        <Popup.Footer className="w-full space-x-4 !justify-end">
          <Button variant="secondaryTertiary" onClick={remove}>
            {t('close')}
          </Button>
        </Popup.Footer>
      </Popup.FullScreenContainer>
    </Popup>
  );
});

export default ShareRoomPopup;
