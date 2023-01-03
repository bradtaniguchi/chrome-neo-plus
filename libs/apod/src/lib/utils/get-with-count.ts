import { ApodResponse } from '../models/apod-response';
import { GetWithCountParams } from '../models/apod-request-params';

/**
 * Returns multiple APOD  for the given date range
 *
 * @param params
 */
export async function getWithCount(
  params: GetWithCountParams
): Promise<ApodResponse[]> {
  // return getApod(params).then(({ data }) => data);
  return Promise.resolve({}) as any;
}
