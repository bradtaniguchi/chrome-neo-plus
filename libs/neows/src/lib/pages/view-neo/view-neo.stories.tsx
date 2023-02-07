import { Meta, Story } from '@storybook/react';
import { ViewNeo } from './view-neo';

export default {
  component: ViewNeo,
  title: 'pages/ViewNeo',
} as Meta;

const Template: Story = (args) => <ViewNeo {...args} />;

export const Primary = Template.bind({});
