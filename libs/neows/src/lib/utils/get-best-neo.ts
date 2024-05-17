import { NeowsResponse } from '../models';

/**
 * Returns the "best" NEO for the given list of NEOS.
 * Unlike the previous implementation this just returns the
 * largest dangerous NEO
 *
 * @param neos List of NEOS
 * @returns The "best" NEO, or null if one isn't found for some reason
 */
export function getBestNeo(neos: NeowsResponse[]): NeowsResponse | null {
  if (!neos || neos.length === 0) return null;
  return neos.reduce((acc, neo) => {
    if (
      neo.is_potentially_hazardous_asteroid &&
      neo.estimated_diameter.meters.estimated_diameter_max >
        acc.estimated_diameter.meters.estimated_diameter_max
    )
      return neo;
    return acc;
  });
}
