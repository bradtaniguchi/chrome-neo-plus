import { NeowsResponse } from '../models/neows-response';
import { getPreviousCloseApproach } from './get-previous-close-approach';

describe('getPreviousCloseApproach', () => {
  type CloseApproachParam = Parameters<
    typeof getPreviousCloseApproach
  >[0]['closeApproaches'][0];

  const futureCloseApproach: CloseApproachParam = {
    close_approach_date: '2022-12-12',
    orbiting_body: 'Earth',
  };
  const pastCloseApproach: CloseApproachParam = {
    close_approach_date: '2020-12-12',
    orbiting_body: 'Earth',
  };
  const otherPlanetApproach: CloseApproachParam = {
    close_approach_date: '2023-12-12',
    // mercury
    orbiting_body: 'Merc',
  };

  const distantFutureCloseApproach: CloseApproachParam = {
    close_approach_date: '2023-12-12',
    orbiting_body: 'Earth',
  };

  test('returns undefined if the array is empty ', () => {
    expect(
      getPreviousCloseApproach({
        closeApproaches: [],
      })
    ).toEqual(undefined);
  });

  test('returns the previous close approach for the given planet', () => {
    expect(
      getPreviousCloseApproach({
        closeApproaches: [
          pastCloseApproach,
          futureCloseApproach,
          distantFutureCloseApproach,
        ],
        date: '2022-12-11',
      })
    ).toEqual(pastCloseApproach);
  });

  test('does not return future close approaches', () => {
    expect(
      getPreviousCloseApproach({
        closeApproaches: [futureCloseApproach],
        date: '2022-12-11',
      })
    ).toEqual(undefined);
  });

  test('does not return other planet approaches', () => {
    expect(
      getPreviousCloseApproach({
        closeApproaches: [otherPlanetApproach],
        date: '2022-12-11',
      })
    ).toEqual(undefined);
  });

  // real-world test
  test('returns previous close approach', () => {
    const neo: NeowsResponse = {
      links: {
        self: 'http://api.nasa.gov/neo/rest/v1/neo/2313809?api_key=ICzn1y9k7kZGjpJb91uaOGxnaKM8zHc7Pnzu2lg5',
      },
      id: '2313809',
      neo_reference_id: '2313809',
      name: '313809 (2004 BH41)',
      nasa_jpl_url:
        'https://ssd.jpl.nasa.gov/tools/sbdb_lookup.html#/?sstr=2313809',
      absolute_magnitude_h: 19.32,
      estimated_diameter: {
        kilometers: {
          estimated_diameter_min: 0.3635423218,
          estimated_diameter_max: 0.8129053443,
        },
        meters: {
          estimated_diameter_min: 363.5423218434,
          estimated_diameter_max: 812.9053443399,
        },
        miles: {
          estimated_diameter_min: 0.2258946561,
          estimated_diameter_max: 0.5051158067,
        },
        feet: {
          estimated_diameter_min: 1192.7241911966,
          estimated_diameter_max: 2667.0123699241,
        },
      },
      is_potentially_hazardous_asteroid: false,
      close_approach_data: [
        {
          close_approach_date: '2024-05-18',
          close_approach_date_full: '2024-May-18 15:34',
          epoch_date_close_approach: 1716046440000,
          relative_velocity: {
            kilometers_per_second: '23.9961489406',
            kilometers_per_hour: '86386.1361859854',
            miles_per_hour: '53676.9855651197',
          },
          miss_distance: {
            astronomical: '0.4861354844',
            lunar: '189.1067034316',
            kilometers: '72724832.997658228',
            miles: '45189115.7776024264',
          },
          orbiting_body: 'Earth',
        },
      ],
      is_sentry_object: false,
    };

    expect(
      getPreviousCloseApproach({
        closeApproaches: neo.close_approach_data,
        date: '2024-05-19',
      })
    ).toEqual(neo.close_approach_data[0]);
  });
});
