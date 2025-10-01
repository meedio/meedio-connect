import { useRef, useCallback, useEffect } from 'react';

export type DeviceMapType = { [key: string]: MediaDeviceInfo[] };

const useEnumerateDevices = () => {
  const devicesRef = useRef<DeviceMapType>({
    audioinput: [],
    videoinput: [],
    audiooutput: [],
  });

  const updateDevicesRef = useCallback((deviceMap: DeviceMapType) => {
    devicesRef.current.audioinput = deviceMap.audioinput;
    devicesRef.current.videoinput = deviceMap.videoinput;
    devicesRef.current.audiooutput = deviceMap.audiooutput;
  }, []);

  const getHasInputChanged = useCallback(
    (deviceMap: DeviceMapType, kind: MediaDeviceKind) =>
      JSON.stringify(devicesRef.current[kind]) !== JSON.stringify(deviceMap[kind]),
    []
  );

  const enumerateDevices = useCallback(async () => {
    const devices = await navigator.mediaDevices.enumerateDevices();
    const deviceMap: DeviceMapType = {
      audioinput: [],
      videoinput: [],
      audiooutput: [],
    };

    devices.forEach((device) => {
      if (device.kind in deviceMap) deviceMap[device.kind].push(device);
    });

    return deviceMap;
  }, []);

  useEffect(() => {
    enumerateDevices().then((devices) => (devicesRef.current = devices));
  }, [enumerateDevices]);

  return { devicesRef, enumerateDevices, updateDevicesRef, getHasInputChanged };
};

export default useEnumerateDevices;
