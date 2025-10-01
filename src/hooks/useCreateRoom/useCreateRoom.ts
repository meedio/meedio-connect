import { ICreateRoomStateEvent, Preset, Visibility } from 'matrix-js-sdk/src/matrix';

import useMatrixContext from 'contexts/MatrixContext/useMatrixContext';
import { buildRoomPowerLevelOverrides, waitingListState } from 'utils/matrixUtils';

type CreateRoomProps = {
  title: string;
  isWaitingListEnabled?: boolean;
  alias?: string;
  description?: string;
  customInitialStates?: ICreateRoomStateEvent[];
  customCreationContent?: object;
  preset?: Preset;
};

const useCreateRoom = () => {
  const { matrixClient } = useMatrixContext();

  const createRoom = async ({
    title,
    isWaitingListEnabled = false,
    alias,
    description,
    customInitialStates,
    customCreationContent,
    preset = Preset.PublicChat,
  }: CreateRoomProps) => {
    const userId = matrixClient.getUserId();

    const initialState = [...(isWaitingListEnabled ? [waitingListState] : []), ...(customInitialStates || [])];

    return matrixClient.createRoom({
      visibility: Visibility.Private,
      preset,
      room_version: '11', // latest stable room version. https://spec.matrix.org/v1.12/rooms/
      initial_state: initialState,
      creation_content: customCreationContent,
      topic: description,
      name: title,
      power_level_content_override: buildRoomPowerLevelOverrides(userId),
      ...(alias && { room_alias_name: alias }),
    });
  };

  return { createRoom };
};

export default useCreateRoom;
