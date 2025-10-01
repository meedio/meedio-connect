import { DropdownSelectionProps } from '@shared/components/DropdownButton/DropdownSelection';
import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useFullscreen } from 'rooks';

import { ReactComponent as FullscreenMode } from 'assets/icons/FullscreenMode.svg';
import { ReactComponent as FullscreenOff } from 'assets/icons/FullscreenOff.svg';
import { ReactComponent as HideToolbar } from 'assets/icons/HideToolbar.svg';
import { ReactComponent as PipOff } from 'assets/icons/PipOff.svg';
import { ReactComponent as PipOn } from 'assets/icons/PipOn.svg';
import { ReactComponent as ShowToolbar } from 'assets/icons/ShowToolbar.svg';
import useRoomUIContext from 'contexts/RoomUIContext/useRoomUIContext';
import { getIsMobile } from 'utils/browsers';
import logger from 'utils/logging/faro';

const iconStyle = 'stroke-1.5 mr-2 h-5 w-5 stroke-current';

const useActiveRoomHeaderOptions = () => {
  const { t } = useTranslation();
  const {
    dispatch,
    actions,
    state: { isHeaderAndFooterShown, isLocalViewFloating, isLocalViewFloatingEnabled },
  } = useRoomUIContext();
  const isTogglingManuallyRef = useRef(false);
  const [isLayoutFullScreen, setIsLayoutFullScreen] = useState(false);

  const setHeaderAndFooterHideMode = (value: boolean) =>
    dispatch(
      actions.setValues({
        isHeaderVisible: value,
        isFooterVisible: value,
        isHeaderAndFooterShown: value,
      })
    );

  const onFullscreenChange = (isEnablingFullscreen: boolean) => {
    const toggleExternalFullScreenState = () =>
      dispatch(actions.setValues({ isExternalFullScreen: isEnablingFullscreen }));

    if (!isEnablingFullscreen) {
      if (!isHeaderAndFooterShown && isLayoutFullScreen) setHeaderAndFooterHideMode(true);
      setIsLayoutFullScreen(false);

      return toggleExternalFullScreenState();
    }

    if (!isTogglingManuallyRef.current) return toggleExternalFullScreenState();

    isTogglingManuallyRef.current = false;
    setIsLayoutFullScreen(true);
    setHeaderAndFooterHideMode(false);
  };

  const { toggleFullscreen, isFullscreenEnabled, isFullscreenAvailable } = useFullscreen({
    onChange: () => onFullscreenChange(!isFullscreenEnabled),
  });

  const handleFullScreenToggle = () => {
    logger.info('Click toggle full screen button');
    isTogglingManuallyRef.current = true;
    toggleFullscreen();
  };

  const togglePip = () => {
    logger.info('Click toggle pip mode');
    return dispatch(actions.togglePip());
  };

  const toggleToolbars = (value: boolean) => {
    logger.info(`Click show/hide header and footer, with value: ${value}`);
    return setHeaderAndFooterHideMode(value);
  };

  const [fullScreenModeText, FullscreenIcon] = isFullscreenEnabled
    ? [t('toolbar_menu.disable_full_screen'), FullscreenOff]
    : [t('toolbar_menu.full_screen_mode'), FullscreenMode];

  const [headerAndFooterHideText, HeaderAndFooterIcon, handleHeaderAndFooterHide] = isHeaderAndFooterShown
    ? [t('toolbar_menu.hide_toolbars'), HideToolbar, () => toggleToolbars(false)]
    : [t('toolbar_menu.show_toolbars'), ShowToolbar, () => toggleToolbars(true)];

  const [pipText, PipIcon, handlePipToggle] = isLocalViewFloating
    ? [t('disable_pip'), PipOff, togglePip]
    : [t('enable_pip'), PipOn, togglePip];

  const options: DropdownSelectionProps[] = [];

  if (!isFullscreenEnabled) {
    options.push({
      title: headerAndFooterHideText,
      icon: <HeaderAndFooterIcon className={iconStyle} />,
      onClick: handleHeaderAndFooterHide,
    });
  }

  if (isFullscreenAvailable && !getIsMobile()) {
    options.push({
      title: fullScreenModeText,
      icon: <FullscreenIcon className={iconStyle} />,
      onClick: handleFullScreenToggle,
    });
  }

  if (isLocalViewFloatingEnabled) {
    options.push({
      title: pipText,
      icon: <PipIcon className={iconStyle} />,
      onClick: handlePipToggle,
    });
  }

  return options;
};

export default useActiveRoomHeaderOptions;
