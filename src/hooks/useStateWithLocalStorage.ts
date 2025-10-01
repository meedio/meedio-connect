import { useEffect, useState } from 'react';

import { SetState } from 'utils/types';

import useLocalStorage from './useLocalStorage/useLocalStorage';

//NOTE: this hook exposes regular react state, but also saves the latest value to local storage
export default function useStateWithLocalStorage<T>(key: string, initialValue: T): [T, SetState<T>] {
  const [storageValue, setStorageValue] = useLocalStorage(key, initialValue);
  const [state, setState] = useState(storageValue);

  useEffect(() => setStorageValue(state), [state, setStorageValue]);

  return [state, setState];
}
