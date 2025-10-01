import { TestingLibraryMatchers } from '@testing-library/jest-dom/matchers';

declare global {
  namespace Vi {
    interface Assertion<T = unknown> extends jest.Matchers<void, T>, TestingLibraryMatchers<T, void> {}
  }
}
