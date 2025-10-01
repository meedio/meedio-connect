import { createContext, MutableRefObject, PropsWithChildren, useCallback, useRef, useState } from 'react';

import { DiagnosticIssuesEnum } from 'pages/DiagnosticsPage/DiagnosticsResultsPage/DiagnosticsRecommendations/getDiagnosticRecommendations';
import { SetState } from 'utils/types';
import { getIsLastEnumValue } from 'utils/utils';

export enum Diagnostics {
  Stream,
}

type DiagnosticsStateContextType = {
  audioElementRef: MutableRefObject<HTMLAudioElement | undefined>;
  currentDiagnostic: Diagnostics;
  isDiagnosticsRunning: boolean;
  restartDiagnostics: () => void;
  endCurrentDiagnostic: () => void;
  issueResults: DiagnosticIssuesEnum[];
  setIssueResults: SetState<DiagnosticIssuesEnum[]>;
};

export const DiagnosticsStateContext = createContext<DiagnosticsStateContextType | null>(null);
const initialDiagnostic = Diagnostics.Stream;

const DiagnosticsStateProvider = ({ children }: PropsWithChildren) => {
  const audioElementRef = useRef<HTMLAudioElement | undefined>(undefined);
  const [currentDiagnostic, setCurrentDiagnostic] = useState(initialDiagnostic);
  const [isDiagnosticsRunning, setIsDiagnosticsRunning] = useState(true);
  const [issueResults, setIssueResults] = useState<DiagnosticIssuesEnum[]>([]);

  const restartDiagnostics = () => {
    setCurrentDiagnostic(initialDiagnostic);
    setIsDiagnosticsRunning(true);
  };

  const endCurrentDiagnostic = useCallback(() => {
    if (getIsLastEnumValue(currentDiagnostic, Diagnostics)) return setIsDiagnosticsRunning(false);
    setCurrentDiagnostic((current) => current + 1);
  }, [currentDiagnostic]);

  return (
    <DiagnosticsStateContext.Provider
      value={{
        audioElementRef,
        currentDiagnostic,
        isDiagnosticsRunning,
        restartDiagnostics,
        endCurrentDiagnostic,
        issueResults,
        setIssueResults,
      }}
    >
      {children}
    </DiagnosticsStateContext.Provider>
  );
};

export default DiagnosticsStateProvider;
