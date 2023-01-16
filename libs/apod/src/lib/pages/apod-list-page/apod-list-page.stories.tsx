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
      // TODO: this might be incorrect and w
      routePath: '/',
      searchParams: {
        start_date: DateTime.now().minus({ day: 5 }).toFormat('yyyy-MM-dd'),
        end_date: DateTime.now().toFormat('yyyy-MM-dd'),
      },
    },
  },
};
export default Story;

const Template: ComponentStory<typeof ApodListPage> = (args) => (
  <ApodListPage />
);

export const LastFiveDays = Template.bind({});
LastFiveDays.args = {};
