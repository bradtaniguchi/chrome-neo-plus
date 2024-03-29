import { Meta, Story } from '@storybook/react';
import { DateTime } from 'luxon';
import { withRouter } from 'storybook-addon-react-router-v6';
import { Overview, OverviewProps } from './overview';
import { DATE_FORMAT } from '@chrome-neo-plus/common';

export default {
  component: Overview,
  title: 'pages/Overview',
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

const Template: Story<OverviewProps> = (args) => <Overview {...args} />;

export const Today = Template.bind({
  args: {
    date: DateTime.now().toFormat(DATE_FORMAT),
  },
});
