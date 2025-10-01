import { PropsWithChildren } from 'react';

import Grid from 'components/Grid/Grid';

import PreRoomHeader from './PreRoomHeader/PreRoomHeader';

const PreRoomContentWrapper = ({ children }: PropsWithChildren) => (
  <div className="side-area-padding top-area-padding flex h-full w-full flex-col overflow-y-auto bg-white dark:bg-black">
    <PreRoomHeader />
    <Grid className="lg:mx-27 mx-4 h-full grid-cols-12 gap-6 md:pb-8">{children}</Grid>
  </div>
);

export default PreRoomContentWrapper;
