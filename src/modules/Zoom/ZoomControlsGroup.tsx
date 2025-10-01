import { PropsWithChildren } from 'react';

const ZoomControlsGroup = ({ children }: PropsWithChildren) => (
  <div className="bg-black80 flex flex-col items-center justify-center space-y-2 rounded-2xl p-1">{children}</div>
);

export default ZoomControlsGroup;
