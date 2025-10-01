import { create, useModal } from '@ebay/nice-modal-react';
import { ReactComponent as User } from '@shared/components/assets/icons/User.svg';
import { useTranslation } from 'react-i18next';

import SettingsModal from 'modules/SettingsModal/SettingsModal';

import ProfileTab from './ProfileTab/ProfileTab';

enum Tabs {
  Profile,
}

/**
 * Account settings modal for the user to manage their account
 * Displays the user's profile information and settings
 */
const AccountSettingsModal = create(() => {
  const { t } = useTranslation();
  const { remove } = useModal(AccountSettingsModal);

  const tabs = [{ id: Tabs.Profile, title: t('profile'), icon: User, contentComponent: ProfileTab }];

  return <SettingsModal tabs={tabs} title={t('settings')} onClose={remove} />;
});

export default AccountSettingsModal;
