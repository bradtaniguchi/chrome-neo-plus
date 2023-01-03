import type { ComponentStory, ComponentMeta } from '@storybook/react';
import { DashboardPageConfig } from './dashboard-page-config';

const Story: ComponentMeta<typeof DashboardPageConfig> = {
  component: DashboardPageConfig,
  title: 'DashboardPageConfig',
};
export default Story;

const Template: ComponentStory<typeof DashboardPageConfig> = (args) => (
  <DashboardPageConfig {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
