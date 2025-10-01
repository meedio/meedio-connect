import cx from 'classnames';

import { ReactComponent as ChevronsRight } from 'assets/icons/ChevronsRight.svg';
import useRoomUIContext from 'contexts/RoomUIContext/useRoomUIContext';
import { LayoutType } from 'contexts/VideoGridContext/utils';
import { useVideoGridContext } from 'contexts/VideoGridContext/VideoGridContext';

const SidebarControlButton = () => {
  const { layout, tiles } = useVideoGridContext();
  const {
    dispatch,
    actions,
    state: { isSpotlightSidebarVisible, isLocalViewFloating },
  } = useRoomUIContext();

  const toggleSpotlightSidebar = () => dispatch(actions.toggleSpotlightSidebar());

  const hasUnfocusedTile = tiles.some((tile) => !tile.focused);

  if (layout === LayoutType.FREEDOM || !hasUnfocusedTile || isLocalViewFloating) return null;

  return (
    <div className="z-modal fixed bottom-0 right-0 top-0 translate-y-1/2">
      <button
        className="hover:bg-black80 dark:stroke-white60 stroke-gray-60 transform cursor-pointer rounded-l-xl py-3 transition-all duration-300 ease-out hover:dark:stroke-white hover:stroke-white hover:px-3"
        onClick={toggleSpotlightSidebar}
      >
        <ChevronsRight className={cx({ 'rotate-180 transform': !isSpotlightSidebarVisible })} />
      </button>
    </div>
  );
};

export default SidebarControlButton;
