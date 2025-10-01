import { useCallback, useEffect, useState } from 'react';

import useIsMounted from 'hooks/useIsMounted';

export interface DevicesInputs {
  audio: MediaDeviceInfo[];
  video: MediaDeviceInfo[];
}

interface Devices {
  inputs: DevicesInputs;
  outputs: { audio: MediaDeviceInfo[] };
}

async function getDeviceInfo() {
  const devices = await navigator.mediaDevices.enumerateDevices();
  const devicesWithLabels = devices.filter(({ label }) => label);

  return {
    inputs: {
      audio: devicesWithLabels.filter(({ kind }) => kind === 'audioinput'),
      video: devicesWithLabels.filter(({ kind }) => kind === 'videoinput'),
    },
    outputs: {
      audio: devicesWithLabels.filter(({ kind }) => kind === 'audiooutput'),
    },
  };
}

const INITIAL_DEVICES = {
  inputs: {
    audio: [],
    video: [],
  },
  outputs: {
    audio: [],
  },
};

function useDevices(hasPromptedPermissions = false, areDevicesSystemBlocked = false) {
  const [devices, setDeviceInfo] = useState<Devices>(INITIAL_DEVICES);
  const isMounted = useIsMounted();

  const getDevices = useCallback(
    () =>
      getDeviceInfo().then((device) => {
        if (!isMounted()) return;
        return setDeviceInfo(device);
      }),
    // NOTE: disable rule because of infinity loop
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const resetDevices = () => setDeviceInfo(INITIAL_DEVICES);

  useEffect(() => {
    if (areDevicesSystemBlocked) resetDevices();
  }, [areDevicesSystemBlocked]);

  useEffect(() => {
    if (hasPromptedPermissions) getDevices();
  }, [getDevices, hasPromptedPermissions]);

  useEffect(() => {
    navigator.mediaDevices.addEventListener('devicechange', getDevices);
    return () => {
      navigator.mediaDevices.removeEventListener('devicechange', getDevices);
    };
  }, [getDevices]);

  return devices;
}

export default useDevices;
