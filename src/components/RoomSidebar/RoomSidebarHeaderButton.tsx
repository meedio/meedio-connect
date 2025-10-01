import { defaultHoverTransition } from '@shared/utils';
import cx from 'classnames';

import { IconType } from 'utils/types';

type RoomSidebarHeaderButtonProps = {
  icon: IconType;
  onClick: () => void;
};

const RoomSidebarHeaderButton = ({ icon: Icon, onClick }: RoomSidebarHeaderButtonProps) => (
  <span className={cx('p-1.5 rounded-xl cursor-pointer hover:bg-gray-30', defaultHoverTransition)} onClick={onClick}>
    <Icon className="h-5 w-5 shrink-0 stroke-current stroke-2 text-grayscale-black" />
  </span>
);

export default RoomSidebarHeaderButton;
