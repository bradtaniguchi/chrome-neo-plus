import { getApiConfig } from '@chrome-neo-plus/common';
import { LookupResponse } from '../models';
import { neowsCache } from './neows-cache';

/**
 * Get a single neows and details
 * https://api.nasa.gov/neo/rest/v1/neo/
 *
 * @param params the search param requests
 * @param params.asteroid_id the asteroid id to search for
 *  the Asteroid SPK-ID that correlates to the NASA JPL small body
 * @param params.noCache whether to skip the cache
 */
export async function getNeows(params: {
  asteroid_id: string;
  noCache?: boolean;
}): Promise<LookupResponse> {
  const url = new URL(
    `https://api.nasa.gov/neo/rest/v1/neo/${params.asteroid_id}`
  );
  const { apiKey } = await getApiConfig();
  url.searchParams.append('api_key', apiKey);

  const neo = neowsCache.getById(params.asteroid_id);

  if (neo && !params.noCache) return neo;

  const res = await fetch(url.toString()).then((res) => {
    if (res.ok) return res.json();
    throw new Error(res.statusText);
  });

  neowsCache.setById(res);

  return res;
}
