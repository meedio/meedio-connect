import { useState, useEffect } from 'react';

const useDebouncedVisible = (condition: boolean, delay = 800) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(false);
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, delay);

    return () => clearTimeout(timer);
  }, [condition, delay]);

  return isVisible;
};

export default useDebouncedVisible;
