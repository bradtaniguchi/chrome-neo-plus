import { Meta, Story } from '@storybook/react';
import { NeoShortInfo } from './neo-short-info';

export default {
  component: NeoShortInfo,
  title: 'components/NeoShortInfo',
} as Meta;

const Template: Story = (args) => <NeoShortInfo {...args} />;

export const Default = Template.bind({});
