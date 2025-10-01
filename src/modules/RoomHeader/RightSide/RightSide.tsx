import Header from '@shared/components/Header/Header';
import { PropsWithChildren } from 'react';

import RoomCurrentTime from './RoomCurrentTime';

const RightSide = ({ children }: PropsWithChildren) => (
  <Header.Right>
    <div className="flex items-center justify-center space-x-2">{children}</div>
  </Header.Right>
);

RightSide.CurrentTime = RoomCurrentTime;

export default RightSide;
