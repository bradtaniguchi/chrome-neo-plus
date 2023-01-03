// import Card from '@mui/material/Card';
import { Meta, Story } from '@storybook/react';
// import { DateTime } from 'luxon';
import { withRouter } from 'storybook-addon-react-router-v6/';
import { ApodPage } from './apod-page';
// import { LUXON_DATE } from '@chrome-neo-plus/common';

export default {
  component: ApodPage,
  title: 'pages/ApodPage',
  decorators: [
    (Story) => (
      // Use the demo api, rather than the future private api
      // as it isn't available yet.
      <div>
        <Story />
      </div>
    ),
    withRouter,
  ],
  parameters: {
    reactRouter: {
      routePath: '/:date',
      routeParams: { date: '2022-05-23' },
    },
  },
} as Meta;

const Template: Story = (args) => <ApodPage {...args} />;

export const RoutedDate = Template.bind({});
RoutedDate.args = {};

// export const PropOverrideDate = Template.bind({});
// PropOverrideDate.args = {
//   date: DateTime.local().toFormat(LUXON_DATE),
// };

export const InvalidDate = Template.bind({});
InvalidDate.args = {
  date: new Date().toString(),
};

// export const ErrorDate = Template.bind({});
// ErrorDate.args = {
//   // Sorry developer a thousand years in the future.
//   date: DateTime.fromFormat('3022-01-01', 'yyyy-MM-dd').toFormat('yyyy-MM-dd'),
// };
