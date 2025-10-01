import { ComponentPropsWithoutRef, PropsWithChildren } from 'react';

const NoVideo = ({ children, ...rest }: PropsWithChildren<ComponentPropsWithoutRef<'div'>>) => (
  <div className="flex h-full w-full select-none items-center justify-center" {...rest}>
    {children}
  </div>
);

export default NoVideo;
