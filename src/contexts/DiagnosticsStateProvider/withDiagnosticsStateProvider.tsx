import { ComponentType, FC } from 'react';

import DiagnosticsStateProvider from './DiagnosticsStateProvider';

function withDiagnosticsStateProvider<T extends object>(Component: ComponentType<T>) {
  const WithDiagnosticsStateProvider: FC<T> = (props) => (
    <DiagnosticsStateProvider>
      <Component {...props} />
    </DiagnosticsStateProvider>
  );

  WithDiagnosticsStateProvider.displayName = `withDiagnosticsStateProvider(${Component.displayName || Component.name}`;

  return WithDiagnosticsStateProvider;
}

export default withDiagnosticsStateProvider;
