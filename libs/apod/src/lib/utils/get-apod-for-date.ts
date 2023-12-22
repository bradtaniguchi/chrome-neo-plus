import { ApodResponse } from '../models/apod-response';
import { GetWithDateParams } from '../models/apod-request-params';
import { getApiConfig } from '@chrome-neo-plus/common';
import { apodCache } from './apod-cache';

/**
 * Returns the APOD data for the given date.
 *
 * @param params The params to use for the request
 */
export async function getApodForDate(
  params: GetWithDateParams & { noCache?: boolean }
): Promise<ApodResponse | undefined> {
  const { date, thumbs, noCache } = params;
  const url = new URL('https://api.nasa.gov/planetary/apod');
  const { apiKey } = await getApiConfig();

  url.searchParams.append('api_key', apiKey);
  url.searchParams.append('date', date);

  if (thumbs) url.searchParams.append('thumbs', 'true');

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  if (apodCache.has(date) && !noCache) return apodCache.get(date)!;

  const res = await fetch(url.toString()).then((res) => {
    if (res.ok) return res.json();
    throw new Error(res.statusText);
  });

  apodCache.set(res.date, res);

  return res;
}
