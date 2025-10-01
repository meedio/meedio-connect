import cx from 'classnames';
import { TrackPublication } from 'livekit-client';
import { PropsWithChildren } from 'react';

import Grid from 'components/Grid/Grid';
import { VideoPreviewTile, TileTypeEnum, ChildrenProperties } from 'contexts/VideoGridContext/utils';
import VideoGridProvider from 'contexts/VideoGridContext/VideoGridContext';
import LivekitVideoGrid from 'modules/LivekitVideoGrid/LivekitVideoGrid';
import PreviewTile from 'modules/PreRoomCameraPreview/PreviewTile';

export const LOCAL_USER_ID = 'local';

export type LivekitChildrenProperties = ChildrenProperties & { publication?: TrackPublication };

const PreRoomCameraPreview = ({ children }: PropsWithChildren) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, unused-imports/no-unused-vars
  const gridItems: VideoPreviewTile[] = [
    {
      id: LOCAL_USER_ID,
      type: TileTypeEnum.VIDEO_PREVIEW,
      replace: false,
    },
  ];

  return (
    <Grid.Column
      className={cx(
        'col-span-12 h-full min-h-[200px] xs:min-h-[360px] flex-col items-center md:order-2 md:col-span-6 lg:col-span-7',
        { 'max-h-96': !!children }
      )}
    >
      <div className="relative h-full w-full px-4 max-w-[338px] xs:max-w-full md:py-8">
        {children}
        <VideoGridProvider>
          <LivekitVideoGrid items={gridItems} isStatic>
            {({ style, width, height, key, className, ...rest }: LivekitChildrenProperties) => (
              <PreviewTile key={key} style={style} width={width} height={height} className={className} {...rest} />
            )}
          </LivekitVideoGrid>
        </VideoGridProvider>
        {!!children && <div className="h-4" />}
      </div>
    </Grid.Column>
  );
};

export default PreRoomCameraPreview;
