import { ApodResponse } from '../models/apod-response';
import { GetWithStartAndEndDatesParams } from '../models/apod-request-params';
import { API_KEY } from '@chrome-neo-plus/common';

/**
 * Returns the APOD data for the given date-range.
 *
 * **Warning** try to not to provide a range too large, as
 * this slows down underlying API dramatically.
 *
 * @param params The params to use for the request
 */
export async function getWithStartAndEndDates(
  params: GetWithStartAndEndDatesParams
): Promise<ApodResponse[]> {
  const { start_date, end_date, thumbs } = params;
  const url = new URL('https://api.nasa.gov/planetary/apod');
  url.searchParams.append('api_key', API_KEY);
  url.searchParams.append('start_date', start_date);

  if (end_date) url.searchParams.append('end_date', end_date);
  if (thumbs) url.searchParams.append('thumbs', 'true');

  return fetch(url.toString())
    .then((res) => res.json())
    .then((data) => {
      if (Array.isArray(data)) return data;
      console.log({ data });
      throw new Error(data.msg);
    });
}
