import { useModal } from '@ebay/nice-modal-react';
import { ButtonSize } from '@shared/components/Button/Button';
import { useTranslation } from 'react-i18next';

import { ReactComponent as Video } from 'assets/icons/Video.svg';
import JoinRoomModal from 'modules/JoinRoomModal/JoinRoomModal';
import { ButtonWithLogging } from 'utils/logging/buttonsWithLogging';

type RoomJoinButtonProps = { size?: ButtonSize };

const RoomJoinButton = ({ size }: RoomJoinButtonProps) => {
  const { t } = useTranslation();
  const { show } = useModal(JoinRoomModal);

  return (
    <ButtonWithLogging
      variant="tertiary"
      size={size}
      className="w-full md:self-center"
      onClick={() => show()}
      iconLeft={{ icon: Video, className: 'color-white stroke-current stroke-2.5' }}
      data-component-name="Meeting join button"
    >
      {t('join_room')}
    </ButtonWithLogging>
  );
};

export default RoomJoinButton;
