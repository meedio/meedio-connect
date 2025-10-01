import { useRef, useEffect, useCallback } from 'react';

import { ToastItem } from 'modules/ToastList/ToastListItem/utils';

const useToastPresence = (toastState: ToastItem[]) => {
  const toastStateRef = useRef<ToastItem[]>(toastState);

  useEffect(() => {
    toastStateRef.current = toastState;
  }, [toastState]);

  const isToastPresent = useCallback(
    (toastId: string) => toastStateRef.current.some((toast) => toast.id === toastId),
    []
  );

  return isToastPresent;
};

export default useToastPresence;
