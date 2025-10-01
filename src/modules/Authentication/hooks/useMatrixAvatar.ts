import { MatrixClient } from 'matrix-js-sdk/src';
import { MutableRefObject, useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';

import useToast from 'contexts/ToastProvider/useToast';
import logger from 'utils/logging/faro';
import { SetState } from 'utils/types';

import useMxCookies from './useMxCookies';
import { fetchMediaWithAuth } from '../utils';

/**
 * Use avatar hook
 * @returns fetchAvatar - For fetching the avatar after updated or initializing the app
 * @returns changeAvatar - For changing the avatar
 * @returns clearAvatar - For clearing the avatar
 * @returns loading - The loading state when uploading or clearing the avatar
 */
const useMatrixAvatar = (
  matrixClient: MatrixClient | MutableRefObject<MatrixClient | null>,
  setMxAvatarUrl: SetState<string>
) => {
  const { t } = useTranslation();
  const { mxUserId } = useMxCookies();
  const { pushToast } = useToast();
  const [loading, setLoading] = useState(false);

  const getMatrixClient = useCallback(
    () => (matrixClient && 'current' in matrixClient ? matrixClient.current : matrixClient),
    [matrixClient]
  );

  const fetchAvatar = useCallback(
    async (avatarUrl?: string) => {
      const mxClient = getMatrixClient();

      const accessToken = mxClient?.getAccessToken();
      if (!avatarUrl || !accessToken) return setMxAvatarUrl('');
      const avatarDimensions = 100;
      const downloadUrl = mxClient?.mxcUrlToHttp(
        avatarUrl,
        avatarDimensions,
        avatarDimensions,
        'crop',
        undefined,
        undefined,
        true
      );
      if (!downloadUrl) return;

      const response = await fetchMediaWithAuth(downloadUrl, accessToken);
      const responseData = await response.arrayBuffer();
      const blob = new Blob([responseData], { type: 'image/jpeg' });
      setMxAvatarUrl(URL.createObjectURL(blob));
    },
    [getMatrixClient, setMxAvatarUrl]
  );

  const changeAvatar = async ({ target }: React.ChangeEvent<HTMLInputElement>) => {
    const mxClient = getMatrixClient();

    try {
      setLoading(true);
      const file = target.files?.[0];
      if (!file || !mxClient) return;

      const arrayBuffer = await file.arrayBuffer();
      const blob = new Blob([arrayBuffer], { type: file.type });
      const response = await mxClient.uploadContent(blob);
      if (response?.content_uri) {
        await mxClient.setAvatarUrl(response.content_uri);
        setMxAvatarUrl(URL.createObjectURL(blob));
      }
    } catch (error) {
      logger.error('Error uploading avatar:', { error, mxUserId });
      pushToast({ title: t('error_uploading_avatar'), variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const clearAvatar = async () => {
    const mxClient = getMatrixClient();

    setLoading(true);
    await mxClient?.setAvatarUrl('');
    setMxAvatarUrl('');
    setLoading(false);
  };

  return { fetchAvatar, changeAvatar, clearAvatar, loading };
};

export default useMatrixAvatar;
