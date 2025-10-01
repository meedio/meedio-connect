import ButtonGroup from '@shared/components/ButtonGroup/ButtonGroup';

import useIsRoomOwner from 'hooks/useIsRoomOwner';

import PeopleSidebarButton from './PeopleSidebarButton';

const RightSideButtons = () => {
  const isOwner = useIsRoomOwner();

  if (!isOwner) return null;

  return (
    <div className="flex flex-1 justify-end">
      <ButtonGroup supportTheme hasDivider={false}>
        <PeopleSidebarButton />
      </ButtonGroup>
    </div>
  );
};

export default RightSideButtons;
