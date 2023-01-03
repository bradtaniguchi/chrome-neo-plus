import { ApodResponse } from '../models/apod-response';
import { GetWithStartAndEndDatesParams } from '../models/apod-request-params';

/**
 * Returns the APOD data for the given date-range.
 *
 * **Warning** try to not to provide a range too large, as
 * this slows down underlying API dramatically.
 *
 * @param params
 */
export async function getWithStartAndEndDates(
  params: GetWithStartAndEndDatesParams
): Promise<ApodResponse[]> {
  // return getApod(params).then(({ data }) => data);
  return Promise.resolve({} as any);
}
