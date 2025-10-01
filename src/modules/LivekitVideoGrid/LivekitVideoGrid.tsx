import cx from 'classnames';
import { ComponentType, ReactNode } from 'react';

import { LivekitChildrenProperties } from 'components/PreRoomCameraPreview/PreRoomCameraPreview';
import useRoomUIContext from 'contexts/RoomUIContext/useRoomUIContext';
import { countWithProperty } from 'contexts/VideoGridContext/layoutUtils';
import { LayoutType, TileDescriptor, TileTypeEnum } from 'contexts/VideoGridContext/utils';
import { useVideoGridContext } from 'contexts/VideoGridContext/VideoGridContext';
import useManageLocalViewFloating from 'hooks/useManageLocalViewFloating';

import useGestures from './useGestures';
import useLivekitVideoChanges from './useLivekitVideoChanges';

interface LivekitVideoGridProps {
  items: TileDescriptor[];
  isStatic?: boolean;
  children: (props: LivekitChildrenProperties) => ReactNode;
  extraContent?: ComponentType;
}

const LivekitVideoGrid = ({ items, isStatic = false, children, extraContent: Content }: LivekitVideoGridProps) => {
  const { bindGrid, bindTile, springs } = useGestures();
  const { tiles, tilePositions, gridRef, layout } = useVideoGridContext();
  const {
    state: { isSpotlightSidebarVisible },
  } = useRoomUIContext();
  useLivekitVideoChanges(items);
  useManageLocalViewFloating(items);

  const focusedTilesCount = countWithProperty(tiles, 'focused');
  const gridProps = isStatic ? {} : bindGrid();

  return (
    <div className={cx('relative flex h-full w-full', { 'touch-none': !isStatic })} ref={gridRef} {...gridProps}>
      {Content && <Content />}
      {springs.map(({ shadow, ...springStyle }, i) => {
        const { key, order, item, focused } = tiles[i];
        const { width, height } = tilePositions[order];

        //NOTE: tile is hidden if it's NOT focused and spotlight sidebar is HIDDEN and there are other tiles that are FOCUSED
        if (!focused && !isSpotlightSidebarVisible && focusedTilesCount > 0) return;

        const tileProps = isStatic ? {} : bindTile(key);
        const isTileInSidebar = !focused && layout === LayoutType.SPOTLIGHT;
        const staticProps = !isStatic ? { focused, isTileInSidebar } : undefined;
        const style = {
          boxShadow: shadow.to((s) => `rgba(0, 0, 0, 0.5) 0px ${s}px ${2 * s}px 0px`),
          ...springStyle,
        };
        const publication = item.type === TileTypeEnum.PARTICIPANT ? item.participant.publication : undefined;
        const className = isStatic ? 'cursor-default' : 'cursor-pointer';

        const childProps = {
          ...tileProps,
          ...staticProps,
          key,
          publication,
          style,
          width,
          height,
          item,
          className,
          isStatic,
        };

        return children(childProps);
      })}
    </div>
  );
};

export default LivekitVideoGrid;
