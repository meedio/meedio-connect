import { Provider } from '@ebay/nice-modal-react';
import { PropsWithChildren } from 'react';
import { useLocation } from 'react-router-dom';

import ModalCleanup from './ModalCleanup';

const ModalProvider = ({ children }: PropsWithChildren) => {
  // NOTE: needed for rerendering ModalProvider in order to use it nested
  useLocation();

  return (
    <Provider>
      <ModalCleanup>{children}</ModalCleanup>
    </Provider>
  );
};

export default ModalProvider;
