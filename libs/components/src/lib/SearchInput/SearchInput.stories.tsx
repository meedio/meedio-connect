import { Story, Meta } from '@storybook/react';

import SearchInputComponent, { SearchInputProps } from './SearchInput';

export default {
  component: SearchInputComponent,
  title: 'Components/Inputs',
} as Meta;

const SearchInputExample: Story<SearchInputProps> = (args) => <SearchInputComponent {...args} />;

export const SearchInput = SearchInputExample.bind({});

SearchInput.args = {
  placeholder: 'Search example',
};
