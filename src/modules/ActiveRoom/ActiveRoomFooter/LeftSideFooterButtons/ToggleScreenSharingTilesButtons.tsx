import Switch from '@shared/components/Switch/Switch';
import Tooltip from '@shared/components/Tooltip/Tooltip';
import { useTranslation } from 'react-i18next';

import { ReactComponent as HelpCircleFilled } from 'assets/icons/HelpCircleFilled.svg';
import useRoomUIContext from 'contexts/RoomUIContext/useRoomUIContext';
import useTheme from 'hooks/useTheme';
import withClickLog from 'utils/logging/withClickLog';

const ToggleScreenShareTilesButtons = () => {
  const { t } = useTranslation();
  const { tooltipVariant } = useTheme();
  const {
    dispatch,
    actions,
    state: { isScreenTilesVisible },
  } = useRoomUIContext();

  const toggleScreenTiles = () => dispatch(actions.toggleIsScreenTilesVisible());

  return (
    <Tooltip
      variant={tooltipVariant}
      label={t('hide_tiles_description')}
      placement="top-start"
      inGroup={false}
      hoverDesktopOnly
    >
      <div
        className="group bg-gray-10 dark:bg-white10 rounded-xl p-2 flex space-x-2 cursor-pointer"
        onClick={toggleScreenTiles}
      >
        <div className="flex items-center space-x-1">
          <span className="text-gray-60 dark:text-white text-sm font-light">{t('visible')}</span>
          <HelpCircleFilled className="shrink-0 fill-gray-50 dark:fill-white60 group-hover:fill-gray-70 dark:group-hover:fill-white w-6 h-6" />
        </div>
        <Switch checked={isScreenTilesVisible} />
      </div>
    </Tooltip>
  );
};

export default withClickLog(ToggleScreenShareTilesButtons);
