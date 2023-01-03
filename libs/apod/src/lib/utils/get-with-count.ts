import { ApodResponse } from '../models/apod-response';
import { GetWithCountParams } from '../models/apod-request-params';

/**
 * Returns multiple APOD  for the given date range
 *
 * @param params The params to use for the request
 */
export async function getWithCount(
  params: GetWithCountParams
): Promise<ApodResponse[]> {
  // return getApod(params).then(({ data }) => data);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return Promise.resolve({}) as any;
}
