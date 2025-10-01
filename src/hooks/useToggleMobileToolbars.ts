import { useEffect, MouseEvent, useRef, useCallback } from 'react';

import constants from 'Constants';
import useRoomUIContext from 'contexts/RoomUIContext/useRoomUIContext';
import { getIsMobile } from 'utils/browsers';
import { Timeout } from 'utils/types';

import useDoubleClick from './useDoubleClick';

const useToggleMobileToolbars = () => {
  const {
    dispatch,
    actions,
    state: { isHeaderAndFooterShown, isHeaderVisible },
  } = useRoomUIContext();
  const isMobile = getIsMobile();
  const hideToolbarsTimerRef = useRef<Timeout | null>(null);
  const isHeaderAndFooterShownRef = useRef(isHeaderAndFooterShown);

  const hideToolbars = useCallback(() => {
    dispatch(actions.setValues({ isHeaderVisible: false, isFooterVisible: false }));
  }, [actions, dispatch]);
  const clearTimeoutRef = useCallback(() => {
    if (hideToolbarsTimerRef.current) clearTimeout(hideToolbarsTimerRef.current);
  }, []);

  const handleToggleToolbars = ({ target }: MouseEvent<Element>) => {
    const ignoredTags = ['button'];
    const targetElement = target as Element;
    const toolbarIds = [constants.ROOM_HEADER_ID, constants.ROOM_FOOTER_ID];

    if (toolbarIds.some((id) => targetElement.closest(`#${id}`))) {
      clearTimeoutRef();
      hideToolbarsTimerRef.current = setTimeout(hideToolbars, 5500);

      return;
    }

    if (
      targetElement.closest('button') ||
      ignoredTags.includes(targetElement.tagName.toLowerCase()) ||
      //NOTE: When clicking on dropdown areas that don't have shouldPreventPropogation={true} the hideToolbars triggers with wrong value
      isHeaderAndFooterShownRef.current
    ) {
      return;
    }

    dispatch(actions.setValues({ isHeaderVisible: !isHeaderVisible, isFooterVisible: !isHeaderVisible }));
  };

  useEffect(() => {
    if (!isMobile || !isHeaderVisible || isHeaderAndFooterShown) return;

    hideToolbarsTimerRef.current = setTimeout(hideToolbars, 5500);

    return clearTimeoutRef;
  }, [clearTimeoutRef, hideToolbars, isHeaderAndFooterShown, isHeaderVisible, isMobile]);

  useEffect(() => {
    isHeaderAndFooterShownRef.current = isHeaderAndFooterShown;
  }, [isHeaderAndFooterShown]);

  const toggleMobileToolbars = useDoubleClick({ onSingleClick: handleToggleToolbars, latency: 200 });

  return isMobile && !isHeaderAndFooterShown ? toggleMobileToolbars : undefined;
};

export default useToggleMobileToolbars;
