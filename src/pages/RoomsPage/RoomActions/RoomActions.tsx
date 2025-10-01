import cx from 'classnames';

import RoomCreateButton from 'components/RoomCreateButton/RoomCreateButton';
import RoomJoinButton from 'components/RoomJoinButton';

type RoomActionsProps = { className?: string };

const RoomActions = ({ className }: RoomActionsProps) => (
  <div className={cx('flex gap-4 flex-1 flex-col sm:flex-row', className)}>
    <RoomJoinButton size="sm" />
    <RoomCreateButton />
  </div>
);

export default RoomActions;
