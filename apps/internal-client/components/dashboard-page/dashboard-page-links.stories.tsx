import type { ComponentStory, ComponentMeta } from '@storybook/react';
import { DashboardPageLinks } from './dashboard-page-links';

const Story: ComponentMeta<typeof DashboardPageLinks> = {
  component: DashboardPageLinks,
  title: 'DashboardPageLinks',
};
export default Story;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const Template: ComponentStory<typeof DashboardPageLinks> = (args: any) => (
  <DashboardPageLinks {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
