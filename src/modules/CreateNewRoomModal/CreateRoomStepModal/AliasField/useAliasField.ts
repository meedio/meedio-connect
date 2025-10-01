import { ChangeEvent } from 'react';

import { ReactComponent as Loader } from 'assets/icons/Loader.svg';
import { ReactComponent as Refresh } from 'assets/icons/Refresh.svg';
import useCreateNewRoomDataContext from 'modules/CreateNewRoomModal/CreateNewRoomDataProvider/useCreateNewRoomDataContext';
import { AliasStatusEnum } from 'modules/CreateNewRoomModal/CreateNewRoomDataProvider/utils';

import AliasAvailable from './AliasAvailable';
import AliasNotAvailable from './AliasNotAvailable';
import useAliasAvailability from './useAliasAvailability';
import { slugifyExtended } from './utils';

const useAliasField = () => {
  const { roomForm, setHasAliasChanged } = useCreateNewRoomDataContext();
  const { aliasStatus, isAliasCheckLoading } = useAliasAvailability();

  const { getValues, watch, setValue, clearErrors } = roomForm;

  const matchTitleAndAlias = () => {
    setHasAliasChanged(false);
    setValue('roomAlias', slugifyExtended(getValues('roomName')), { shouldDirty: true });
    clearErrors('roomAlias');
  };

  const onAliasChange =
    (onChange: (event: string) => void) =>
    ({ target: { value } }: ChangeEvent<HTMLInputElement>) => {
      setHasAliasChanged(true);
      onChange(value.toLowerCase());
    };

  const [aliasWatch, nameWatch] = watch(['roomAlias', 'roomName']);
  const isMatching = aliasWatch === slugifyExtended(nameWatch);
  const isRefreshAvailable = !isMatching && !isAliasCheckLoading && getValues('roomName');
  const AliasRefreshIcon = isRefreshAvailable ? Refresh : undefined;
  const [AliasIcon, onAliasIconClick] = isAliasCheckLoading ? [Loader] : [AliasRefreshIcon, matchTitleAndAlias];
  const isAliasUnavailable = aliasStatus === AliasStatusEnum.UNAVAILABLE;
  const AliasAvailabilityComponent = !isAliasCheckLoading && isAliasUnavailable ? AliasNotAvailable : AliasAvailable;

  return { onAliasChange, AliasAvailabilityComponent, AliasIcon, onAliasIconClick, aliasStatus, isAliasCheckLoading };
};

export default useAliasField;
