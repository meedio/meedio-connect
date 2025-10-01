import { PropsWithChildren } from 'react';

import DevicePermissionsProvider from 'contexts/DevicePermissionsProvider/DevicePermissionsProvider';
import { LiveKitDevicesStateProvider } from 'contexts/LiveKitDevicesStateContext/LiveKitDevicesStateContext';
import { LocalDevicesProvider } from 'contexts/LocalDevicesContext';
import ModalProvider from 'contexts/ModalProvider/ModalProvider';
import RoomUIProvider from 'contexts/RoomUIContext/RoomUIContext';
import { TrackContextProvider } from 'contexts/TrackContext/TrackContext';

const RoomPageWrapper = ({ children }: PropsWithChildren) => (
  <RoomUIProvider>
    <LocalDevicesProvider>
      <LiveKitDevicesStateProvider>
        <DevicePermissionsProvider>
          <TrackContextProvider>
            <ModalProvider>
              <div className="text-white bg-white dark:bg-black w-full h-full">{children}</div>
            </ModalProvider>
          </TrackContextProvider>
        </DevicePermissionsProvider>
      </LiveKitDevicesStateProvider>
    </LocalDevicesProvider>
  </RoomUIProvider>
);

export default RoomPageWrapper;
