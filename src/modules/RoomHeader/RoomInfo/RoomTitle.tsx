import { PropsWithChildren } from 'react';

const RoomTitle = ({ children }: PropsWithChildren) => (
  <div className="xs:justify-start text-size-sm flex max-w-full items-center justify-center space-x-1 whitespace-nowrap text-gray-100 dark:text-white lg:!justify-center">
    <span className="max-w-full truncate font-medium">{children}</span>
  </div>
);

export default RoomTitle;
