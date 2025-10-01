import { useModal } from '@ebay/nice-modal-react';
import Button from '@shared/components/Button/Button';
import { useTranslation } from 'react-i18next';

import { ReactComponent as Conference } from 'assets/icons/Conference.svg';
import { ReactComponent as VideoPlus } from 'assets/icons/VideoPlus.svg';
import RoomJoinButton from 'components/RoomJoinButton';
import useFeatureFlagContext from 'contexts/FeatureFlagProvider/useFeatureFlagContext';
import CreateNewRoomModal from 'modules/CreateNewRoomModal/CreateNewRoomModal';
import CreateRoomModal from 'modules/CreateRoomModal/CreateRoomModal';
import { FeatureFlag } from 'utils/Constants';
import testingConstants from 'utils/testingConstants';

const RoomsEmpty = () => {
  const { t } = useTranslation();
  const { isEnabled } = useFeatureFlagContext();

  const modalComponent = isEnabled(FeatureFlag.NEW_INVITATIONS_MODAL) ? CreateNewRoomModal : CreateRoomModal;
  const { show } = useModal(modalComponent);

  return (
    <div className="flex h-full w-full flex-col items-center justify-center text-center">
      <Conference className="md:h-30 md:w-30 h-20 w-20" />
      <div className="mx-4 mt-10 flex flex-col text-center md:mt-16">
        <h2 className="text-gray-100">{t('welcome')}</h2>
        <p className="text-gray-80">{t('rooms_subtitle')}</p>
        <div className="mt-4 flex flex-col space-y-4">
          <div
            className="flex flex-col md:flex-row gap-2 justify-center mt-4 items-center md:w-full md:self-center !mb-4"
            data-testid={testingConstants.roomActionsBlock}
          >
            <Button
              variant="primary"
              onClick={() => show()}
              className="flex-1 w-full"
              data-testid={testingConstants.createRoomButton}
            >
              <VideoPlus className="color-white mr-2 h-6 w-6 stroke-current" />
              {t('create_room')}
            </Button>
            <RoomJoinButton />
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomsEmpty;
