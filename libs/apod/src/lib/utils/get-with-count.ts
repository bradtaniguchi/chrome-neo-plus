import { ApodResponse } from '../models/apod-response';
import { GetWithCountParams } from '../models/apod-request-params';
import { getApiConfig } from '@chrome-neo-plus/common';
import { apodCache } from './apod-cache';

/**
 * Returns multiple "random" APOD for the given date range.
 *
 * Does not use caching, but will save the results to the cache.
 *
 * @param params The params to use for the request
 */
export async function getWithCount(
  params: GetWithCountParams
): Promise<ApodResponse[]> {
  const { count, thumbs } = params;
  const url = new URL('https://api.nasa.gov/planetary/apod');
  const { apiKey } = await getApiConfig();
  url.searchParams.append('api_key', apiKey);
  url.searchParams.append('count', '' + count);

  if (thumbs) url.searchParams.append('thumbs', 'true');

  return fetch(url.toString())
    .then((res) => {
      if (res.ok) return res.json();
      throw new Error(res.statusText);
    })
    .then((data) => {
      if (Array.isArray(data)) return data;
      throw new Error(data.msg);
    })
    .then((res) => {
      apodCache.setMany(res);
      return res;
    });
}
