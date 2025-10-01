import { PropsWithChildren } from 'react';

import MeetingDiagnosticsButton from './MeetingDiagnosticsButton/MeetingDiagnosticsButton';

const RoomEndedPageContainer = ({ children }: PropsWithChildren) => (
  <div className="flex h-full w-full bg-white dark:bg-black">
    <div className="flex flex-col w-full h-full overflow-y-auto p-4">
      <div className="flex w-full justify-end mb-4">
        <MeetingDiagnosticsButton />
      </div>
      <div className="m-auto flex flex-col w-full items-center space-y-2">{children}</div>
    </div>
  </div>
);

export default RoomEndedPageContainer;
