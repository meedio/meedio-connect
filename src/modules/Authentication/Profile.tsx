import { useModal } from '@ebay/nice-modal-react';
import { ReactComponent as User } from '@shared/components/assets/icons/User.svg';
import Avatar from '@shared/components/Avatar/Avatar';
import DropdownButton from '@shared/components/DropdownButton/DropdownButton';
import { DropdownSelectionProps } from '@shared/components/DropdownButton/DropdownSelection';
import { meetingTestingConstants } from '@shared/constants';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { ReactComponent as Logout } from 'assets/icons/Logout.svg';
import { ReactComponent as Settings } from 'assets/icons/Settings.svg';
import useMatrixContext from 'contexts/MatrixContext/useMatrixContext';
import useToast from 'contexts/ToastProvider/useToast';

import useLogout from './hooks/useLogout';
import useMxCookies from './hooks/useMxCookies';
import AccountSettingsModal from './Settings/AccountSettings';
import { extractUserId } from './utils';

/**
 * User dropdown component for header
 * Displays the user's avatar, display name, and a dropdown menu with options to copy the user ID, open the account settings, and logout
 */
const UserDropdown = () => {
  const { t } = useTranslation();
  const { matrixClient, mxAvatarUrl } = useMatrixContext();
  const logout = useLogout();
  const navigate = useNavigate();
  const { mxDisplayName, mxUserId, mxLoggedIn } = useMxCookies();
  const { pushToast } = useToast();
  const { show } = useModal(AccountSettingsModal);

  const copyUserId = () => {
    navigator.clipboard.writeText(mxUserId as string);
    pushToast({ title: t('user_id_copied'), variant: 'info' });
  };

  /**
   * Avatar icon with initials for example Alex Brown - AB, for the user dropdown
   * Displays the user's avatar if it exists, otherwise displays the default avatar
   */
  const avatarIcon = mxAvatarUrl ? (
    <img
      src={mxAvatarUrl}
      alt="avatar"
      className="shadow-sm object-cover shadow-gray-40 w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl"
    />
  ) : (
    <Avatar size="header" name={mxDisplayName} className="cursor-pointer" />
  );

  const options: DropdownSelectionProps[] = [
    {
      title: mxDisplayName || `${t('user')}#${extractUserId(mxUserId)}`,
      icon: avatarIcon,
      className: 'ml-2',
      isSelected: false,
      containerClassName: 'bg-gray-10 rounded-2xl hover:bg-gray-20 hover:rounded-2xl w-[240px]',
      selectionClassName: 'hover:!bg-gray-20 !rounded-2xl',
      onClick: copyUserId,
    },
    {
      title: t('settings'),
      icon: <Settings className="stroke-grayscale-black stroke-2 mr-2" />,
      className: 'text-grayscale-black',
      onClick: show,
    },
    ...(mxLoggedIn
      ? [
          {
            title: t('logout'),
            icon: <Logout className="stroke-2 stroke-alert-50 mr-3" data-testid={meetingTestingConstants.logoutBtn} />,
            className: 'text-alert-50',
            onClick: () => logout(matrixClient),
          },
        ]
      : [
          {
            title: t('sign_in_register'),
            icon: <User className="stroke-2 stroke-primary-50 mr-2" />,
            className: 'text-primary-50',
            onClick: () => navigate('/auth'),
          },
        ]),
  ];

  return (
    <DropdownButton options={options} optionClassName="text-alert-50" dataTestId={meetingTestingConstants.profileBtn}>
      {avatarIcon}
    </DropdownButton>
  );
};

export default UserDropdown;
