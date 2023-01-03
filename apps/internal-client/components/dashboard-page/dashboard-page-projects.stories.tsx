import type { ComponentStory, ComponentMeta } from '@storybook/react';
import { DashboardPageProjects } from './dashboard-page-projects';

const Story: ComponentMeta<typeof DashboardPageProjects> = {
  component: DashboardPageProjects,
  title: 'DashboardPageProjects',
};
export default Story;

const Template: ComponentStory<typeof DashboardPageProjects> = (args) => (
  <DashboardPageProjects {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
