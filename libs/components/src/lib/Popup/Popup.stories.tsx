import { Story, Meta } from '@storybook/react';

import PopupComponent, { PopupProps } from './Popup';

export default {
  component: PopupComponent,
  title: 'components/Popup',
} as Meta;

const PopupExample: Story<PopupProps> = (args) => (
  <PopupComponent {...args}>
    <PopupComponent.Container>
      <PopupComponent.Header>Example popup header</PopupComponent.Header>
      <PopupComponent.ScrollContainer>Content</PopupComponent.ScrollContainer>
      <PopupComponent.Footer>Footer</PopupComponent.Footer>
    </PopupComponent.Container>
  </PopupComponent>
);

export const Popup = PopupExample.bind({});

Popup.args = {
  isVisible: true,
};
