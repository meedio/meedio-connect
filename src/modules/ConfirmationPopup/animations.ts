const transition = 'transition-all duration-300';
const openedTransition = 'transform translate-y-full';
const closedTransition = 'transform translate-y-0';
const openedTransitionOpacity = 'opacity-0';
const closedTransitionOpacity = 'opacity-100';

export const transformAnimations = {
  enter: transition,
  enterFrom: openedTransition,
  enterTo: closedTransition,
  leave: transition,
  leaveFrom: closedTransition,
  leaveTo: openedTransition,
};

export const opacityAnimations = {
  enter: transition,
  enterFrom: openedTransitionOpacity,
  enterTo: closedTransitionOpacity,
  leave: transition,
  leaveFrom: closedTransitionOpacity,
  leaveTo: openedTransitionOpacity,
};
