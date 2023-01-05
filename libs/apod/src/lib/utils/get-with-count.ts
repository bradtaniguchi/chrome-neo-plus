import { ApodResponse } from '../models/apod-response';
import { GetWithCountParams } from '../models/apod-request-params';
import { API_KEY } from '@chrome-neo-plus/common';

/**
 * Returns multiple APOD  for the given date range
 *
 * @param params The params to use for the request
 */
export async function getWithCount(
  params: GetWithCountParams
): Promise<ApodResponse[]> {
  const { count, thumbs } = params;
  const url = new URL('https://api.nasa.gov/planetary/apod');
  url.searchParams.append('api_key', API_KEY);
  url.searchParams.append('count', '' + count);

  if (thumbs) url.searchParams.append('thumbs', 'true');

  return fetch(url.toString()).then((res) => res.json());
}
