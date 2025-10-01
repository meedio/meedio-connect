import '@testing-library/jest-dom';
import matchers from '@testing-library/jest-dom/matchers';
import { vi } from 'vitest';

expect.extend(matchers);

global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

vi.mock('utils/logging/faro', () => ({
  default: {
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
    debug: vi.fn(),
  },
}));
