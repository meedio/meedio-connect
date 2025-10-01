import uuid4 from 'uuid4';

import { GetActionTypes, createAction } from 'utils/reducer/actions';

import { ToastId, ToastItem, ToastOptions } from '../../modules/ToastList/ToastListItem/utils';

const generateId = () => uuid4();

export const toastActions = {
  pushToast: (options: ToastOptions) => createAction('pushToast', options),
  editToast: (id: ToastId, options: ToastOptions) => createAction('editToast', { id, ...options }),
  removeToast: (id: ToastId) => createAction('removeToast', id),
};

export const toastReducer = (
  state: ToastItem[],
  { payload, type }: GetActionTypes<typeof toastActions>
): ToastItem[] => {
  switch (type) {
    case 'pushToast':
      return state.concat([{ id: payload.id || generateId(), ...payload }]);
    case 'editToast':
      return state.map((toast) => {
        if (payload.id === toast.id) return payload;
        return toast;
      });
    case 'removeToast':
      return state.filter(({ id }) => id !== payload);
    default: {
      throw new Error(`Unsupported ToastAction type: ${type}`);
    }
  }
};
