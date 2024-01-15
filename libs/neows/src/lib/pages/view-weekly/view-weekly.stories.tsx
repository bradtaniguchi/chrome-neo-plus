import { Meta, Story } from '@storybook/react';
import { DateTime } from 'luxon';
import { withRouter } from 'storybook-addon-react-router-v6';
import { DATE_FORMAT } from '@chrome-neo-plus/common';
import { ViewWeekly } from './view-weekly';

export default {
  component: ViewWeekly,
  title: 'pages/ViewWeekly',
  decorators: [withRouter],
  argTypes: {
    date: {
      type: 'string',
      description:
        'The date to display metrics for, defaults to today. Should be in yyyy-MM-dd format.',
      defaultValue: DateTime.now().toFormat(DATE_FORMAT),
    },
  },
} as Meta;

const Template: Story = (args) => <ViewWeekly {...args} />;

export const CurrentWeek = Template.bind({
  args: {
    date: DateTime.now().toFormat(DATE_FORMAT),
  },
});
