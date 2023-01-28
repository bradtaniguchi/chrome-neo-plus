import { Meta, Story } from '@storybook/react';
import { DateTime } from 'luxon';
import { withRouter } from 'storybook-addon-react-router-v6';
import { Overview, OverviewProps } from './overview';

export default {
  component: Overview,
  title: 'components/Overview',
  decorators: [withRouter],
} as Meta;

const Template: Story<OverviewProps> = (args) => <Overview {...args} />;

export const Today = Template.bind({
  args: {
    day: DateTime.now().toFormat('yyyy-MM-dd'),
  },
});
