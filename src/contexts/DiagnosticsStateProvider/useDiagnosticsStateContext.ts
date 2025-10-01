import { useContext } from 'react';

import { DiagnosticsStateContext } from './DiagnosticsStateProvider';

const useDiagnosticsStateContext = () => {
  const context = useContext(DiagnosticsStateContext);
  if (!context) {
    throw new Error('useDiagnosticsStateContext must be used within a DiagnosticsStateProvider');
  }

  return context;
};

export default useDiagnosticsStateContext;
