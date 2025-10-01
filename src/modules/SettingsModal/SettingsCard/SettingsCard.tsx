import RoundedContainer from '@shared/components/RoundedContainer/RoundedContainer';
import cx from 'classnames';
import { PropsWithChildren } from 'react';

import { IconType } from 'utils/types';

import DescriptionWrapper from './DescriptionWrapper';
import Form from './Form';

const iconBgVariants = {
  default: 'bg-grayscale-gray20',
  complementary: 'bg-complementary-50',
  tertiary: 'bg-tertiary-50',
  black: 'bg-black',
};

export type IconBackgroundType = keyof typeof iconBgVariants;

type SettingsCardProps = {
  icon: IconType;
  title: string;
  iconBackgroundVariant?: IconBackgroundType;
  className?: string;
  iconClassName?: string;
};

type ClassNameType = {
  className?: string;
};

const Content = ({ children, className }: PropsWithChildren<ClassNameType>) => (
  <div className={cx('h-fit w-full p-4 text-size-sm', className)}>{children}</div>
);

const Title = ({ children }: PropsWithChildren) => <span className="text-graycale-black font-medium">{children}</span>;
const Description = ({ children }: PropsWithChildren) => (
  <span className="text-grayscale-gray80 font-light">{children}</span>
);

Content.Title = Title;
Content.Description = Description;
Content.Form = Form;
Content.DescriptionWrapper = DescriptionWrapper;

const SettingsCard = ({ children }: PropsWithChildren) => (
  <RoundedContainer
    variant="white"
    className="border-grayscale-gray30 flex !w-full !min-w-full flex-col !items-start border !p-0"
    radiusVariant="2xl"
  >
    {children}
  </RoundedContainer>
);

const Header = ({
  children,
  icon: Icon,
  title,
  iconBackgroundVariant = 'default',
  iconClassName,
}: PropsWithChildren<SettingsCardProps>) => (
  <div className="text-grayscale-black border-gray-30 flex w-full items-center justify-between space-x-2 border-b p-4">
    <div className="flex w-full space-x-2">
      <div className={cx('h-fit rounded-lg p-1', iconBgVariants[iconBackgroundVariant])}>
        <Icon className={cx('h-4 w-4 shrink-0 stroke-current stroke-2', iconClassName)} />
      </div>
      <span className="text-size-md font-medium">{title}</span>
    </div>
    {children}
  </div>
);

SettingsCard.Content = Content;
SettingsCard.Header = Header;

export default SettingsCard;
