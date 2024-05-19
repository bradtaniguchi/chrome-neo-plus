import { getToday } from '@chrome-neo-plus/common';
import { NeowsCloseApproachData } from '../models';

/**
 * Get the previous close approach of a near earth object
 *
 * @param params the parameters for the function
 * @param params.closeApproaches the list of close approaches to go over
 * @param params.date the date to get the previous close approach for, defaults to today if not given, format is 'YYYY-MM-DD'
 * @param params.orbitingBody the planet to get the previous close approach for, defaults to Earth if not given
 */
export function getPreviousCloseApproach<
  CloseApproach extends Pick<
    NeowsCloseApproachData,
    'close_approach_date' | 'orbiting_body'
  >
>(params: {
  closeApproaches: Array<CloseApproach>;
  date?: string;
  orbitingBody?: NeowsCloseApproachData['orbiting_body'];
}) {
  const { closeApproaches, orbitingBody } = params;
  if (!closeApproaches) return undefined;

  const date = params.date ?? getToday();

  const pastCloseApproaches = closeApproaches.filter(
    (approach) =>
      approach.close_approach_date <= date &&
      approach.orbiting_body === (orbitingBody ?? 'Earth')
  );

  if (!pastCloseApproaches.length) return undefined;

  return pastCloseApproaches[0];
}
