import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import CloseButton from 'components/CloseButton';
import Video from 'components/Video';

type ScreenShareTileProps = {
  onStopScreenShare: () => void;
  screenMediaStream: MediaStream;
};

const ScreenShareTile = ({ onStopScreenShare, screenMediaStream }: ScreenShareTileProps) => {
  const { t } = useTranslation();
  const [isStopButtonShown, setIsStopButtonShown] = useState(false);

  return (
    <div
      className="border-gray-30 relative flex w-full flex-col justify-between gap-2 rounded-2xl border bg-white p-2"
      onMouseEnter={() => setIsStopButtonShown(true)}
      onMouseLeave={() => setIsStopButtonShown(false)}
    >
      <div className="overflow-hidden h-[168px] w-full">
        <Video
          mediaStream={screenMediaStream}
          className="border-gray-30 rounded-lg border object-cover h-[168px] w-full"
        />
      </div>
      <p>{t('screenshare.screen_share_title_single')}</p>
      {isStopButtonShown && (
        <CloseButton className="shadow-elevation-small absolute right-4 top-4" onClick={onStopScreenShare} />
      )}
    </div>
  );
};

export default ScreenShareTile;
