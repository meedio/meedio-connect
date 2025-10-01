import { useTranslation } from 'react-i18next';

import { ReactComponent as Users } from 'assets/icons/Users.svg';
import EmptyStateView from 'components/EmptyStateView/EmptyStateView';
import { useWaitingListContext } from 'contexts/WaitingListContext/useWaitingListContext';

import WaitingListMember from './WaitingListMember';

const WaitingListMembers = () => {
  const { waitingListMembers } = useWaitingListContext();
  const { t } = useTranslation();

  return (
    <>
      {waitingListMembers.length ? (
        <>
          {waitingListMembers.map(({ name, userId }) => (
            <WaitingListMember name={name} userId={userId} key={userId} />
          ))}
        </>
      ) : (
        <EmptyStateView Icon={Users} title={t('waiting_list_empty_title')} className="mt-4">
          {t('waiting_list_empty')}
        </EmptyStateView>
      )}
    </>
  );
};

export default WaitingListMembers;
