import { API_KEY } from '@chrome-neo-plus/common';
import { LookupRequest } from '../models/lookup-request';

/**
 * Get a single neows and details
 * https://api.nasa.gov/neo/rest/v1/neo/
 *
 * @param params the search param requests
 */
export async function getNeows(params: LookupRequest): Promise<unknown> {
  const url = new URL(
    `https://api.nasa.gov/neo/rest/v1/neo/${params.asteroid_id}`
  );
  url.searchParams.append('api_key', API_KEY);

  const res = await fetch(url.toString()).then((res) => {
    if (res.ok) return res.json();
    throw new Error(res.statusText);
  });

  return res;
}
