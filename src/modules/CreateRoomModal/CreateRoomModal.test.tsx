const mockMatrixClient = {
  createRoom: vi.fn(),
  leave: vi.fn(),
  getUserId: vi.fn(),
  sendStateEvent: vi.fn(),
};

vi.mock('contexts/MatrixContext/useMatrixContext', () => ({
  default: () => ({ matrixClient: mockMatrixClient }),
}));
vi.mock('contexts/ToastProvider/useToast', () => ({
  default: () => ({ pushToast: vi.fn() }),
}));
vi.mock('hooks/useIsRoomAliasAvailable', () => ({
  default: () => ({
    isAliasAvailable: true,
    aliasCheckLoading: false,
    digitsPostfix: 'postfix',
  }),
}));

vi.mock('pages/RoomPage/RoomPage', () => ({
  homeserverName: 'test',
}));

vi.mock('@ebay/nice-modal-react', () => ({
  create: vi.fn((component) => component),
  useModal: vi.fn(() => ({
    remove: vi.fn(),
  })),
}));

vi.mock('react-router-dom', async () => ({
  useNavigate: vi.fn(),
}));

vi.mock('contexts/FeatureFlagProvider/useFeatureFlagContext', () => ({
  default: vi
    .fn()
    .mockReturnValue({ isEnabled: vi.fn().mockReturnValue(true) }),
}));

describe('CreateRoomModal', () => {});
