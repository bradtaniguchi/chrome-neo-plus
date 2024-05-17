import { getToday } from '@chrome-neo-plus/common';
import { NeowsCloseApproachData } from '../models';

/**
 * This gets the closest **future** approach for the given planet
 *
 * @param params the parameters for the function
 * @param params.closeApproaches the list of close approaches to go over
 * @param params.date the date to get the next close approach for, defaults to today if not given, format is 'YYYY-MM-DD'
 * @param params.orbitingBody the planet to get the next close approach for, defaults to Earth if not given
 */
export function getNextCloseApproach<
  CloseApproachData extends Pick<
    NeowsCloseApproachData,
    'close_approach_date' | 'orbiting_body'
  >
>(params: {
  closeApproaches: Array<CloseApproachData>;
  date?: string;
  orbitingBody?: NeowsCloseApproachData['orbiting_body'];
}): CloseApproachData | undefined {
  const { closeApproaches, orbitingBody } = params;
  if (!closeApproaches) return undefined;

  const date = params.date ?? getToday();

  const futureCloseApproaches = closeApproaches.filter(
    (approach) =>
      approach.close_approach_date >= date &&
      approach.orbiting_body === (orbitingBody ?? 'Earth')
  );

  if (!futureCloseApproaches.length) return undefined;

  return futureCloseApproaches[0];
}
