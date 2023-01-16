import type { ComponentMeta, ComponentStory } from '@storybook/react';
import { DateTime } from 'luxon';
import { withRouter } from 'storybook-addon-react-router-v6';
import { ApodListPage } from './apod-list-page';

const Story: ComponentMeta<typeof ApodListPage> = {
  component: ApodListPage,
  title: 'pages/ApodListPage',
  decorators: [withRouter],
  parameters: {
    reactRouter: {
      // routePath: '/',
      // routeParams: { startDate: '2022-05-23' },
    },
  },
};
export default Story;

const Template: ComponentStory<typeof ApodListPage> = (args) => (
  <ApodListPage {...args} />
);

export const ThisPastWeek = Template.bind({});
ThisPastWeek.args = {};

export const PropOverrideDates = Template.bind({});
PropOverrideDates.args = {
  startDate: DateTime.local().plus({ day: -3 }).toFormat('yyyy-MM-dd'),
};

export const InvalidDate = Template.bind({});
InvalidDate.args = {
  startDate: DateTime.fromObject({
    year: 2023,
    month: 1,
    day: 1,
  }).toFormat('MM/dd/yyyy'),
  endDate: DateTime.fromObject({
    year: 2023,
    month: 1,
    day: 1,
  })
    .plus({ day: 3 })
    .toFormat('MM/dd/yyyy'),
};

export const ErrorDate = Template.bind({});
ErrorDate.args = {
  // Sorry developer a thousand years in the future.
  startDate: DateTime.fromFormat('3022-01-01', 'yyyy-MM-dd').toFormat(
    'yyyy-MM-dd'
  ),
};
