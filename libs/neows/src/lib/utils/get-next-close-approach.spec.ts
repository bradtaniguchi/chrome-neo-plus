import { getNextCloseApproach } from './get-next-close-approach';

describe('getNextCloseApproach', () => {
  type CloseApproachParam = Parameters<
    typeof getNextCloseApproach
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

  test('returns undefined if the array is empty', () => {
    expect(
      getNextCloseApproach({
        closeApproaches: [],
      })
    ).toEqual(undefined);
  });

  test('returns the closest future approach for the given planet', () => {
    expect(
      getNextCloseApproach({
        closeApproaches: [
          pastCloseApproach,
          futureCloseApproach,
          otherPlanetApproach,
          distantFutureCloseApproach,
        ],
        date: '2022-12-11',
      })
    ).toEqual(futureCloseApproach);
  });

  test('does not return past close approaches', () => {
    expect(
      getNextCloseApproach({
        closeApproaches: [pastCloseApproach],
        date: '2022-12-11',
      })
    ).toEqual(undefined);
  });

  test('does not return other planet approaches', () => {
    expect(
      getNextCloseApproach({
        closeApproaches: [otherPlanetApproach],
        date: '2022-12-11',
      })
    ).toEqual(undefined);
  });
});
