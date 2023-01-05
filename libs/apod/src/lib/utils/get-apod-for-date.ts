import { ApodResponse } from '../models/apod-response';
import { GetWithDateParams } from '../models/apod-request-params';
import { API_KEY } from '@chrome-neo-plus/common';

/**
 * Returns the APOD data for the given date.
 *
 * @param params The params to use for the request
 */
export async function getApodForDate(
  params: GetWithDateParams
): Promise<ApodResponse> {
  const { date, thumbs } = params;
  const url = new URL('https://api.nasa.gov/planetary/apod');
  url.searchParams.append('api_key', API_KEY);
  url.searchParams.append('date', date);

  if (thumbs) url.searchParams.append('thumbs', 'true');

  return fetch(url.toString()).then((res) => res.json());
}
