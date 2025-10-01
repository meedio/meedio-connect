import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import useMatrixContext from 'contexts/MatrixContext/useMatrixContext';
import useToast from 'contexts/ToastProvider/useToast';
import { formatUrl } from 'modules/Matrix/utils';

enum MatrixErrorEnum {
  M_NOT_FOUND = 'M_NOT_FOUND',
}

type AuthedRequestErrorType = { errcode: MatrixErrorEnum };

const isMatrixError = (error: unknown): error is AuthedRequestErrorType =>
  typeof error === 'object' && error !== null && 'errcode' in error;

function getRandomFourDigitString() {
  return String(Math.floor(Math.random() * 10000)).padStart(4, '0');
}

const MAX_RETRY_COUNT = 10;

type UseIsRoomAliasAvailableProps = {
  hasError: boolean;
  alias: string;
  initialDigitsPostfix?: string;
  originalAlias?: string;
};

const useIsRoomAliasAvailable = ({
  hasError,
  alias,
  initialDigitsPostfix,
  originalAlias,
}: UseIsRoomAliasAvailableProps) => {
  const { t } = useTranslation();
  const [isAliasAvailable, setIsAliasAvailable] = useState<boolean | null>(null);
  const [digitsPostfix, setDigitsPostfix] = useState(
    initialDigitsPostfix ? initialDigitsPostfix : getRandomFourDigitString()
  );
  const { matrixClient, matrixUrl } = useMatrixContext();
  const [isAliasCheckLoading, setIsAliasCheckLoading] = useState(false);
  const { pushToast } = useToast();

  const checkIsRoomAliasAvailable = useCallback(
    async (roomAlias: string, digits = '', retry = 0) => {
      if (retry > MAX_RETRY_COUNT) {
        pushToast({ variant: 'info', title: t('aliast_not_available'), description: t('use_another_alias') });
        return false;
      }

      try {
        setIsAliasCheckLoading(true);
        const alias = `${roomAlias}-${digits || digitsPostfix}`;
        const resp = await matrixClient.getRoomIdForAlias(`#${alias}:${formatUrl(matrixUrl, true)}`);

        if (resp?.room_id) {
          const newDigits = getRandomFourDigitString();
          return checkIsRoomAliasAvailable(roomAlias, newDigits, retry + 1);
        }

        setIsAliasCheckLoading(false);
        return true;
      } catch (error) {
        setIsAliasCheckLoading(false);
        if (isMatrixError(error) && error.errcode === MatrixErrorEnum.M_NOT_FOUND) {
          if (digits) setDigitsPostfix(digits);
          return true;
        }
        return false;
      }
    },
    // NOTE: adding digitsPostfix to deps cause unexpected request to be called
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [matrixClient]
  );

  const isAliasSameAsOriginal = originalAlias === alias && !isAliasCheckLoading;

  const checkAlias = useCallback(
    (alias: string) => {
      if (originalAlias === alias) return;

      checkIsRoomAliasAvailable(alias).then((isAvailable) => setIsAliasAvailable(isAvailable));
    },
    [checkIsRoomAliasAvailable, originalAlias]
  );

  useEffect(() => {
    setIsAliasAvailable(null);
    if (!alias || hasError) return;

    const debounceAliasCheck = setTimeout(() => checkAlias(alias), 500);

    return () => clearTimeout(debounceAliasCheck);
  }, [checkAlias, alias, hasError]);

  return {
    isAliasAvailable: isAliasSameAsOriginal || isAliasAvailable,
    aliasCheckLoading: isAliasCheckLoading,
    digitsPostfix,
  };
};

export default useIsRoomAliasAvailable;
