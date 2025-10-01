import { PropsWithChildren } from 'react';
import { useTranslation } from 'react-i18next';

import Spinner from 'components/Spinner/Spinner';

import NoResultsView from './NoResultsView';

interface ListSectionProps {
  isRefetching?: boolean;
  isEmpty?: boolean;
}

const ListSection = ({ children, isRefetching = false, isEmpty = false }: PropsWithChildren<ListSectionProps>) => {
  const { t } = useTranslation();

  if (isEmpty) {
    return (
      <NoResultsView className="mt-4" title={t('no_rooms_found')}>
        {t('no_results_text')}
      </NoResultsView>
    );
  }

  return (
    <div className="flex w-full flex-col pb-6">
      {isRefetching ? <Spinner variant="gray" size="md" className="mx-auto" /> : children}
    </div>
  );
};
export default ListSection;
