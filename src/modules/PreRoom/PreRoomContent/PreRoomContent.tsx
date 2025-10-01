import UILabel from '@shared/components/UILabel/UILabel';
import { KnownMembership } from 'matrix-js-sdk/src';
import { PropsWithChildren } from 'react';
import { useLocation } from 'react-router-dom';

import { ReactComponent as ShieldLock } from 'assets/icons/ShieldLock.svg';
import Grid from 'components/Grid/Grid';
import GuestPreRoomForm from 'components/GuestPreRoomForm/GuestPreRoomForm';
import useRoomIdentityContext from 'contexts/RoomIdentityContext/useRoomIdentityContext';
import { useRoomMembershipContext } from 'contexts/RoomMembershipContext/useRoomMembershipContext';
import useJoinMeetingOnMembership from 'hooks/useJoinActiveMeeting/useJoinMeetingOnMembership';
import useKnockHandler from 'hooks/useKnockHandler';
import WaitingListPlaceholder from 'modules/WaitingList/WaitingListPlaceholder';
import testingConstants from 'utils/testingConstants';

interface TitleProps {
  children?: string | null;
}

interface InfoFormProps {
  error?: string;
}

const UrlLabel = () => {
  const { pathname } = useLocation();

  const label = window.location.href + pathname;

  return (
    <UILabel className='mb-4 hidden max-w-full md:flex'>
      <div className='bg-primaryComp-50 flex h-5 w-5 items-center justify-center rounded-full'>
        <ShieldLock className='fill-primaryComp-50 shrink-0 w-4 h-4 stroke-2 stroke-white' />
      </div>
      <UILabel.LabelText>{label}</UILabel.LabelText>
    </UILabel>
  );
};

const Title = ({ children }: TitleProps) => (
  <h3
    className='mb-6 hidden truncate text-gray-100 dark:text-white md:block'
    data-testid={testingConstants.roomTitle}
  >
    {children}
  </h3>
);

const PreRoomContent = ({ children }: PropsWithChildren) => (
  <Grid.Column className='col-span-12 xs:h-full h-fit items-start mb-4 md:order-1 md:col-span-6 md:items-center lg:col-span-5'>
    <div className='max-w-104 flex w-full flex-col content-start'>
      {children}
    </div>
  </Grid.Column>
);

const InfoForm = ({ error }: InfoFormProps) => {
  const { currentMembership } = useRoomMembershipContext();
  const {
    state: { hasWaitingList },
  } = useRoomIdentityContext();
  const { isAcceptLoading } = useKnockHandler();
  useJoinMeetingOnMembership();

  const hasKnockedRoom = currentMembership === KnownMembership.Knock;
  const canJoinRoom =
    !!currentMembership &&
    [KnownMembership.Invite, KnownMembership.Join].includes(currentMembership);
  const hasToKnock = hasWaitingList && !canJoinRoom;

  if (hasKnockedRoom || isAcceptLoading)
    return <WaitingListPlaceholder isJoining={isAcceptLoading} />;

  return <GuestPreRoomForm hasToKnock={hasToKnock} error={error} hasTracks />;
};

PreRoomContent.UrlLabel = UrlLabel;
PreRoomContent.Title = Title;
PreRoomContent.InfoForm = InfoForm;

export default PreRoomContent;
