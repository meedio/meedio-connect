import { useEffect } from 'react';

interface UseHideOnOutsideClickProps {
  ref: React.RefObject<HTMLElement>;
  onClickOutside: () => void;
  additionalSelector?: string;
}

const useHideOnOutsideClick = ({ ref, onClickOutside, additionalSelector }: UseHideOnOutsideClickProps) => {
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      const element = ref.current;
      const additionalElement = additionalSelector ? document.querySelector(additionalSelector) : null;

      if (
        element &&
        !element.contains(event.target as Node) &&
        (!additionalElement || !additionalElement.contains(event.target as Node))
      ) {
        onClickOutside();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [ref, onClickOutside, additionalSelector]);
};

export default useHideOnOutsideClick;
