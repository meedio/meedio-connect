import NiceModal from '@ebay/nice-modal-react';
import { PropsWithChildren, useContext, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ModalCleanup = ({ children }: PropsWithChildren) => {
  const location = useLocation();
  const niceModalContext = useContext(NiceModal.NiceModalContext);

  useEffect(() => {
    Object.keys(niceModalContext).forEach((id) => NiceModal.remove(id));
    // NOTE: Remove modals on location changes only
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname, location.search]);

  return children;
};

export default ModalCleanup;
