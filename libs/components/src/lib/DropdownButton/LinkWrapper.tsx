import { PropsWithChildren } from 'react';

interface LinkWrapperProps {
  link?: string;
}

const LinkWrapper = ({ children, link }: PropsWithChildren<LinkWrapperProps>) =>
  link ? (
    <a href={link} rel="noreferrer" target="_blank">
      {children}
    </a>
  ) : (
    <>{children}</>
  );

export default LinkWrapper;
