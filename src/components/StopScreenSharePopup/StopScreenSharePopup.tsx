import { create, useModal } from '@ebay/nice-modal-react';
import Button from '@shared/components/Button/Button';
import Popup from '@shared/components/Popup/Popup';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import ScreenShareTile from './ScreenShareTile';
import CloseButton from '../CloseButton';

export type StopScreenSharePopupProps = {
  stopTrack: () => void;
  screenMediaStream: MediaStream;
};

const StopScreenSharePopup = create(({ stopTrack, screenMediaStream }: StopScreenSharePopupProps) => {
  const { t } = useTranslation();
  const { remove } = useModal(StopScreenSharePopup);

  const stopScreenShare = () => {
    stopTrack();
    remove();
  };

  useEffect(() => {
    const removeStreamHandler = () => {
      remove();
    };

    const videoTrack = screenMediaStream.getVideoTracks()[0];
    if (videoTrack) {
      videoTrack.addEventListener('ended', removeStreamHandler);
    }

    return () => {
      if (videoTrack) {
        videoTrack.removeEventListener('ended', removeStreamHandler);
      }
    };
  }, [screenMediaStream, remove]);

  return (
    <Popup isVisible closePopup={remove}>
      <Popup.Container className="!min-w-[400px]">
        <Popup.Header className="h-fit justify-between px-4 py-4 md:!mx-0">
          <span className="text-size-md font-medium">{t('screenshare.modal_title')}</span>
          <CloseButton onClick={remove} />
        </Popup.Header>
        <Popup.ScrollContainer className="!px-4 !py-4">
          <div className="bg-gray-10 flex w-full rounded-2xl !p-2">
            <ScreenShareTile onStopScreenShare={stopScreenShare} screenMediaStream={screenMediaStream} />
          </div>
        </Popup.ScrollContainer>
        <Popup.Footer className="flex-col !px-0 !pb-0 !pt-4" wrapperClassName="md:!pb-4 !px-4">
          <Button className="w-full !px-0" variant="secondaryTertiary" onClick={stopScreenShare}>
            {t('screenshare.stop_screen_share')}
          </Button>
        </Popup.Footer>
      </Popup.Container>
    </Popup>
  );
});

export default StopScreenSharePopup;
