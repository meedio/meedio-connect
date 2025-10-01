import { useEffect, useRef, useState } from 'react';

import { Timeout } from 'utils/types';

const useCopy = (content: string) => {
  const [isCopied, setIsCopied] = useState(false);
  const debounceRef = useRef<Timeout>();

  const copy = () => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    return navigator.clipboard.writeText(content).then(() => {
      setIsCopied(true);
      debounceRef.current = setTimeout(() => setIsCopied(false), 2000);
    });
  };

  useEffect(
    () => () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    },
    []
  );

  return { isCopied, copy };
};

export default useCopy;
