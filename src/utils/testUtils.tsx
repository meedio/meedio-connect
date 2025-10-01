import { PropsWithChildren } from 'react';
import { BrowserRouter } from 'react-router-dom';

import { ToastProvider } from 'contexts/ToastProvider/ToastProvider';

export const routerWrapper = ({ children }: PropsWithChildren) => <BrowserRouter>{children}</BrowserRouter>;

export const toastWrapper = ({ children }: PropsWithChildren) =>
  routerWrapper({ children: <ToastProvider>{children}</ToastProvider> });
