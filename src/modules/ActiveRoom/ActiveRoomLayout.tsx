import { memo, useMemo } from 'react';

import { LivekitChildrenProperties } from 'components/PreRoomCameraPreview/PreRoomCameraPreview';
import SidebarControlButton from 'components/SidebarControlButton';
import VideoTile from 'components/VideoTile/VideoTile';
import { getGridItems } from 'contexts/VideoGridContext/layoutUtils';
import useEffectChanges from 'hooks/useEffectChanges';
import useEntrySound from 'hooks/useEntrySound';
import LivekitVideoGrid from 'modules/LivekitVideoGrid/LivekitVideoGrid';

import { LivekitParticipant } from './utils';

interface ActiveRoomLayoutProps {
  allParticipants: LivekitParticipant[];
}

const ActiveRoomLayout = ({ allParticipants }: ActiveRoomLayoutProps) => {
  const gridItems = useMemo(() => getGridItems(allParticipants), [allParticipants]);
  useEffectChanges();
  useEntrySound();

  return (
    <div className="h-full w-full overflow-hidden px-[18px]">
      <SidebarControlButton />
      <LivekitVideoGrid items={gridItems}>
        {({ style, width, height, item, focused, key, className, publication, ...rest }: LivekitChildrenProperties) => (
          <VideoTile
            id={key}
            key={key}
            item={item}
            style={style}
            width={width}
            height={height}
            publication={publication}
            focused={focused}
            className={className}
            hasParticipantDetails
            {...rest}
          />
        )}
      </LivekitVideoGrid>
    </div>
  );
};

export default memo(ActiveRoomLayout);
