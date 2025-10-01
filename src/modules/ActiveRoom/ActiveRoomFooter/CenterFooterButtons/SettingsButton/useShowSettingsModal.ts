import { useModal } from '@ebay/nice-modal-react';
import { useMaybeRoomContext } from '@livekit/components-react';

import LivekitMediaDevicesSettingsModal from 'modules/LivekitMediaDevicesSettingsModal/LivekitMediaDevicesSettingsModal';

const useShowSettingsModal = () => {
  const room = useMaybeRoomContext();
  const { show } = useModal(LivekitMediaDevicesSettingsModal);

  return () => show({ room });
};

export default useShowSettingsModal;
