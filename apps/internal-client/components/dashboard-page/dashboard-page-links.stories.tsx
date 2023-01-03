import type { ComponentStory, ComponentMeta } from '@storybook/react';
import { DashboardPageLinks } from './dashboard-page-links';

const Story: ComponentMeta<typeof DashboardPageLinks> = {
  component: DashboardPageLinks,
  title: 'DashboardPageLinks',
};
export default Story;

const Template: ComponentStory<typeof DashboardPageLinks> = (args) => (
  <DashboardPageLinks {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
