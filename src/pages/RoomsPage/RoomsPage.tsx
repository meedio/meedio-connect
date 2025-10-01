import Divider from '@shared/components/Divider/Divider';
import SearchInput from '@shared/components/SearchInput/SearchInput';
import cx from 'classnames';
import { useTranslation } from 'react-i18next';

import LoadingScreen from 'components/LoadingScreen/LoadingScreen';
import RoomsEmpty from 'components/RoomsEmpty/RoomsEmpty';
import useMatrixContext from 'contexts/MatrixContext/useMatrixContext';
import useRoomsListContext from 'contexts/RoomsListContext/useRoomsListContext';
import withRoomsListContextProvider from 'contexts/RoomsListContext/withRoomsListContextProvider';
import useUpdateMatrixRooms from 'hooks/useUpdateMatrixRooms/useUpdateMatrixRooms';

import FilterButtons from './FilterButtons';
import RoomActions from './RoomActions/RoomActions';
import Rooms from './Rooms';

const RoomsPage = () => {
  const { t } = useTranslation();
  const { rooms, isRoomsLoading } = useMatrixContext();
  useUpdateMatrixRooms();
  const { resetSearch, setSearchValue } = useRoomsListContext();

  if (isRoomsLoading) return <LoadingScreen />;
  if (!rooms.length) return <RoomsEmpty />;

  return (
    <div className='w-full h-full overflow-hidden lg:relative'>
      <div className='flex h-full flex-col'>
        <div
          className={cx(
            'flex justify-center h-full w-full px-6 py-6 md:py-8 overflow-y-scroll',
            {
              '!h-full': !rooms?.length,
            }
          )}
        >
          <div className='flex w-full max-w-[824px] flex-col space-y-4'>
            <div className='flex w-full md:w-auto justify-between'>
              <h2 className='text-black flex-1 text-xl sm:text-2xl'>
                {t('rooms_header')}
              </h2>
              <RoomActions className='hidden md:flex' />
            </div>
            <div className='w-full h-full flex flex-col gap-4'>
              <div className='w-full flex flex-col gap-4'>
                <div className='flex items-center space-x-4'>
                  <SearchInput
                    reset={resetSearch}
                    onChange={setSearchValue}
                    placeholder={t('search')}
                    size='sm'
                  />
                </div>
                <FilterButtons />
              </div>
              <Rooms />
            </div>
          </div>
        </div>
        <Divider />
        <RoomActions className='flex flex-wrap p-4 xs:flex-nowrap md:hidden' />
      </div>
    </div>
  );
};

export default withRoomsListContextProvider(RoomsPage);
