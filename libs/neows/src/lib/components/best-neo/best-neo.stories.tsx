import { Meta, Story } from '@storybook/react';
import { DateTime } from 'luxon';
import { withRouter } from 'storybook-addon-react-router-v6';
import { BestNeo, BestNeoProps } from './best-neo';

export default {
  component: BestNeo,
  title: 'components/BestNeo',
  decorators: [withRouter],
} as Meta;

const Template: Story<BestNeoProps> = (args) => <BestNeo {...args} />;

export const Default = Template.bind({});
Default.args = {
  date: DateTime.now().toFormat('yyyy-MM-dd'),
};
