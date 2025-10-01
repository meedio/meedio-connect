import { useModal } from '@ebay/nice-modal-react';
import Divider from '@shared/components/Divider/Divider';
import Header from '@shared/components/Header/Header';
import { memo } from 'react';
import { useTranslation } from 'react-i18next';

import { ReactComponent as Share } from 'assets/icons/Share.svg';
import HeaderLogo from 'components/HeaderLogo/HeaderLogo';
import LanguageSelect from 'components/LanguageSelect/LanguageSelect';
import MeetingDiagnosticsButton from 'components/MeetingDiagnosticsButton/MeetingDiagnosticsButton';
import Timer from 'components/Timer/Timer';
import useRoomIdentityContext from 'contexts/RoomIdentityContext/useRoomIdentityContext';
import useTheme from 'hooks/useTheme';
import HelpDropdown from 'modules/HelpDropdown/HelpDropdown';
import ShareRoomPopup from 'modules/ShareRoomPopup/ShareRoomPopup';

const PreRoomHeader = () => {
  const { t } = useTranslation();
  const { isLightTheme, headerVariant, headerLogoVariant, timerVariant, controlButtonVariant } = useTheme();
  const shareRoomPopup = useModal(ShareRoomPopup);
  const {
    state: { roomId, startDate },
  } = useRoomIdentityContext();

  const openShareRoomPopup = () => shareRoomPopup.show({ matrixRoomId: roomId });

  return (
    <Header variant={headerVariant}>
      {/* <PreRoomBackButton /> */}
      <HeaderLogo variant={headerLogoVariant} />
      <Header.Right>
        <div className="flex items-center space-x-2 md:space-x-4">
          <LanguageSelect isContrast={!isLightTheme} />
          <Divider className="dark:bg-white20 hidden !h-10 md:block" isVertical />
          <div className="flex space-x-2">
            <MeetingDiagnosticsButton />
            <HelpDropdown isContrastVariant={!isLightTheme} />
            {!startDate && (
              <Header.Control
                variant={controlButtonVariant}
                onClick={openShareRoomPopup}
                icon={Share}
                className="block md:hidden"
                aria-label={t('share_room')}
              />
            )}
            <Timer variant={timerVariant} className="hidden md:inline-flex" />
          </div>
        </div>
      </Header.Right>
    </Header>
  );
};

export default memo(PreRoomHeader);
