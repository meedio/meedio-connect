import { Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { ReactComponent as Users } from 'assets/icons/Users.svg';

import SwitchWithDisabledFeatureTooltip from './SwitchWithDisabledFeatureTooltip';
import useCreateNewRoomDataContext from '../CreateNewRoomDataProvider/useCreateNewRoomDataContext';

const WaitingListToggleField = () => {
  const { t } = useTranslation();
  const {
    roomForm: { control },
  } = useCreateNewRoomDataContext();

  return (
    <div className='flex gap-5'>
      <Users className='stroke-gray-60 h-6 w-6 shrink-0 stroke-1.5' />
      <div className='w-full flex justify-between items-center'>
        <span className='text-size-sm text-black'>{t('waiting_list')}</span>
        <Controller
          name='isWaitingListEnabled'
          control={control}
          render={({ field: { onChange, value } }) => (
            <SwitchWithDisabledFeatureTooltip
              checked={!!value}
              onChange={onChange}
              disabled={false}
            />
          )}
        />
      </div>
    </div>
  );
};

export default WaitingListToggleField;
