import { useEffect } from 'react';
import { useParams } from 'react-router-dom';

const useSafeAreaTheme = () => {
  const params = useParams();

  useEffect(() => {
    const shouldHaveDarkBg = !!params.roomId;

    if (shouldHaveDarkBg) {
      document.querySelector("meta[name='theme-color']")?.setAttribute('content', '#1a1e23');
    }

    return () => document.querySelector("meta[name='theme-color']")?.setAttribute('content', '#ffffff');
  }, [params]);
};

export default useSafeAreaTheme;
