import Button from '@shared/components/Button/Button';
import Divider from '@shared/components/Divider/Divider';
import { useTranslation } from 'react-i18next';

import useManageAccount from 'modules/Authentication/hooks/useManageAccount';
import SettingsCard from 'modules/SettingsModal/SettingsCard/SettingsCard';

/**
 * Manage account component
 * @returns The component which redirects to the account management page (MAS Interface), if user is logged in
 */
const ManageAccount = () => {
  const { t } = useTranslation();
  const manageAccount = useManageAccount();

  return (
    <>
      <Divider />
      <SettingsCard.Content>
        <div className="flex flex-col space-y-4">
          <div className="flex flex-col space-y-1">
            <SettingsCard.Content.Title>{t('account_management')}</SettingsCard.Content.Title>
            <SettingsCard.Content.Description>{t('account_management_explanation')}</SettingsCard.Content.Description>
          </div>
          <Button variant="primary" size="sm" onClick={manageAccount} className="max-w-[302px] p-2 mt-2">
            {t('manage_account')}
          </Button>
        </div>
      </SettingsCard.Content>
    </>
  );
};

export default ManageAccount;
