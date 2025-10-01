import { useContext } from 'react';

import { SelectGroupContext } from './SelectGroup';

function useSelectGroupContext() {
  const context = useContext(SelectGroupContext);

  if (!context) throw new Error('useSelectGroupContext must be used within a SelectGroupContext.Provider');
  return context;
}

export default useSelectGroupContext;
