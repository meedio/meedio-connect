import { RoomAudioRenderer } from '@livekit/components-react';
import cx from 'classnames';
import { FunctionComponent, PropsWithChildren } from 'react';

import { MembershipsProvider } from 'contexts/MembershipsContext/MembershipsContext';
import useRoomUIContext from 'contexts/RoomUIContext/useRoomUIContext';
import useDeviceChangedNotifications from 'hooks/useDeviceChangedNotifications';
import useOutputCorrection from 'hooks/useOutputCorrection';
import useRevealToolbars from 'hooks/useRevealToolbars';
import useToggleMobileToolbars from 'hooks/useToggleMobileToolbars';

import ActiveRoomFooter from './ActiveRoomFooter/ActiveRoomFooter';

interface ActiveRoomWrapperProps {
  headerComponent: FunctionComponent;
}

const ActiveRoomWrapper = ({
  children,
  headerComponent: HeaderComponent,
}: PropsWithChildren<ActiveRoomWrapperProps>) => {
  const {
    state: { isHeaderAndFooterShown, isExternalFullScreen },
  } = useRoomUIContext();
  const { handleMouseMove } = useRevealToolbars();
  const toggleMobileToolbars = useToggleMobileToolbars();

  useDeviceChangedNotifications();
  useOutputCorrection();

  return (
    <div
      onMouseMove={handleMouseMove}
      className={cx('top-area-padding side-area-padding flex h-full flex-col')}
      onClick={toggleMobileToolbars}
    >
      <RoomAudioRenderer />
      <HeaderComponent />
      <MembershipsProvider>
        <div
          className={cx(
            'relative flex h-full w-full overflow-hidden bg-white dark:bg-black',
            isHeaderAndFooterShown ? 'py-1' : 'py-4',
            { 'z-50': isExternalFullScreen },
          )}
        >
          {children}
        </div>
        <ActiveRoomFooter />
      </MembershipsProvider>
    </div>
  );
};

export default ActiveRoomWrapper;
