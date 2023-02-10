import type { ComponentStory, ComponentMeta } from '@storybook/react';
import { withRouter } from 'storybook-addon-react-router-v6';
import { AppBar } from './app-bar';

const Story: ComponentMeta<typeof AppBar> = {
  component: AppBar,
  title: 'AppBar',
  decorators: [withRouter],
};
export default Story;

const Template: ComponentStory<typeof AppBar> = (args) => <AppBar {...args} />;

export const Primary = Template.bind({});
Primary.args = {};

export const IsSearching = Template.bind({});
IsSearching.args = {
  isSearching: true,
};

export const WithValue = Template.bind({});
WithValue.args = {
  isSearching: true,
  search: 'test',
};
