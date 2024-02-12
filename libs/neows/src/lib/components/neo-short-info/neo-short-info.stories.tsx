import { Meta, Story } from '@storybook/react';
import { Card } from 'flowbite-react';
import { withRouter } from 'storybook-addon-react-router-v6';
import { LookupResponse } from '../../models';
import { NeoShortInfo, NeoShortInfoProps } from './neo-short-info';
import { NeoShortInfoBookmark } from './neo-short-info-bookmark';
import { NeoShortInfoLinks } from './neo-short-info-links';

export default {
  component: NeoShortInfo,
  title: 'components/NeoShortInfo',
  decorators: [
    withRouter,
    (Story) => (
      <Card className="dark:bg-slate-800 dark:text-white">{Story()}</Card>
    ),
  ],
} as Meta;

const Template: Story<NeoShortInfoProps> = (args) => <NeoShortInfo {...args} />;

const neo: LookupResponse = {
  links: {
    self: 'http://api.nasa.gov/neo/rest/v1/neo/2496816?api_key=ICzn1y9k7kZGjpJb91uaOGxnaKM8zHc7Pnzu2lg5',
  },
  id: '2496816',
  neo_reference_id: '2496816',
  name: '496816 (1989 UP)',
  nasa_jpl_url: 'http://ssd.jpl.nasa.gov/sbdb.cgi?sstr=2496816',
  absolute_magnitude_h: 20.56,
  estimated_diameter: {
    kilometers: {
      estimated_diameter_min: 0.2053784995,
      estimated_diameter_max: 0.459240286,
    },
    meters: {
      estimated_diameter_min: 205.3784995184,
      estimated_diameter_max: 459.2402860401,
    },
    miles: {
      estimated_diameter_min: 0.1276162436,
      estimated_diameter_max: 0.2853585958,
    },
    feet: {
      estimated_diameter_min: 673.8139963601,
      estimated_diameter_max: 1506.6939000519,
    },
  },
  is_potentially_hazardous_asteroid: true,
  close_approach_data: [
    {
      close_approach_date: '2023-01-23',
      close_approach_date_full: '2023-Jan-23 12:21',
      epoch_date_close_approach: 1674476460000,
      relative_velocity: {
        kilometers_per_second: '16.7129653576',
        kilometers_per_hour: '60166.6752872232',
        miles_per_hour: '37385.2322083304',
      },
      miss_distance: {
        astronomical: '0.3255063929',
        lunar: '126.6219868381',
        kilometers: '48695063.049223123',
        miles: '30257709.1101721774',
      },
      orbiting_body: 'Earth',
    },
  ],
  is_sentry_object: false,
};

const bookmark = (
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  <NeoShortInfoBookmark bookmarkedChanged={() => {}} isBookmarked={false} />
);
const footer = <NeoShortInfoLinks neo={neo} />;

export const NoNeo = Template.bind({});
NoNeo.args = {
  neo: undefined,
};

export const Default = Template.bind({});
Default.args = {
  neo,
  bookmark,
  footer,
};

export const NoFooter = Template.bind({});
NoFooter.args = {
  neo,
  bookmark,
};

export const NoFooterOrBookmark = Template.bind({});
NoFooterOrBookmark.args = {
  neo,
};
