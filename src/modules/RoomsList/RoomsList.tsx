import cx from 'classnames';
import { KnownMembership } from 'matrix-js-sdk/src';
import type { Room } from 'matrix-js-sdk/src/matrix';
import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import RoomsPagination from 'components/RoomsPagination';
import useRoomsListContext from 'contexts/RoomsListContext/useRoomsListContext';
import { RoomFilter } from 'contexts/RoomsListContext/utils';
import RoomsListItem from 'modules/RoomsListItem/RoomsListItem';

type RoomsListProps = {
  roomsList: Room[];
  label?: string;
  filter?: RoomFilter;
  isPaginated?: boolean;
  itemsPerPage?: number;
};

const ROOMS_COUNT_PER_PAGE = 20;

const RoomsList = ({
  roomsList,
  label,
  filter,
  isPaginated = false,
  itemsPerPage = ROOMS_COUNT_PER_PAGE,
}: RoomsListProps) => {
  const { t } = useTranslation();
  const { setRoomFilter } = useRoomsListContext();
  const [page, setPage] = useState(1);
  const listStartRef = useRef<HTMLDivElement | null>(null);

  const hasMoreRoomsNotice =
    filter && itemsPerPage && roomsList.length - itemsPerPage > 0;
  const roomsNoticeText = t('view_all_active_rooms');

  const handlePageChange = (page: number) => {
    // Note: a timeout improves the scroll behavior when going from a non-scrollable view
    // (e.g. last page, less results) to a scrollable view (e.g. first page, 20 results)
    // it runs scrollIntoView when the page becomes scrollable
    if (listStartRef.current)
      setTimeout(
        () => listStartRef.current?.scrollIntoView({ behavior: 'smooth' })
      );
    setPage(page);
  };

  const startIndex = (page - 1) * itemsPerPage;
  const roomsToRender = roomsList.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className='w-full flex flex-col gap-4'>
      <div ref={listStartRef} />
      <div
        className={cx('bg-gray-10 w-full rounded-2xl p-2 relative', {
          'pt-4': label,
        })}
      >
        {label && (
          <div className='absolute -top-2 left-4 bg-gray-50 text-white rounded-lg text-size-xs px-2'>
            {label}
          </div>
        )}
        {roomsToRender.map((room) => {
          if (room.getMyMembership() === KnownMembership.Leave) return null;

          return <RoomsListItem room={room} key={room.roomId} />;
        })}
        {hasMoreRoomsNotice && (
          <div className='p-2 text-size-sm flex flex-col items-center'>
            <span className='text-gray-80'>
              {t('and_more_rooms', { count: roomsList.length - itemsPerPage })}
            </span>
            <span
              className='text-primary-50 hover:text-primary-60 cursor-pointer'
              onClick={() => setRoomFilter(filter)}
            >
              {roomsNoticeText}
            </span>
          </div>
        )}
      </div>
      {isPaginated && (
        <RoomsPagination
          totalItemsCount={roomsList.length}
          itemsPerPage={itemsPerPage}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
};

export default RoomsList;
