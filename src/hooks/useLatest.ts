import { MutableRefObject, useEffect, useRef } from 'react';

const useLatest = <T>(value: T): MutableRefObject<T> => {
  const ref = useRef(value);

  useEffect(() => {
    ref.current = value;
  }, [value]);

  return ref;
};

export default useLatest;
