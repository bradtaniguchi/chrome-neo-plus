import { ApodResponse } from '../models/apod-response';
import {
  GetWithCountParams,
  GetWithDateParams,
  GetWithStartAndEndDatesParams,
  isGetWithCount,
  isGetWithDate,
  isGetWithStartAndEndDates,
} from '../models/apod-request-params';
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
 *
 * @param params The params to use for the request
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

/**
 * Custom hook that manages all the different types of apod API HTTP requests.
 *
 * @param params The params to use for the request
 */
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
        .catch((err) => {
          // eslint-disable-next-line no-debugger
          debugger;
          setError(err);
        })
        .finally(() => setLoading(false));
      mounted = true;
    }
  }, [params]);

  return { loading, error, apodResponse };
}
