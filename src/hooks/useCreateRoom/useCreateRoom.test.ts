import { renderHook } from '@testing-library/react-hooks';
import { vi, describe, it, expect, beforeEach } from 'vitest';

import useMatrixContext from 'contexts/MatrixContext/useMatrixContext';
import { waitingListState, buildRoomPowerLevelOverrides } from 'utils/matrixUtils';

import useCreateRoom from './useCreateRoom';

vi.mock('contexts/MatrixContext/useMatrixContext');
vi.mock('contexts/ToastProvider/useToast');
vi.mock('utils/matrixUtils');

const mockCreateMeetingProps = {
  title: 'Test Room',
  alias: 'test-room',
  isWaitingListEnabled: true,
  description: 'Test Description',
};

const mockMatrixUserId = '@alice:matrix.org';

describe('useCreateRoom', () => {
  const mockMatrixClient = {
    createRoom: vi.fn(),
    getUserId: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    (useMatrixContext as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      matrixClient: mockMatrixClient,
    });
  });

  it('should call createRoom with default params', async () => {
    mockMatrixClient.getUserId.mockReturnValue(mockMatrixUserId);

    const { result } = renderHook(() => useCreateRoom());
    await result.current.createRoom({ title: mockCreateMeetingProps.title });

    expect(mockMatrixClient.createRoom).toHaveBeenCalledTimes(1);
    expect(mockMatrixClient.createRoom).toHaveBeenCalledWith({
      visibility: 'private',
      preset: 'public_chat',
      room_version: '11',
      creation_content: undefined,
      initial_state: [],
      topic: undefined,
      name: mockCreateMeetingProps.title,
      room_alias_name: undefined,
      power_level_content_override: buildRoomPowerLevelOverrides(mockMatrixUserId),
    });
  });

  it('should add waitingListState if isWaitingListEnabled is true', async () => {
    const { result } = renderHook(() => useCreateRoom());
    await result.current.createRoom({ title: mockCreateMeetingProps.title, isWaitingListEnabled: true });

    const callArg = mockMatrixClient.createRoom.mock.calls[0][0];
    expect(callArg.initial_state).toEqual(expect.arrayContaining([waitingListState]));
  });

  it('should combine customInitialStates with waiting list when its enabled', async () => {
    const customInitialStates = [{ type: 'my.custom.state', content: { testKey: 'testValue' } }];

    const { result } = renderHook(() => useCreateRoom());
    await result.current.createRoom({
      title: mockCreateMeetingProps.title,
      customInitialStates,
      isWaitingListEnabled: true,
    });

    const callArg = mockMatrixClient.createRoom.mock.calls[0][0];
    expect(callArg.initial_state).toEqual([
      waitingListState, // Because isWaitingListEnabled = true
      ...customInitialStates, // Custom initial states
    ]);
  });

  it('should pass the provided room props to matrix createRoom function via correct props', async () => {
    const { result } = renderHook(() => useCreateRoom());
    await result.current.createRoom({
      ...mockCreateMeetingProps,
      customCreationContent: { type: 'm.space' },
    });

    const callArg = mockMatrixClient.createRoom.mock.calls[0][0];
    expect(callArg.name).toBe(mockCreateMeetingProps.title);
    expect(callArg.topic).toBe(mockCreateMeetingProps.description);
    expect(callArg.room_alias_name).toBe(mockCreateMeetingProps.alias);
    expect(callArg.creation_content).toEqual({ type: 'm.space' });
  });
});
