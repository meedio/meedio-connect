import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import useMatrixContext from 'contexts/MatrixContext/useMatrixContext';
import useToast from 'contexts/ToastProvider/useToast';
import useCreateNewRoomDataContext from 'modules/CreateNewRoomModal/CreateNewRoomDataProvider/useCreateNewRoomDataContext';
import {
  AliasStatusEnum,
  getAndExtractAlias,
  getRandomFourDigitString,
} from 'modules/CreateNewRoomModal/CreateNewRoomDataProvider/utils';
import { formatUrl } from 'modules/Matrix/utils';

import { getIsMatrixError, MatrixErrorEnum, MAX_ALIAS_RETRY_COUNT } from './utils';

const useAliasAvailability = () => {
  const { t } = useTranslation();
  const { pushToast } = useToast();
  const { matrixClient, matrixUrl } = useMatrixContext();
  const { digitsPostfix, setDigitsPostfix, roomForm, roomToEdit, aliasStatus, setAliasStatus } =
    useCreateNewRoomDataContext();
  const [isAliasCheckLoading, setIsAliasCheckLoading] = useState(false);

  const oldAlias = getAndExtractAlias(roomToEdit);
  const hasError = !!roomForm.formState.errors.roomAlias?.message;
  const watchRoomAlias = roomForm.watch('roomAlias');

  const getAliasAvailability = useCallback(
    async (roomAlias: string, digits = '', retry = 0) => {
      if (retry > MAX_ALIAS_RETRY_COUNT) {
        pushToast({ variant: 'info', title: t('aliast_not_available'), description: t('use_another_alias') });
        return AliasStatusEnum.UNAVAILABLE;
      }

      try {
        setIsAliasCheckLoading(true);
        const alias = `${roomAlias}-${digits || digitsPostfix}`;
        const resp = await matrixClient.getRoomIdForAlias(`#${alias}:${formatUrl(matrixUrl, true)}`);

        if (resp?.room_id) {
          const newDigits = getRandomFourDigitString();
          return getAliasAvailability(roomAlias, newDigits, retry + 1);
        }

        setIsAliasCheckLoading(false);

        return AliasStatusEnum.AVAILABLE;
      } catch (error) {
        setIsAliasCheckLoading(false);

        if (getIsMatrixError(error) && error.errcode === MatrixErrorEnum.M_NOT_FOUND) {
          if (digits) setDigitsPostfix(digits);
          return AliasStatusEnum.AVAILABLE;
        }

        return AliasStatusEnum.UNAVAILABLE;
      }
    },

    [digitsPostfix, matrixClient, matrixUrl, pushToast, setDigitsPostfix, t]
  );

  const checkAlias = useCallback(
    (alias: string) => {
      if (oldAlias === alias) return setAliasStatus(AliasStatusEnum.AVAILABLE);

      getAliasAvailability(alias).then((aliasAvailability) => setAliasStatus(aliasAvailability));
    },
    [getAliasAvailability, oldAlias, setAliasStatus]
  );

  useEffect(() => {
    setAliasStatus(AliasStatusEnum.UNKNOWN);
    if (!watchRoomAlias || hasError) return;

    const debounceAliasCheck = setTimeout(() => checkAlias(watchRoomAlias), 500);

    return () => clearTimeout(debounceAliasCheck);
  }, [checkAlias, hasError, setAliasStatus, watchRoomAlias]);

  return { aliasStatus, isAliasCheckLoading };
};

export default useAliasAvailability;
