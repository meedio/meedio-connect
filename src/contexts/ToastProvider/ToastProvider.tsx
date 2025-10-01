import { createContext, PropsWithChildren, useCallback, useReducer } from 'react';

import useToastPresence from './useToastPresence';
import { toastReducer, toastActions } from './utils';
import ToastList from '../../modules/ToastList/ToastList';
import { ToastItem, ToastId, ToastOptions } from '../../modules/ToastList/ToastListItem/utils';

export type ToastContextType = {
  toastState: ToastItem[];
  pushToast: (options: ToastOptions) => void;
  removeToast: (id: ToastId) => void;
  editToast: (id: ToastId, options: ToastOptions) => void;
  isToastPresent: (toastId: string) => boolean;
};

export const ToastContext = createContext<ToastContextType | null>(null);

export const ToastProvider = ({ children }: PropsWithChildren) => {
  const [toastState, dispatch] = useReducer(toastReducer, []);
  const pushToast = useCallback((options: ToastOptions) => dispatch(toastActions.pushToast(options)), []);
  const removeToast = useCallback((id: ToastId) => dispatch(toastActions.removeToast(id)), []);
  const editToast = useCallback(
    (id: ToastId, options: ToastOptions) => dispatch(toastActions.editToast(id, options)),
    []
  );
  const isToastPresent = useToastPresence(toastState);

  return (
    <ToastContext.Provider value={{ toastState, pushToast, removeToast, editToast, isToastPresent }}>
      {children}
      {!!toastState.length && <ToastList toastState={toastState} />}
    </ToastContext.Provider>
  );
};
