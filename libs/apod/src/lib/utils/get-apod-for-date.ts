import { ApodResponse } from '../models/apod-response';
import { GetWithDateParams } from '../models/apod-request-params';

/**
 * Returns the APOD data for the given date.
 *
 * @param params
 */
export async function getApodForDate(
  params: GetWithDateParams
): Promise<ApodResponse> {
  return Promise.resolve({}) as any;
}
