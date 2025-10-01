import { useContext } from 'react';

import { ToastContext } from './ToastProvider';

const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToastContext must be used within a ToastProvider');

  return context;
};

export default useToast;
