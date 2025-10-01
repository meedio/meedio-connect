import { useRoomContext } from '@livekit/components-react';
import { useCallback, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useDebounce } from 'rooks';

import useToast from 'contexts/ToastProvider/useToast';
import { ToastItem, ToastOptions } from 'modules/ToastList/ToastListItem/utils';
import logger from 'utils/logging/faro';

const DEVICE_TOAST_PREFIX = 'device_toast';

const useDeviceChangedNotifications = () => {
  const { t } = useTranslation();
  const room = useRoomContext();
  const { pushToast, toastState, removeToast } = useToast();
  const devicesMap = useRef(new Map(room.localParticipant.activeDeviceMap));
  const toastStateRef = useRef<ToastItem[]>(toastState);
  const pushToastThrottle = useDebounce(pushToast, 100);

  const removeDeviceToasts = useCallback(
    () =>
      toastStateRef.current.forEach(({ id }) => {
        const isDeviceToast = id.includes(DEVICE_TOAST_PREFIX);
        if (isDeviceToast) removeToast(id);
      }),
    [removeToast]
  );

  useEffect(() => {
    toastStateRef.current = toastState;
  }, [toastState]);

  useEffect(() => removeDeviceToasts, [removeDeviceToasts]);

  useEffect(() => {
    if (!room) return;

    const handleDeviceChange = (kind: MediaDeviceKind, newDeviceId: string) => {
      const deviceIdFromMap = devicesMap.current?.get(kind);
      devicesMap.current = new Map(room.localParticipant.activeDeviceMap);

      const deviceChangeInfo = { kind, newDeviceId, oldDeviceId: deviceIdFromMap };

      if (deviceIdFromMap === newDeviceId) {
        return logger.info('Active device change detected, but it matches the old device', deviceChangeInfo);
      }

      logger.info('Active device change detected', deviceChangeInfo);

      const toastOptions: ToastOptions = {
        variant: 'info',
        title: t('device_changed', { kind }),
        id: `${DEVICE_TOAST_PREFIX}_${kind}`,
        autoDismiss: false,
      };

      const hasExistingToast = toastStateRef.current.find(({ id }) => id === `${DEVICE_TOAST_PREFIX}_${kind}`);

      if (hasExistingToast) {
        removeToast(`${DEVICE_TOAST_PREFIX}_${kind}`);
        return pushToastThrottle(toastOptions);
      }

      return pushToast(toastOptions);
    };

    room.on('activeDeviceChanged', handleDeviceChange);

    return () => {
      room.off('activeDeviceChanged', handleDeviceChange);
    };
  }, [pushToast, pushToastThrottle, removeToast, room, t]);
};

export default useDeviceChangedNotifications;
