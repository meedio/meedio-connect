import { PropsWithChildren, ReactNode } from 'react';

interface ConditionalWrapperProps {
  condition: boolean;
  wrapper: (children: ReactNode) => JSX.Element;
  elseWrapper?: (children: ReactNode) => JSX.Element;
}

const ConditionalWrapper = ({
  condition,
  wrapper,
  elseWrapper,
  children,
}: PropsWithChildren<ConditionalWrapperProps>) => {
  const conditionElse = elseWrapper ? elseWrapper(children) : <div>{children}</div>;

  return condition ? wrapper(children) : conditionElse;
};

export default ConditionalWrapper;
