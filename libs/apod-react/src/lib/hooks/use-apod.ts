import {
  ApodResponse,
  GetWithCountParams,
  GetWithDateParams,
  GetWithStartAndEndDatesParams,
  isGetWithCount,
  isGetWithDate,
  isGetWithStartAndEndDates,
} from '@chrome-neo-plus/apod-common';
import { useEffect, useState } from 'react';
import {
  getApodForDate,
  getWithCount,
  getWithStartAndEndDates,
} from '../utils';

export type UseApodBaseRes = {
  /**
   * If the request is loading
   */
  loading: boolean;
  /**
   * If there was an error fetching the data
   */
  error?: unknown;
};
/**
 * Hook that can be used to interact with the APOD API.
 *
 * Currently directly requests the api_key, but this will be removed
 * in favor of an API call in the future.
 * @unstable
 */
export function useApod(params: GetWithDateParams): UseApodBaseRes & {
  apodResponse?: ApodResponse;
};
export function useApod(params: GetWithCountParams): UseApodBaseRes & {
  apodResponse?: ApodResponse[];
};
export function useApod(
  params: GetWithStartAndEndDatesParams
): UseApodBaseRes & {
  apodResponse?: ApodResponse[];
};
export function useApod(params: object): unknown {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<unknown>();
  const [apodResponse, setApodResponse] = useState<unknown>();

  useEffect(() => {
    let mounted = false;

    if (!mounted) {
      setLoading(true);
      (() => {
        if (isGetWithDate(params)) return getApodForDate(params);
        if (isGetWithStartAndEndDates(params))
          return getWithStartAndEndDates(params);
        if (isGetWithCount(params)) return getWithCount(params);
        return Promise.reject(new Error('Unknown params provided'));
      })()
        .then((res) => setApodResponse(res))
        .catch((err) => setError(err))
        .finally(() => setLoading(false));
      mounted = true;
    }
  }, [params]);

  return { loading, error, apodResponse };
}
