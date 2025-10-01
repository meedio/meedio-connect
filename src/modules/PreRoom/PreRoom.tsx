import PreRoomCameraPreview from 'components/PreRoomCameraPreview/PreRoomCameraPreview';
import useRoomIdentityContext from 'contexts/RoomIdentityContext/useRoomIdentityContext';
import useLivekitPermissions from 'hooks/useLivekitPermissions/useLivekitPermissions';
import PreRoomContentWrapper from 'modules/PreRoomContentWrapper/PreRoomContentWrapper';
import withMountLog from 'utils/logging/withMountLog';

import PreRoomContent from './PreRoomContent/PreRoomContent';

interface PreRoomProps {
  error?: string;
}

const PreRoom = ({ error }: PreRoomProps) => {
  const { isPermitted } = useLivekitPermissions();
  const {
    state: { roomName },
  } = useRoomIdentityContext();

  if (!isPermitted) return null;

  return (
    <PreRoomContentWrapper>
      <PreRoomCameraPreview />
      <PreRoomContent>
        <PreRoomContent.Title>{roomName}</PreRoomContent.Title>
        <PreRoomContent.InfoForm error={error} />
      </PreRoomContent>
    </PreRoomContentWrapper>
  );
};

export default withMountLog(PreRoom, 'Joined pre-room');
