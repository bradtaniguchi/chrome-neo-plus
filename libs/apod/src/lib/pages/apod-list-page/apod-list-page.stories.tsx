import type { ComponentStory, ComponentMeta } from '@storybook/react';
import { ApodListPage } from './apod-list-page';

const Story: ComponentMeta<typeof ApodListPage> = {
  component: ApodListPage,
  title: 'ApodListPage',
};
export default Story;

const Template: ComponentStory<typeof ApodListPage> = (args) => (
  <ApodListPage {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
