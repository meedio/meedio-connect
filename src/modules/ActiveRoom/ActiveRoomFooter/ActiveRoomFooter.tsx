import { FloatingDelayGroup } from '@floating-ui/react-dom-interactions';

import AnimatedToolbar from 'components/AnimatedToolbar';
import HiddenToolbarIndicator from 'components/HiddenToolbarIndicator';
import RoomFooter from 'components/RoomFooter';
import constants from 'Constants';
import useRoomUIContext from 'contexts/RoomUIContext/useRoomUIContext';

import CenterFooterButtons from './CenterFooterButtons/CenterFooterButtons';
import LeftSideFooterButtons from './LeftSideFooterButtons/LeftSideFooterButtons';
import RightSideButtons from './RightSideButtons/RightSideButtons';

const { TOOLTIP_GROUP_DELAY } = constants;

const ActiveRoomFooter = () => {
  const {
    state: { isHeaderAndFooterShown, isFooterVisible },
  } = useRoomUIContext();

  return (
    <div className="bottom-area-margin relative">
      <HiddenToolbarIndicator isVisible={isFooterVisible} />
      <AnimatedToolbar
        id={constants.ROOM_FOOTER_ID}
        isVisible={isFooterVisible}
        isHeaderAndFooterShown={isHeaderAndFooterShown}
      >
        <RoomFooter isFloating={!isHeaderAndFooterShown}>
          <FloatingDelayGroup delay={{ open: TOOLTIP_GROUP_DELAY, close: TOOLTIP_GROUP_DELAY }}>
            <LeftSideFooterButtons />
            <CenterFooterButtons />
            <RightSideButtons />
          </FloatingDelayGroup>
        </RoomFooter>
      </AnimatedToolbar>
    </div>
  );
};

export default ActiveRoomFooter;
