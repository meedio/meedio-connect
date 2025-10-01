import Avatar, { AvatarSize } from '@shared/components/Avatar/Avatar';
import { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

import { IconType } from 'utils/types';

import OnlineIndicator from './OnlineIndicator';

interface MemberProps {
  children?: ReactNode;
  name?: string | null;
  isLocalMember?: boolean;
  icon?: IconType;
  avatarSize?: AvatarSize;
  isOnline?: boolean;
}

const Member = ({ name, children, isLocalMember = false, icon: Icon, avatarSize, isOnline }: MemberProps) => {
  const { t } = useTranslation();

  const memberName = name || t('participant');
  const postfix = isLocalMember ? ` (${t('you')})` : '';
  const memberNameWithPostfix = memberName + postfix;

  return (
    <div className="flex items-center space-x-3">
      <OnlineIndicator isOnline={isOnline}>
        <Avatar size={avatarSize || 'sm'} name={memberName} />
      </OnlineIndicator>
      <div className="flex items-center overflow-hidden grow">
        {Icon && <Icon />}
        <span className="truncate font-medium capitalize text-size-sm text-black" translate="no">
          {memberNameWithPostfix}
        </span>
      </div>
      {children}
    </div>
  );
};

export default Member;
