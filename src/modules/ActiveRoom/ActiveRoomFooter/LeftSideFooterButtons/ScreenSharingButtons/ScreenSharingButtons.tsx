import { useLocalParticipant } from '@livekit/components-react';
import { Track, createLocalScreenTracks } from 'livekit-client';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { ReactComponent as ScreenShareAdd } from 'assets/icons/ScreenShareAdd.svg';
import { ReactComponent as ScreenShareAddLightTheme } from 'assets/icons/ScreenShareAddLightTheme.svg';
import FooterButton from 'components/FooterButton';
import useToast from 'contexts/ToastProvider/useToast';
import useEndedScreenShare from 'hooks/useEndedScreenShare';
import useScreenShareButtonsProps from 'hooks/useScreenShareButtonsProps';
import useScreenSharingToast from 'hooks/useScreenSharingToast';
import useTheme from 'hooks/useTheme';
import logger from 'utils/logging/faro';

const ScreenSharingButtons = () => {
  const { t } = useTranslation();
  const showStopScreenShareModal = useScreenShareButtonsProps();
  const { localParticipant } = useLocalParticipant();
  const pushScreenSharingAlertToast = useScreenSharingToast();
  const { pushToast } = useToast();
  const { isLightTheme } = useTheme();
  const [isStartingScreenShare, setIsStartingScreenShare] = useState(false);

  const screenShare = async () => {
    setIsStartingScreenShare(true);
    const newScreenTracks = await createLocalScreenTracks({ audio: false })
      .catch(({ message }) => {
        const logMessage = 'Could not start screen share';
        if (message !== 'Permission denied') {
          logger.error(logMessage, message);
          return pushScreenSharingAlertToast();
        }
        logger.info(logMessage, message);
      })
      .finally(() => setIsStartingScreenShare(false));

    if (newScreenTracks && newScreenTracks.length > 0) {
      localParticipant.publishTrack(newScreenTracks[0]).catch(() => pushToast({ title: t('something_wrong') }));
    }
  };

  const hasActiveScreenShare = localParticipant
    .getTrackPublications()
    .some((track) => track.source === Track.Source.ScreenShare);

  const ScreenShareAddIcon = isLightTheme ? ScreenShareAddLightTheme : ScreenShareAdd;

  useEndedScreenShare(hasActiveScreenShare);

  return (
    <>
      {hasActiveScreenShare ? (
        <FooterButton
          onClick={showStopScreenShareModal}
          tooltipLabel={t('screenshare.stop_screen_share')}
          iconClassName="!md:stroke-0 !stroke-0"
          variant="destructivePrimary"
          icon={ScreenShareAddIcon}
          isActive
        />
      ) : (
        <FooterButton
          onClick={screenShare}
          tooltipLabel={t('screenshare.share_screen')}
          tooltipPlacement="top-start"
          aria-label={t('screenshare.share_screen')}
          disabled={isStartingScreenShare}
          iconClassName="!md:stroke-0 !stroke-0"
          icon={ScreenShareAddIcon}
        />
      )}
    </>
  );
};

export default ScreenSharingButtons;
