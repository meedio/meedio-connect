import { PropsWithChildren } from 'react';

interface DescriptionWrapperProps {
  title: string;
  subtitle: string | JSX.Element;
  dataTestId?: string;
}

const DescriptionWrapper = ({ title, subtitle, children, dataTestId }: PropsWithChildren<DescriptionWrapperProps>) => (
  <div className="flex w-full flex-col space-y-4 md:flex-row md:space-x-6 md:space-y-0" data-testid={dataTestId}>
    <div className="flex w-full flex-col space-y-1">
      <span className="text-grayscale-black text-size-sm font-medium">{title}</span>
      <span className="text-grayscale-gray80 text-size-sm font-light">{subtitle}</span>
    </div>
    {children}
  </div>
);

export default DescriptionWrapper;
