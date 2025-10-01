import Header from '@shared/components/Header/Header';
import { PropsWithChildren } from 'react';

import AnimatedToolbar from 'components/AnimatedToolbar';
import HiddenToolbarIndicator from 'components/HiddenToolbarIndicator';
import constants from 'Constants';
import useTheme from 'hooks/useTheme';

import RightSide from './RightSide/RightSide';
import RoomInfo from './RoomInfo/RoomInfo';

interface RoomHeaderProps {
  isVisible: boolean;
  isFloating: boolean;
}

const RoomHeader = ({ children, isVisible, isFloating }: PropsWithChildren<RoomHeaderProps>) => {
  const { headerVariant } = useTheme();

  return (
    <>
      <HiddenToolbarIndicator isHeader isVisible={isVisible} />
      <AnimatedToolbar
        id={constants.ROOM_HEADER_ID}
        isHeaderAndFooterShown={!isFloating}
        isVisible={isVisible}
        isHeader
      >
        <Header
          variant={isFloating ? headerVariant : 'transparent'}
          className="xs:flex-row flex-col"
          isFloating={isFloating}
        >
          {children}
        </Header>
      </AnimatedToolbar>
    </>
  );
};

RoomHeader.RoomInfo = RoomInfo;
RoomHeader.RightSide = RightSide;

export default RoomHeader;
