import { useModal } from '@ebay/nice-modal-react';
import { DropdownSelectionProps } from '@shared/components/DropdownButton/DropdownSelection';
import cx from 'classnames';
import { Room } from 'matrix-js-sdk/src/matrix';
import { useTranslation } from 'react-i18next';

import { ReactComponent as ArrowBack } from 'assets/icons/ArrowBack.svg';
import { ReactComponent as Pencil } from 'assets/icons/Pencil.svg';
import OptionsDropdown from 'components/OptionsDropdown/OptionsDropdown';
import useFeatureFlagContext from 'contexts/FeatureFlagProvider/useFeatureFlagContext';
import useMatrixContext from 'contexts/MatrixContext/useMatrixContext';
import CreateNewRoomModal from 'modules/CreateNewRoomModal/CreateNewRoomModal';
import CreateRoomModal from 'modules/CreateRoomModal/CreateRoomModal';
import LeaveRoomModal from 'modules/LeaveRoomModal';
import { FeatureFlag } from 'utils/Constants';
import { RoomMetadataContent } from 'utils/types';

type RoomOptionsDropdownProps = { room: Room; roomMetadata: RoomMetadataContent };

const iconClassNames = 'mr-2 h-6 w-6 shrink-0 stroke-2';

const RoomOptionsDropdown = ({ room, roomMetadata }: RoomOptionsDropdownProps) => {
  const { t } = useTranslation();
  const { show: openLeaveRoomPopup } = useModal(LeaveRoomModal);
  const { matrixClient } = useMatrixContext();
  const { isEnabled } = useFeatureFlagContext();

  const isNewModal = isEnabled(FeatureFlag.NEW_INVITATIONS_MODAL);
  const modalComponent = isEnabled(FeatureFlag.NEW_INVITATIONS_MODAL) ? CreateNewRoomModal : CreateRoomModal;
  const { show } = useModal(modalComponent);

  const mxUserId = matrixClient.getUserId();
  const isOwner = !!mxUserId && room.getMember(mxUserId)?.powerLevel === 100;
  const openCreateOrEditRoomModal = () => show({ room, ...(!isNewModal && { roomMetadata }) });
  const openLeaveRoomModal = () => openLeaveRoomPopup({ roomId: room.roomId });

  const options: DropdownSelectionProps[] = [
    ...((isOwner && [
      {
        title: t('edit_room'),
        onClick: openCreateOrEditRoomModal,
        icon: <Pencil className={cx('stroke-current !stroke-1.5', iconClassNames)} />,
      },
    ]) ||
      []),
    {
      title: t('leave'),
      icon: <ArrowBack className={cx('stroke-alert-50', iconClassNames)} />,
      className: 'text-alert-50',
      onClick: openLeaveRoomModal,
    },
  ];

  return <OptionsDropdown options={options} openInPortal />;
};

export default RoomOptionsDropdown;
