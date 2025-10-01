import { Placement } from '@floating-ui/react-dom-interactions';

const transition = 'transition-all duration-100';
const closed = 'opacity-0 scale-75';
const opened = 'opacity-100 scale-100';

const transformOrigin = {
  top: 'origin-bottom',
  'top-start': 'origin-bottom-left',
  'top-end': 'origin-bottom-right',
  bottom: 'origin-top',
  'bottom-start': 'origin-top-left',
  'bottom-end': 'origin-top-right',
  left: 'origin-right',
  'left-start': 'origin-top-right',
  'left-end': 'origin-bottom-right',
  right: 'origin-left',
  'right-start': 'origin-top-left',
  'right-end': 'origin-bottom-left',
};

export const getTransitionAnimation = (placement: Placement) => {
  const transitionWithOrigin = `${transition} ${transformOrigin[placement]}`;

  return {
    enter: transitionWithOrigin,
    enterFrom: closed,
    enterTo: opened,
    leave: transitionWithOrigin,
    leaveFrom: opened,
    leaveTo: closed,
  };
};

export const arrowDirections = {
  top: 'bottom',
  right: 'left',
  bottom: 'top',
  left: 'right',
};

export type ArrowDirectionType = keyof typeof arrowDirections;
