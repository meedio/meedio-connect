import cx from 'classnames';
import { PropsWithChildren, ReactNode } from 'react';

import { IconType } from 'utils/types';

import { meetingTestingConstants } from '../../../../constants/src';
import RoundedContainer from '../RoundedContainer/RoundedContainer';

export interface UILabelProps {
  className?: string;
  children: ReactNode;
}

const Icon = ({ icon: Icon }: { icon: IconType }) => <Icon className="shrink-0" />;
const LabelText = ({ children }: PropsWithChildren) => (
  <p className="text-size-xs font-sm truncate pr-1" data-testid={meetingTestingConstants.uiLabelText}>
    {children}
  </p>
);

const UILabel = ({ children, className }: UILabelProps) => (
  <RoundedContainer
    variant="neutral"
    className={cx(
      'dark:bg-white10 bg-gray-0 text-gray-80 dark:shadow-xs space-x-1 rounded-3xl !p-1.5 shadow-none dark:text-white',
      className
    )}
  >
    {children}
  </RoundedContainer>
);

UILabel.Icon = Icon;
UILabel.LabelText = LabelText;

export default UILabel;
