import Header from '@shared/components/Header/Header';
import { PropsWithChildren } from 'react';

import RoomTitle from './RoomTitle';

const RoomInfo = ({ children }: PropsWithChildren) => (
  <Header.Center>
    <div className="xs:pr-2 space-y-1 truncate pr-0">{children}</div>
  </Header.Center>
);

RoomInfo.Title = RoomTitle;

export default RoomInfo;
