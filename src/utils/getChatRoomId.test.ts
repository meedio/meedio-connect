import { Direction, MatrixClient, Room } from 'matrix-js-sdk/src';
import { describe, vi, expect } from 'vitest';

import {
  getChatRoomIdFromSpace,
  getFilter,
  SPACE_CHILD_FILTER,
} from './matrixUtils';

const USER_ID_MOCK = '@user:mock.com';
const SPACE_ROOM_ID_MOCK = 'space_room_id';
const STATE_KEY_MOCK = 'local_room_id';

const mocks = vi.hoisted(() => ({
  infoLogger: vi.fn(),
  createMessagesRequest: vi.fn(),
}));

vi.mock('./logging/faro', () => ({ default: { info: mocks.infoLogger } }));

const createMockClient = (resolvedValue?: unknown) =>
  ({
    getUserId: () => USER_ID_MOCK,
    createMessagesRequest: mocks.createMessagesRequest.mockResolvedValue({
      chunk: [resolvedValue],
    }),
  }) as unknown as MatrixClient;

const createMockSpace = (hasEvent = false) =>
  ({
    roomId: SPACE_ROOM_ID_MOCK,
    currentState: {
      getStateEvents: vi
        .fn()
        .mockImplementation(() =>
          hasEvent ? [{ event: { state_key: STATE_KEY_MOCK } }] : []
        ),
    },
  }) as unknown as Room;

describe('getChatRoomId', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('returns state_key if space have it already and skips fetching the event', async () => {
    const space = createMockSpace(true);
    const client = createMockClient({
      createMessagesRequest: mocks.createMessagesRequest,
    });

    const result = await getChatRoomIdFromSpace(space, client);

    expect(result).toBe(STATE_KEY_MOCK);
    expect(mocks.createMessagesRequest).not.toHaveBeenCalled();
    expect(mocks.infoLogger).not.toHaveBeenCalled();
  });

  it('fetches the event if space does not have it', async () => {
    const stateKey = 'fetched_room_id';
    const space = createMockSpace();
    const client = createMockClient({ state_key: stateKey });

    const result = await getChatRoomIdFromSpace(space, client);

    expect(mocks.infoLogger).toHaveBeenCalled();
    expect(mocks.createMessagesRequest).toHaveBeenCalled();
    expect(result).toBe(stateKey);
  });

  it('throws error when fetched event is undefined', async () => {
    const space = createMockSpace();
    const client = createMockClient();

    await expect(getChatRoomIdFromSpace(space, client)).rejects.toThrow(
      'event is undefined'
    );
  });

  it('throws error when state_key is undefined', async () => {
    const space = createMockSpace();
    const client = createMockClient({});

    await expect(getChatRoomIdFromSpace(space, client)).rejects.toThrow(
      'state_key is undefined'
    );
  });

  it('uses correct request parameters', async () => {
    const space = createMockSpace();
    const client = createMockClient({ state_key: 'mock' });
    const filter = getFilter(SPACE_CHILD_FILTER, USER_ID_MOCK);

    await getChatRoomIdFromSpace(space, client);

    expect(mocks.createMessagesRequest).toHaveBeenCalledWith(
      SPACE_ROOM_ID_MOCK,
      null,
      1,
      Direction.Forward,
      filter
    );
  });
});
