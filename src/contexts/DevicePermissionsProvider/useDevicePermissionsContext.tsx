import { useContext } from 'react';

import { DevicePermissionsContext } from './DevicePermissionsProvider';

export function useDevicePermissionsContext() {
  const context = useContext(DevicePermissionsContext);

  if (!context) throw new Error('useDevicePermissionsContext must be used within a DevicePermissionsProvider');

  return context;
}
