import { useCallback } from 'react';

import useMatrixContext from 'contexts/MatrixContext/useMatrixContext';
import useMxCookies from 'modules/Authentication/hooks/useMxCookies';
import logger from 'utils/logging/faro';

const useSetMatrixDisplayName = () => {
  const { matrixClient } = useMatrixContext();
  const { setMxDisplayName } = useMxCookies();

  const setDisplayName = useCallback(
    (name: string) =>
      matrixClient
        .setDisplayName(name)
        .then(() => setMxDisplayName(name))
        .catch((error) => logger.error('Error in matrix setDisplayName', error)),
    [matrixClient, setMxDisplayName]
  );

  return setDisplayName;
};

export default useSetMatrixDisplayName;
