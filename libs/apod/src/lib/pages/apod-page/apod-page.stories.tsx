import { Meta, Story } from '@storybook/react';
import { DateTime } from 'luxon';
import { withRouter } from 'storybook-addon-react-router-v6';
import { ApodPage } from './apod-page';
import { DATE_FORMAT } from '@chrome-neo-plus/common';

export default {
  component: ApodPage,
  title: 'pages/ApodPage',
  decorators: [withRouter],
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

export const PropOverrideDate = Template.bind({});
PropOverrideDate.args = {
  date: DateTime.local().toFormat(DATE_FORMAT),
};

export const InvalidDate = Template.bind({});
InvalidDate.args = {
  date: new Date().toString(),
};

export const ErrorDate = Template.bind({});
ErrorDate.args = {
  // Sorry developer a thousand years in the future.
  date: DateTime.fromFormat('3022-01-01', DATE_FORMAT).toFormat(DATE_FORMAT),
};
