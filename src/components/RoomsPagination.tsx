import Button from '@shared/components/Button/Button';
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

interface RoomsPaginationnProps {
  totalItemsCount: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
}

const RoomsPagination = ({ totalItemsCount, itemsPerPage, onPageChange }: RoomsPaginationnProps) => {
  const { t } = useTranslation();
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(totalItemsCount / itemsPerPage);

  const hasPreviousPage = currentPage > 1;
  const hasNextPage = currentPage < totalPages;

  const handlePageChange = useCallback(
    (delta: number) =>
      setCurrentPage((prev) => {
        const newPage = Math.max(1, Math.min(prev + delta, totalPages));
        onPageChange(newPage);
        return newPage;
      }),
    [onPageChange, totalPages]
  );

  useEffect(() => {
    if (totalPages < currentPage) handlePageChange(-1);
  }, [currentPage, handlePageChange, totalPages]);

  if (totalPages < 2) return null;

  return (
    <div className="flex justify-between">
      <div className="flex-1 flex justify-start">
        {hasPreviousPage && (
          <Button variant="secondaryTertiary" size="sm" onClick={() => handlePageChange(-1)}>
            {t('previous')}
          </Button>
        )}
      </div>
      <div className="flex flex-1 flex-col text-size-xs items-center justify-center text-gray-80">
        <span>{t('page_of', { currentPage, totalPages })}</span>
        <span>{t('total_rooms', { count: totalItemsCount })}</span>
      </div>
      <div className="flex-1 flex justify-end">
        {hasNextPage && (
          <Button variant="secondaryTertiary" size="sm" onClick={() => handlePageChange(1)}>
            {t('next')}
          </Button>
        )}
      </div>
    </div>
  );
};

export default RoomsPagination;
