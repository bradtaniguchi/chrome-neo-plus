import { Meta, Story } from '@storybook/react';
import { DateTime } from 'luxon';
import { withRouter } from 'storybook-addon-react-router-v6';
import { ViewDaily } from './view-daily';
import { DATE_FORMAT } from '@chrome-neo-plus/common';

export default {
  component: ViewDaily,
  title: 'pages/ViewDaily',
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

const Template: Story = (args) => <ViewDaily {...args} />;

export const Today = Template.bind({});
Today.args = {
  date: DateTime.now().toFormat(DATE_FORMAT),
};
