import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';

import useMatrixContext from 'contexts/MatrixContext/useMatrixContext';
import useToast from 'contexts/ToastProvider/useToast';
import logger from 'utils/logger';

import useMxCookies from './useMxCookies';

type UpdateDisplayNameFormType = {
  displayName: string;
};

/**
 * Hook for updating the Matrix display name
 *
 * Provides functionality to update the Matrix user's display name
 *
 * @returns updateDisplayName - For updating the Matrix display name
 * @returns updateNameLoading - For the loading state of the update display name
 * @returns mxDisplayName - The Matrix display name
 */
const useUpdateDisplayName = () => {
  const { t } = useTranslation();
  const { matrixClient } = useMatrixContext();
  const { pushToast } = useToast();
  const [isNameUpdateLoading, setIsNameUpdateLoading] = useState(false);
  const { mxDisplayName, setMxDisplayName } = useMxCookies();

  const updateDisplayName = useCallback(
    ({ displayName }: UpdateDisplayNameFormType) => {
      if (displayName === mxDisplayName) return;
      setIsNameUpdateLoading(true);

      matrixClient
        .setDisplayName(displayName)
        .then(() => {
          setMxDisplayName(displayName);
          pushToast({
            title: t('display_name_updated'),
            variant: 'success',
          });
        })
        .catch((error) => {
          pushToast({
            title: t('failed_to_update_display_name'),
            variant: 'error',
          });
          logger.error('Error updating display name', { error, newDisplayName: displayName });
        })
        .finally(() => {
          setIsNameUpdateLoading(false);
        });
    },
    [matrixClient, pushToast, setMxDisplayName, t, mxDisplayName]
  );

  return { updateDisplayName, isNameUpdateLoading, mxDisplayName };
};

export default useUpdateDisplayName;
