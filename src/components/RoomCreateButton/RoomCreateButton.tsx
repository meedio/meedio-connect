import { useModal } from '@ebay/nice-modal-react';
import Button from '@shared/components/Button/Button';
import { meetingTestingConstants } from '@shared/constants';
import { useTranslation } from 'react-i18next';

import { ReactComponent as Plus } from 'assets/icons/Plus.svg';
import useFeatureFlagContext from 'contexts/FeatureFlagProvider/useFeatureFlagContext';
import CreateNewRoomModal from 'modules/CreateNewRoomModal/CreateNewRoomModal';
import CreateRoomModal from 'modules/CreateRoomModal/CreateRoomModal';
import { FeatureFlag } from 'utils/Constants';

const RoomCreateButton = () => {
  const { t } = useTranslation();
  const { isEnabled } = useFeatureFlagContext();

  const modalComponent = isEnabled(FeatureFlag.NEW_INVITATIONS_MODAL) ? CreateNewRoomModal : CreateRoomModal;
  const { show } = useModal(modalComponent);

  return (
    <Button
      variant="primary"
      size="sm"
      iconLeft={{ icon: Plus, className: 'color-white stroke-current stroke-1.5' }}
      className="w-full md:self-center"
      onClick={() => show()}
      data-testid={meetingTestingConstants.createRoomButton}
    >
      {t('create_room')}
    </Button>
  );
};

export default RoomCreateButton;
