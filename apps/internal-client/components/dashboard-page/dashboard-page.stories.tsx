import type { ComponentStory, ComponentMeta } from '@storybook/react';
import { DashboardPage } from './dashboard-page';

const Story: ComponentMeta<typeof DashboardPage> = {
  component: DashboardPage,
  title: 'DashboardPage',
};
export default Story;

const Template: ComponentStory<typeof DashboardPage> = (args) => (
  <DashboardPage {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
