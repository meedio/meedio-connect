import { useModal } from '@ebay/nice-modal-react';
import { supportsScreenSharing } from '@livekit/components-core';
import { useLocalParticipant } from '@livekit/components-react';
import ButtonGroup from '@shared/components/ButtonGroup/ButtonGroup';
import cx from 'classnames';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import { ReactComponent as Share } from 'assets/icons/Share.svg';
import FooterButton from 'components/FooterButton';
import useRoomIdentityContext from 'contexts/RoomIdentityContext/useRoomIdentityContext';
import ShareRoomPopup from 'modules/ShareRoomPopup/ShareRoomPopup';

import ScreenSharingButtons from './ScreenSharingButtons/ScreenSharingButtons';
import ToggleScreenShareTilesButtons from './ToggleScreenSharingTilesButtons';

const LeftSideFooterButtons = () => {
  const { t } = useTranslation();
  const shareRoomPopup = useModal(ShareRoomPopup);
  const {
    localParticipant: { isScreenShareEnabled },
  } = useLocalParticipant();
  const {
    state: { roomId, startDate },
  } = useRoomIdentityContext();

  const isScreenSharingSupported = supportsScreenSharing();
  const openShareRoomModal = () => shareRoomPopup.show({ matrixRoomId: roomId });

  //NOTE: need only on unmount
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => () => shareRoomPopup.remove(), []);

  if (!isScreenSharingSupported && startDate) return <div className="flex-1" />;

  return (
    <ButtonGroup className="flex items-center" supportTheme>
      {!startDate && (
        <FooterButton
          onClick={openShareRoomModal}
          tooltipLabel={t('share_room')}
          tooltipPlacement="top-start"
          icon={Share}
          aria-label={t('share_room')}
          className={cx({ 'bg-black5 dark:bg-white10': shareRoomPopup.visible })}
        />
      )}
      {isScreenSharingSupported && (
        <>
          <ScreenSharingButtons />
          {isScreenShareEnabled && <ToggleScreenShareTilesButtons />}
        </>
      )}
    </ButtonGroup>
  );
};

export default LeftSideFooterButtons;
