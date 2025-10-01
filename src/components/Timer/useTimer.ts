import format from 'date-fns/format';
import { useEffect, useRef } from 'react';

const useTimer = () => {
  const date = useRef(new Date());
  const timeRef = useRef<HTMLSpanElement>(null);

  const handleTimer = () => (date.current = new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      const time = format(new Date(), 'HH:mm');
      if (timeRef.current) timeRef.current.textContent = time;

      return (date.current = new Date());
    }, 15000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  useEffect(() => {
    window.addEventListener('focus', handleTimer);

    return () => {
      window.removeEventListener('focus', handleTimer);
    };
  }, []);

  return { date, timeRef };
};

export default useTimer;
