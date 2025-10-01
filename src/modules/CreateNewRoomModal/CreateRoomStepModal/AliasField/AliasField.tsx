import ErrorMessage from '@shared/components/ErrorMessage/ErrorMessage';
import Input from '@shared/components/InputGroup/Input';
import cx from 'classnames';
import { Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { ReactComponent as LinkNew } from 'assets/icons/LinkNew.svg';
import { AliasStatusEnum } from 'modules/CreateNewRoomModal/CreateNewRoomDataProvider/utils';

import useAliasField from './useAliasField';
import useCreateNewRoomDataContext from '../../CreateNewRoomDataProvider/useCreateNewRoomDataContext';

const AliasField = () => {
  const { t } = useTranslation();
  const { roomForm, digitsPostfix } = useCreateNewRoomDataContext();
  const { onAliasChange, AliasAvailabilityComponent, AliasIcon, onAliasIconClick, aliasStatus, isAliasCheckLoading } =
    useAliasField();

  const {
    getValues,
    getFieldState,
    control,
    formState: { errors },
  } = roomForm;

  const roomNameDashedTranslation = t('room_name').toLowerCase().split(' ').join('-');
  const roomAliasValue = `${getValues('roomAlias') || roomNameDashedTranslation}-${digitsPostfix}`;
  const isAliasAndTitleValid = !getFieldState('roomAlias').invalid || !getFieldState('roomName').invalid;
  const hasError = aliasStatus === AliasStatusEnum.UNAVAILABLE || !!errors.roomAlias?.message;

  return (
    <div className="flex gap-5">
      <LinkNew className="stroke-gray-60 mt-3 h-6 w-6 shrink-0 stroke-1.5" />
      <div className="flex w-full min-w-0 flex-col gap-2">
        <span className="text-size-sm text-black">{t('room_alias_explanation')}</span>
        <div className="flex gap-2">
          <Controller
            name="roomAlias"
            control={control}
            render={({ field: { onChange, value } }) => (
              <Input
                variant="white-bg"
                onChange={onAliasChange(onChange)}
                containerClassName="!w-3/4"
                hasError={hasError}
                value={value.toLowerCase()}
                placeholder={roomNameDashedTranslation}
                icon={AliasIcon}
                onIconClick={onAliasIconClick}
                iconClassName={cx({ 'animate-spin': isAliasCheckLoading })}
                className="!bg-gray-10"
              />
            )}
          />
          <Input variant="white-bg" containerClassName="!w-36" disabled value={digitsPostfix} />
        </div>
        {isAliasAndTitleValid && <AliasAvailabilityComponent alias={roomAliasValue} />}
        <ErrorMessage message={errors.roomAlias?.message} className="!mt-0" />
      </div>
    </div>
  );
};

export default AliasField;
