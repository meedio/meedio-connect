import { Transition } from '@headlessui/react';
import { insetZero } from '@shared/utils';
import cx from 'classnames';
import { ComponentPropsWithoutRef, ForwardedRef, forwardRef, MouseEvent, PropsWithChildren } from 'react';

import { RoomSidebars } from 'contexts/RoomUIContext/types';
import useRoomUIContext from 'contexts/RoomUIContext/useRoomUIContext';

import RoomSidebarButton from './RoomSidebarButton';
import RoomSidebarHeader from './RoomSidebarHeader';
import RoomSidebarToggle from './RoomSidebarToggle';
import { sidebarAnimationProps } from './utils';

interface RoomSidebarProps {
  sidebar: RoomSidebars;
  testId?: string;
}

const RoomSidebar = forwardRef(
  (
    {
      children,
      sidebar,
      className,
      testId,
      ...props
    }: PropsWithChildren<RoomSidebarProps & ComponentPropsWithoutRef<'div'>>,
    ref?: ForwardedRef<HTMLDivElement>
  ) => {
    const {
      dispatch,
      actions: { setValues, closeSidebar },
      state: { activeSidebar, shouldAnimateSidebar },
    } = useRoomUIContext();

    const isSidebarActive = activeSidebar?.type === sidebar;

    if (!shouldAnimateSidebar && !isSidebarActive) return null;

    const preventPropagation = (event: MouseEvent<HTMLDivElement>) => event.stopPropagation();
    const handleCloseSidebar = () => dispatch(closeSidebar());
    const disableAnimation = () => dispatch(setValues({ shouldAnimateSidebar: false }));

    return (
      <Transition
        className={cx(
          'z-modal bg-black15 fixed flex w-full md:static md:z-0 md:mr-6 md:max-w-100 md:bg-transparent md:py-0.5',
          insetZero
        )}
        data-testid={testId}
        show={isSidebarActive}
        onClick={handleCloseSidebar}
        afterEnter={disableAnimation}
        {...sidebarAnimationProps}
      >
        <div
          className={cx(
            'relative flex flex-col grow min-w-0 bg-white p-4 mt-16 md:mt-0 rounded-t-2xl md:rounded-b-2xl',
            className
          )}
          {...props}
          ref={ref}
          onClick={preventPropagation}
        >
          {children}
        </div>
      </Transition>
    );
  }
);

RoomSidebar.displayName = 'MeetingSidebar';

export default Object.assign(RoomSidebar, {
  Header: RoomSidebarHeader,
  Button: RoomSidebarButton,
  Toggle: RoomSidebarToggle,
});
