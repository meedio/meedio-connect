import { useTranslation } from 'react-i18next';

import HeaderLogo from 'components/HeaderLogo/HeaderLogo';
import MeetingDiagnosticsButton from 'components/MeetingDiagnosticsButton/MeetingDiagnosticsButton';
import useMatrixContext from 'contexts/MatrixContext/useMatrixContext';
import useRoomStateContext from 'contexts/RoomStateContext/useRoomStateContext';
import useRoomUIContext from 'contexts/RoomUIContext/useRoomUIContext';
import useTheme from 'hooks/useTheme';
import HelpDropdown from 'modules/HelpDropdown/HelpDropdown';
import RoomHeader from 'modules/RoomHeader/RoomHeader';

import ActiveRoomHeaderHangUpButton from './ActiveRoomHeaderHangUpButton';
import ActiveRoomHeaderOptionsButton from './ActiveRoomHeaderOptionsButton/ActiveRoomHeaderOptionsButton';

const ActiveRoomHeader = () => {
  const { t } = useTranslation();
  const { activeRoomId: roomId } = useRoomStateContext();
  const { matrixClient } = useMatrixContext();
  const { isLightTheme, headerLogoVariant } = useTheme();
  const {
    state: { isHeaderVisible: isHeaderVisibleState, isHeaderAndFooterShown },
  } = useRoomUIContext();

  const matrixRoom = matrixClient.getRoom(roomId);
  const roomName = matrixRoom?.name || t('room');

  return (
    <div className="bottom-area-margin relative">
      <RoomHeader isFloating={!isHeaderAndFooterShown} isVisible={isHeaderVisibleState}>
        <HeaderLogo variant={headerLogoVariant} className="hidden lg:block" />
        <RoomHeader.RoomInfo>
          <div className="flex items-center lg:justify-center space-x-1">
            <RoomHeader.RoomInfo.Title>{roomName}</RoomHeader.RoomInfo.Title>
          </div>
        </RoomHeader.RoomInfo>
        <RoomHeader.RightSide>
          <MeetingDiagnosticsButton />
          <HelpDropdown isContrastVariant={!isLightTheme} />
          <RoomHeader.RightSide.CurrentTime />
          <ActiveRoomHeaderOptionsButton />
          <ActiveRoomHeaderHangUpButton />
        </RoomHeader.RightSide>
      </RoomHeader>
    </div>
  );
};

export default ActiveRoomHeader;
