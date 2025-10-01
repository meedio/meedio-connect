import Portal from '@shared/components/Portal/Portal';
import { useEffect, useRef } from 'react';

import ToastListItem from './ToastListItem/ToastListItem';
import { ToastItem } from './ToastListItem/utils';

interface Props {
  toastState: ToastItem[];
}

const ToastList = ({ toastState }: Props) => {
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scrollAdjustment = setTimeout(() => {
      if (listRef.current) listRef.current.scrollTop = -listRef.current.scrollHeight;
    }, 100);

    return () => clearTimeout(scrollAdjustment);
  }, [toastState, listRef]);

  return (
    <Portal wrapperId="toast-root">
      <div className="z-toast absolute bottom-12 left-0 flex h-fit max-h-screen w-fit p-6">
        <div className="flex flex-col-reverse items-start overflow-y-auto" ref={listRef}>
          {toastState.map((toast) => (
            <ToastListItem key={toast.id} {...toast} />
          ))}
        </div>
      </div>
    </Portal>
  );
};

export default ToastList;
