import Divider from '@shared/components/Divider/Divider';
import { useTranslation } from 'react-i18next';

import { ReactComponent as Pencil } from 'assets/icons/Pencil.svg';
import useCookies from 'hooks/useCookies';
import SettingsCard from 'modules/SettingsModal/SettingsCard/SettingsCard';
import { matrixConstants } from 'utils/Constants';

import ChangeDisplayName from './TabContents/ChangeDisplayName';
import ManageAccount from './TabContents/ManageAccount';
import UpdateAvatar from './TabContents/UpdateAvatar';

/**
 * Profile tab component
 * Displays the user's profile settings
 */
const ProfileTab = () => {
  const { t } = useTranslation();
  const [mxLoggedIn] = useCookies<boolean>(matrixConstants.MX_LOGGED_IN, false);

  return (
    <div className="flex flex-col space-y-4">
      <span className="text-xl font-semibold">{t('profile')}</span>
      <SettingsCard>
        <div className="w-full h-full p-2">
          <SettingsCard.Header title={t('profile_settings')} icon={Pencil} />
          {mxLoggedIn && (
            <>
              <UpdateAvatar />
              <Divider />
            </>
          )}
          <ChangeDisplayName />
          {mxLoggedIn && <ManageAccount />}
        </div>
      </SettingsCard>
    </div>
  );
};

export default ProfileTab;
