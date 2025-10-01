import { faker } from '@faker-js/faker';
import { renderHook } from '@testing-library/react-hooks';
import { vi, describe, it, expect, beforeEach } from 'vitest';

import useMatrixContext from 'contexts/MatrixContext/useMatrixContext';
import useToast from 'contexts/ToastProvider/useToast';

import useCreateMeeting from './useCreateMeeting';

vi.mock('contexts/MatrixContext/useMatrixContext');
vi.mock('contexts/ToastProvider/useToast');
vi.mock('contexts/FeatureFlagProvider/useFeatureFlagContext', () => ({
  default: vi.fn().mockReturnValue({ isEnabled: vi.fn().mockReturnValue(true) }),
}));

const mockMatrixClient = {
  createRoom: vi.fn(),
  leave: vi.fn(),
  getUserId: vi.fn(),
  sendStateEvent: vi.fn(),
};

const mockPushToast = vi.fn();
const mockCreateMeetingProps = {
  title: 'Test Room',
  alias: 'test-room',
  isWaitingListEnabled: true,
  description: 'Test Description',
};

const mockCreateRoom = vi.hoisted(() => vi.fn());
vi.mock('hooks/useCreateRoom/useCreateRoom', () => ({
  __esModule: true,
  default: () => ({
    createRoom: mockCreateRoom,
  }),
}));

describe('useCreateMeeting', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (useMatrixContext as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      matrixClient: mockMatrixClient,
    });
    (useToast as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      pushToast: mockPushToast,
    });
  });

  it('should call leave with space ID if chat room creation rejects', async () => {
    const mockSpace = { room_id: faker.string.uuid() };
    const mockError = new Error('Chat room creation failed');

    mockCreateRoom
      .mockResolvedValueOnce(mockSpace) // First call creates the space
      .mockRejectedValueOnce(mockError); // Second call rejects for chat room

    const { result } = renderHook(() => useCreateMeeting());

    await result.current.createMeeting(mockCreateMeetingProps);

    expect(mockMatrixClient.leave).toHaveBeenCalledWith(mockSpace.room_id);
  });

  it('should call leave with space ID and chat Id if sendStateEvent throws an error', async () => {
    const mockSpace = { room_id: faker.string.uuid() };
    const mockChat = { room_id: faker.string.uuid() };
    const mockError = new Error('Send state event failed failed');

    mockCreateRoom
      .mockResolvedValueOnce(mockSpace) // First call creates the space
      .mockResolvedValueOnce(mockChat); // Second call creates the chat room

    mockMatrixClient.sendStateEvent.mockRejectedValue(mockError);

    const { result } = renderHook(() => useCreateMeeting());

    await result.current.createMeeting(mockCreateMeetingProps);

    expect(mockMatrixClient.leave).toHaveBeenCalledWith(mockSpace.room_id);
    expect(mockMatrixClient.leave).toHaveBeenCalledWith(mockChat.room_id);
  });
});
