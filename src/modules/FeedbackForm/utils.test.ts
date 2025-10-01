import { describe, it, expect, vi } from 'vitest';

import { FeedbackIssue } from 'contexts/FeedbackContext/FeedbackContext';

import { FeedbackIssueName, processFeedbackIssues } from './utils';

const validFeedbackIssues = Object.values(FeedbackIssueName).map((name, index) => ({
  id: index + 1,
  name,
}));

const mocks = vi.hoisted(() => ({ logAndSendToSentry: vi.fn() }));

vi.mock('utils/utils', () => ({ logAndSendToSentry: mocks.logAndSendToSentry }));

describe('processFeedbackIssues', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should return only valid issues and call logAndSendToSentry when unrecognized issues are found', () => {
    const input = [...validFeedbackIssues, { id: 3, name: 'INVALID_ISSUE' } as unknown as FeedbackIssue];
    const result = processFeedbackIssues(input);
    expect(result).toEqual(validFeedbackIssues);
    expect(mocks.logAndSendToSentry).toHaveBeenCalledWith('Unrecognized feedback issues found');
  });

  it('should call logAndSendToSentry when there are missing issues', () => {
    processFeedbackIssues(validFeedbackIssues.slice(1));
    expect(mocks.logAndSendToSentry).toHaveBeenCalledWith('Missing feedback issues');
  });

  it('should not log anything if all expected issues are present', () => {
    processFeedbackIssues(validFeedbackIssues);
    expect(mocks.logAndSendToSentry).not.toHaveBeenCalled();
  });
});
