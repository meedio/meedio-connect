import { create, useModal } from '@ebay/nice-modal-react';
import Button from '@shared/components/Button/Button';
import Popup from '@shared/components/Popup/Popup';
import { Room } from 'matrix-js-sdk/src/matrix';
import { CallMembership } from 'matrix-js-sdk/src/matrixrtc/CallMembership';
import { useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';

import useMatrixContext from 'contexts/MatrixContext/useMatrixContext';
import { MatrixToDeviceEvents } from 'utils/Constants';
import logger from 'utils/logging/faro';

interface RoomDuplicateJoinPopup {
  handleJoinRoom: () => void;
  room: Room;
  session: CallMembership;
}

const RoomDuplicateJoinPopup = create(({ handleJoinRoom, room, session }: RoomDuplicateJoinPopup) => {
  const { t } = useTranslation();
  const { remove } = useModal(RoomDuplicateJoinPopup);
  const { matrixClient } = useMatrixContext();
  const [loading, setLoading] = useState(false);

  const handleContinueHere = async () => {
    try {
      setLoading(true);
      const userId = matrixClient.getUserId();
      if (userId) {
        const deviceMap = new Map().set(session.deviceId, { roomId: room.roomId });
        const contentMap = new Map().set(userId, deviceMap);

        logger.info('Sending duplicate join event to another device in the same room');
        await matrixClient.sendToDevice(MatrixToDeviceEvents.ROOM_DUPLICATE_JOIN, contentMap);
      }

      remove();
      handleJoinRoom();
    } catch (error) {
      logger.error('Failed to send room duplicate join event', { error });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Popup isVisible>
      <Popup.Container>
        <Popup.ScrollContainer>
          <p className="text-center">
            <Trans
              i18nKey="already_connected_to_room"
              components={{ bold: <span className="font-medium" /> }}
              values={{ roomName: room.name }}
            />
          </p>
        </Popup.ScrollContainer>
        <Popup.Footer className="flex !flex-col space-y-4">
          <Button variant="primary" className="w-full" loading={loading} onClick={handleContinueHere}>
            {t('continue_here')}
          </Button>
          <Button variant="tertiary" className="w-full" onClick={remove}>
            {t('back')}
          </Button>
        </Popup.Footer>
      </Popup.Container>
    </Popup>
  );
});

export default RoomDuplicateJoinPopup;
