import type { ComponentMeta, ComponentStory } from '@storybook/react';
import { DateTime } from 'luxon';
import { withRouter } from 'storybook-addon-react-router-v6';
import { ApodListPage } from './apod-list-page';
import { DATE_FORMAT } from '@chrome-neo-plus/common';

const Story: ComponentMeta<typeof ApodListPage> = {
  component: ApodListPage,
  title: 'pages/ApodListPage',
  decorators: [withRouter],
  parameters: {
    reactRouter: {
      // TODO: this might be incorrect and w
      routePath: '/',
      searchParams: {
        start_date: DateTime.now().minus({ day: 5 }).toFormat(DATE_FORMAT),
        end_date: DateTime.now().toFormat(DATE_FORMAT),
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
