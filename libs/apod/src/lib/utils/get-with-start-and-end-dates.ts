import { ApodResponse } from '../models/apod-response';
import { GetWithStartAndEndDatesParams } from '../models/apod-request-params';
import { API_KEY } from '@chrome-neo-plus/common';
import { apodCache } from './apod-cache';
import { DateTime } from 'luxon';

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

  url.searchParams.append(
    'end_date',
    end_date ?? DateTime.now().toFormat('yyyy-MM-dd')
  );
  if (thumbs) url.searchParams.append('thumbs', 'true');

  const preExistingRange = apodCache.getRange(
    start_date,
    end_date ?? DateTime.now().toFormat('yyyy-MM-dd')
  );

  // if we already have this range, return it directly.
  if (!preExistingRange.hasGaps)
    return preExistingRange.apods as ApodResponse[];

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
