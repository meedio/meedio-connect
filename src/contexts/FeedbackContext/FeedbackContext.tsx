import { ComponentType, createContext, PropsWithChildren, useContext, useMemo, useState } from 'react';
import uuid4 from 'uuid4';

import { FeedbackIssueName } from 'modules/FeedbackForm/utils';
import { SetState } from 'utils/types';

export type FeedbackIssue = { id: number; name: FeedbackIssueName };

export interface FeedbackContextType {
  isLoading: boolean;
  setIsLoading: SetState<boolean>;
  isFeedbackCompleted: boolean;
  setIsFeedbackCompleted: SetState<boolean>;
  setIssueList: SetState<FeedbackIssue[] | undefined>;
  issueList?: FeedbackIssue[];
  participantIdentifier: string;
  isBadFeedbackSent: boolean;
  setIsBadFeedbackSent: SetState<boolean>;
}

const FeedbackContext = createContext<FeedbackContextType | null>(null);

export const FeedbackContextProvider = ({
  children,
  value,
}: PropsWithChildren<{ value?: Partial<FeedbackContextType> }>) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isFeedbackCompleted, setIsFeedbackCompleted] = useState(false);
  const [issueList, setIssueList] = useState<FeedbackIssue[]>();
  const [isBadFeedbackSent, setIsBadFeedbackSent] = useState(false);

  const participantIdentifier = useMemo(() => uuid4(), []);

  return (
    <FeedbackContext.Provider
      value={{
        isLoading,
        setIsLoading,
        isFeedbackCompleted,
        setIsFeedbackCompleted,
        issueList,
        setIssueList,
        participantIdentifier,
        isBadFeedbackSent,
        setIsBadFeedbackSent,
        ...value,
      }}
    >
      {children}
    </FeedbackContext.Provider>
  );
};

export const useFeedbackContext = () => {
  const context = useContext(FeedbackContext);
  if (!context) throw new Error('useFeedbackContext must be used within a FeedbackContextProvider');

  return context;
};

export function withFeedbackContextProvider(Component: ComponentType) {
  const WithFeedbackContextProvider: React.FC = () => (
    <FeedbackContextProvider>
      <Component />
    </FeedbackContextProvider>
  );

  return WithFeedbackContextProvider;
}
