import { MouseEvent } from 'react';
import { useThrottle } from 'rooks';

import constants from 'Constants';
import useRoomUIContext from 'contexts/RoomUIContext/useRoomUIContext';
import { getIsMobile } from 'utils/browsers';

const HOVER_THRESHOLD = 40;

const useRevealToolbars = () => {
  const {
    dispatch,
    actions,
    state: { isHeaderVisible, isFooterVisible, isHeaderAndFooterShown, isHeaderRevealDisabled },
  } = useRoomUIContext();
  const [handleMouseMoveThrottled] = useThrottle(onMouseMove, 100);
  const isMobile = getIsMobile();

  const revealHeader = () => dispatch(actions.setValues({ isHeaderVisible: true }));
  const revealFooter = () => dispatch(actions.setValues({ isFooterVisible: true }));
  const hideHeaderAndFooter = () => dispatch(actions.setValues({ isHeaderVisible: false, isFooterVisible: false }));

  function onMouseMove({ clientY, target }: MouseEvent<HTMLDivElement>) {
    const isInHeaderZone = clientY < HOVER_THRESHOLD;
    const isInFooterZone = clientY > window.innerHeight - HOVER_THRESHOLD;
    const isHoveringToolbar = (target as HTMLElement).closest(
      `#${constants.ROOM_HEADER_ID}, #${constants.ROOM_FOOTER_ID}`
    );

    if (!isHeaderVisible && isInHeaderZone && !isHeaderRevealDisabled) return revealHeader();
    if (!isFooterVisible && isInFooterZone && !isHeaderRevealDisabled) return revealFooter();
    if (!isHoveringToolbar && !(isInHeaderZone || isInFooterZone)) hideHeaderAndFooter();
  }

  const handleMouseMove = isHeaderAndFooterShown || isMobile ? undefined : handleMouseMoveThrottled;

  return { handleMouseMove };
};

export default useRevealToolbars;
