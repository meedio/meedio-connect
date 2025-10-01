import { useMaybeRoomContext } from '@livekit/components-react';

import useCreateLivekitTracks from 'hooks/useCreateLivekitTracks/useCreateLivekitTracks';
import useLivekitDeviceStatus from 'hooks/useLivekitDeviceStatus';
import useShowPermissionsModal from 'hooks/usePermissionsModal/usePermissionsModal';

const useSfuPermissionsModal = (kind: MediaDeviceKind) => {
  const room = useMaybeRoomContext();
  const { areDevicesBlocked, isCameraInUse, hasNoDevice } = useLivekitDeviceStatus(kind);
  const { createVideoTrack } = useCreateLivekitTracks();

  const handleCreateVideoTrack = () =>
    createVideoTrack().then((videoTrack) => {
      if (room && videoTrack) room.localParticipant.publishTrack(videoTrack);

      return videoTrack;
    });

  const showModal = useShowPermissionsModal({
    areDevicesBlocked,
    isCameraInUse,
    onTryAgain: handleCreateVideoTrack,
    hasNoDevice,
    kind,
  });

  return showModal;
};

export default useSfuPermissionsModal;
