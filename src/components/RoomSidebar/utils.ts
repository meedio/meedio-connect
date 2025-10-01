const transition = 'md:transition-all md:transform md:duration-500 md:ease-in-out';
const closed = 'md:translate-x-[400px] md:w-0';

export const sidebarAnimationProps = {
  enter: transition,
  enterFrom: closed,
  leave: transition,
  leaveTo: closed,
};
