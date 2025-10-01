import { Meta, Story } from '@storybook/react';

import BannerComponent from './Banner';
import { BannerProps, IconProps, ActionProps, CloseIconProps } from './utils';

export default {
  component: BannerComponent,
  title: 'Components/Banner',
  argTypes: {
    size: {
      name: 'iconSize',
      options: ['sm', 'md'],
      control: { type: 'inline-radio' },
    },
    title: {
      options: ['Something went wrong'],
      defaultValue: 'title',
      control: { type: 'select' },
    },
    subtitle: {
      options: [
        'The call could not be created. Please try again',
        'meedio.me/doctors is already taken, please choose a different name.',
      ],
      defaultValue: 'subtitle',
      control: { type: 'select' },
    },
    actionTitle: {
      options: ['Subscribe', 'Click here'],
      defaultValue: 'Action',
      control: { type: 'select' },
    },
  },
} as Meta;

type StoryProps = { showIcon: boolean; title: string; subtitle: string; actionTitle: string };
type BannerExampleProps = BannerProps & ActionProps & IconProps & CloseIconProps & StoryProps;

const BannerExample: Story<BannerExampleProps> = ({
  variant,
  size,
  showIcon,
  title,
  subtitle,
  onClick,
  onClose,
  actionTitle,
}) => (
  <BannerComponent variant={variant} className="!w-100">
    {showIcon && <BannerComponent.Icon variant={variant} size={size} />}
    <BannerComponent.Container>
      <BannerComponent.Title>{title}</BannerComponent.Title>
      <BannerComponent.Subtitle>{subtitle}</BannerComponent.Subtitle>
      <BannerComponent.Action onClick={onClick}>{actionTitle}</BannerComponent.Action>
    </BannerComponent.Container>
    <BannerComponent.CloseButton onClose={onClose} />
  </BannerComponent>
);

export const Banner = BannerExample.bind({});

Banner.args = {
  showIcon: true,
  variant: 'alert',
  size: 'md',
  onClose: () => null,
  onClick: () => null,
};
