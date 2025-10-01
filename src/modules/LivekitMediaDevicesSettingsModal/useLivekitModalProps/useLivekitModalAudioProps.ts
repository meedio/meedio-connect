import { useMediaDeviceSelect } from '@livekit/components-react';
import { Room } from 'livekit-client';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { ReactComponent as Alert } from 'assets/icons/Alert.svg';
import { useDevicePermissionsContext } from 'contexts/DevicePermissionsProvider/useDevicePermissionsContext';
import { useLiveKitDevicesStateContext } from 'contexts/LiveKitDevicesStateContext/LiveKitDevicesStateContext';
import useToast from 'contexts/ToastProvider/useToast';
import useLivekitMediaDeviceToggle from 'hooks/useLivekitMediaDeviceToggle';
import logger from 'utils/logging/faro';

const useLivekitModalAudioProps = (room?: Room) => {
  const { t } = useTranslation();
  const { pushToast } = useToast();
  const { hasMicrophonePermissions } = useDevicePermissionsContext();
  const { audioOutputId, setAudioOutputId } = useLiveKitDevicesStateContext();
  const {
    options: audioOptions,
    isEnabled: isAudioEnabled,
    toggle: toggleMicrophone,
  } = useLivekitMediaDeviceToggle({ kind: 'audioinput', room, hasPermissions: hasMicrophonePermissions });
  const { devices: audioOutputDevices, setActiveMediaDevice: setActiveOutputDevice } = useMediaDeviceSelect({
    kind: 'audiooutput',
    room,
    requestPermissions: false,
  });

  const validAudioOptions = hasMicrophonePermissions ? audioOptions : [];
  const filteredOutputDevices = useMemo(() => audioOutputDevices.filter(({ label }) => !!label), [audioOutputDevices]);
  const hasStoredDevice = filteredOutputDevices.some(({ deviceId }) => deviceId === audioOutputId);

  const audioOutputOptions = filteredOutputDevices.map(({ label: title, deviceId }, index) => {
    const onClick = () =>
      setActiveOutputDevice(deviceId)
        .then(() => setAudioOutputId(deviceId))
        .catch((error) => {
          logger.error('Could not change output device', error);
          return pushToast({ variant: 'error', icon: Alert, title: t('could_not_change_device') });
        });

    const isForceSelected = !hasStoredDevice && index === 0;
    const isSelected =
      deviceId === (audioOutputId || 'default') || filteredOutputDevices.length === 1 || isForceSelected;

    return { onClick, title, isSelected };
  });

  return { audioOptions: validAudioOptions, isAudioEnabled, toggleMicrophone, audioOutputOptions, audioOutputId };
};

export default useLivekitModalAudioProps;
