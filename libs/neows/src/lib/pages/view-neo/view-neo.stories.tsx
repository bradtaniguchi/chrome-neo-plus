import { Meta, Story } from '@storybook/react';
import { ViewNeo } from './view-neo';

export default {
  component: ViewNeo,
  title: 'components/ViewNeo',
} as Meta;

const Template: Story = (args) => <ViewNeo {...args} />;

export const Primary = Template.bind({});
