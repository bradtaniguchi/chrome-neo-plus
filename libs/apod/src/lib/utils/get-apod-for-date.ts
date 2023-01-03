import { ApodResponse } from '../models/apod-response';
import { GetWithDateParams } from '../models/apod-request-params';

/**
 * Returns the APOD data for the given date.
 *
 * @param params The params to use for the request
 */
export async function getApodForDate(
  params: GetWithDateParams
): Promise<ApodResponse> {
  // TODO: Make this call the API
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return Promise.resolve({}) as any;
}
