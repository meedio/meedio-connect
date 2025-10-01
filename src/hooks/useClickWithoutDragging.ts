import { useRef } from 'react';

const useClickWithoutDragging = (clickHandler: () => void) => {
  const isDraggingRef = useRef(false);
  const isMouseDownRef = useRef(false);

  const handleMouseDown = () => {
    isMouseDownRef.current = true;
  };

  const handleMouseMove = () => {
    if (!isMouseDownRef.current) return;

    isDraggingRef.current = true;
  };

  const handleMouseUp = () => {
    if (!isDraggingRef.current) clickHandler();

    isDraggingRef.current = false;
    isMouseDownRef.current = false;
  };

  return { handleMouseDown, handleMouseMove, handleMouseUp };
};

export default useClickWithoutDragging;
