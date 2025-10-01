import { Meta, Story } from '@storybook/react';

import ToastComponent from './Toast';
import { ToastProps, OuterContainerProps, SubtitleProps, HeaderProps, ActionProps, CloseIconProps } from './utils';
import { ReactComponent as Check } from '../../assets/icons/Check.svg';

export default {
  component: ToastComponent,
  title: 'Components/Toast_OLD',
  decorators: [
    (Story) => (
      <div className="w-100 h-fit-content">
        <Story />
      </div>
    ),
  ],
} as Meta;

type ToastStoryProps = ToastProps &
  OuterContainerProps &
  SubtitleProps &
  HeaderProps &
  ActionProps &
  CloseIconProps & { actionTitle: string; subtitle: string };

const ToastExample: Story<ToastStoryProps> = ({ variant, title, onClose, subtitle, onClick, actionTitle }) => (
  <ToastComponent variant={variant} className="w-100 !p-0">
    <ToastComponent.OuterContainer className="px-4 pt-4">
      <Check className="stroke-curent h-5 w-5 shrink-0 text-white" />
      <ToastComponent.InnerContainer>
        <ToastComponent.Header title={title}>
          <ToastComponent.CloseIcon onClose={onClose} />
        </ToastComponent.Header>
        <ToastComponent.Subtitle variant={variant}>{subtitle}</ToastComponent.Subtitle>
        <ToastComponent.Action variant={variant} onClick={onClick}>
          {actionTitle}
        </ToastComponent.Action>
      </ToastComponent.InnerContainer>
    </ToastComponent.OuterContainer>
    <ToastComponent.Footer>
      <ToastComponent.Action variant={variant} onClick={onClick}>
        {actionTitle}
      </ToastComponent.Action>
    </ToastComponent.Footer>
  </ToastComponent>
);

export const Toast = ToastExample.bind({});

Toast.args = {
  variant: 'light',
  title: 'Title title',
  subtitle: 'Very long caption text',
  onClick: () => null,
  onClose: () => null,
  actionTitle: 'Click here',
};
