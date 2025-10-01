import { LivekitFocus } from 'matrix-js-sdk/src/matrixrtc/LivekitFocus';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import useMatrixContext from 'contexts/MatrixContext/useMatrixContext';
import useRoomStateContext from 'contexts/RoomStateContext/useRoomStateContext';
import { ConnectionStatus } from 'contexts/SfuConnectionStateProvider/SfuConnectionStateProvider';
import useSfuConnectionStateContext from 'contexts/SfuConnectionStateProvider/useSfuConnectionStateContext';
import useActiveLivekitFocus from 'hooks/useActiveLivekitFocus';
import logger from 'utils/logging/faro';
import { SFUConfig, getSFUConfigWithOpenID } from 'utils/openIDSFU';

const useOpenIDSFU = () => {
  const { t } = useTranslation();
  const { matrixClient } = useMatrixContext();
  const { setRtcSession } = useRoomStateContext();
  const [sfuConfig, setSFUConfig] = useState<SFUConfig>();
  const { setConnectionStatus } = useSfuConnectionStateContext();
  const [error, setError] = useState<string>();
  useActiveLivekitFocus();

  useEffect(() => {
    const handleFocusChange = ({ detail }: CustomEvent<LivekitFocus>) =>
      getSFUConfigWithOpenID(matrixClient, detail)
        .then((config) => {
          logger.info('sfu config arrived', config);
          setSFUConfig(config);
          setConnectionStatus(ConnectionStatus.CONNECTED);
        })
        .catch(() => {
          logger.error('unable to get sfu config');
          setError(t('room_join_error'));
          setConnectionStatus(ConnectionStatus.DISCONNECTED);
          setRtcSession(undefined);
        });

    logger.info('Adding focusChanged event listener');
    document.addEventListener('focusChanged', handleFocusChange);
    return () => {
      document.removeEventListener('focusChanged', handleFocusChange);
    };
  }, [matrixClient, setError, t, setConnectionStatus, setRtcSession]);

  return { error, setError, sfuConfig };
};

export default useOpenIDSFU;
