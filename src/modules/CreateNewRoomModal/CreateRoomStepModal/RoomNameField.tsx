import InputGroup from '@shared/components/InputGroup/InputGroup';
import { ChangeEvent } from 'react';
import { Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { ReactComponent as Layout } from 'assets/icons/Layout.svg';
import testingConstants from 'utils/testingConstants';

import { slugifyExtended } from './AliasField/utils';
import useCreateNewRoomDataContext from '../CreateNewRoomDataProvider/useCreateNewRoomDataContext';

interface RoomNameFieldProps {
  shouldSyncAlias?: boolean;
}

const RoomNameField = ({ shouldSyncAlias = false }: RoomNameFieldProps) => {
  const { t } = useTranslation();
  const { roomForm, hasAliasChanged } = useCreateNewRoomDataContext();

  const {
    setValue,
    control,
    formState: { errors },
  } = roomForm;

  const onTitleChange =
    (onChange: (event: string) => void) =>
    ({ target: { value } }: ChangeEvent<HTMLInputElement>) => {
      if (!hasAliasChanged && shouldSyncAlias) {
        const alias = slugifyExtended(value);
        setValue('roomAlias', alias, { shouldDirty: true });
      }

      onChange(value);
    };

  return (
    <div className="flex w-full gap-5 items-center">
      <Layout className="stroke-gray-60 h-6 w-6 shrink-0 stroke-1.5" />
      <InputGroup variant="white-bg" errorMessage={errors.roomName?.message}>
        <Controller
          name="roomName"
          control={control}
          render={({ field: { onChange, value } }) => (
            <InputGroup.Input
              onChange={onTitleChange(onChange)}
              value={value}
              placeholder={t('room_name')}
              data-testid={testingConstants.roomTitle}
              className="!bg-gray-10"
            />
          )}
        />
      </InputGroup>
    </div>
  );
};

export default RoomNameField;
