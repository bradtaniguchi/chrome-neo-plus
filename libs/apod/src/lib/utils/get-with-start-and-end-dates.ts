import { ApodResponse } from '../models/apod-response';
import { GetWithStartAndEndDatesParams } from '../models/apod-request-params';

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
  // return getApod(params).then(({ data }) => data);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return Promise.resolve({} as any);
}
