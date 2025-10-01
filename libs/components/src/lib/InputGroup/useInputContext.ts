import { useContext } from 'react';

import { InputContext } from './InputGroup';

function useInputContext() {
  const context = useContext(InputContext);

  if (!context) throw new Error('useInputContext must be used within a InputContext.Provider');
  return context;
}

export default useInputContext;
