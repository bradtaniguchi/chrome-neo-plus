import { useHasMounted } from '@chrome-neo-plus/common-react';
import { useEffect, useState } from 'react';
import { FeedResponse } from '../models';
import {
  getDailyNeowsFeed,
  getMonthlyNeowsFeed,
  getThisWeekNeowsFeed,
  neowsCache,
} from '../utils';

/**
 * The types of requests supported for the useNeos hook.
 */
export type UseNeosRequestType = 'daily' | 'weekly' | 'monthly';

/**
 * Custom hook that loads data for different NEO scenarios.
 *
 * @param params The params to use for the request
 * @param params.requestType The type of request to make, should be
 * one of the types in the UseNeosRequestType type.
 * @param params.date The date to use for the request, if applicable. Otherwise
 * defaults to today
 */
export function useNeos(params: {
  requestType: UseNeosRequestType;
  date?: string;
}) {
  const { requestType, date } = params;
  const mounted = useHasMounted();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<unknown>();
  const [neosResponse, setNeosResponse] = useState<FeedResponse>();

  /**
   * Load the cache on mount automatically.
   */
  useEffect(() => {
    if (mounted) neowsCache.loadFromCache();
  }, [mounted]);

  useEffect(() => {
    if (mounted) {
      setLoading(true);
      (() => {
        if (requestType === 'daily')
          return getDailyNeowsFeed({
            date,
          });
        if (requestType === 'weekly')
          return getThisWeekNeowsFeed({
            date,
          });
        if (requestType === 'monthly')
          return getMonthlyNeowsFeed({
            date,
          });
        return Promise.reject(new Error('Unknown request type provided'));
      })()
        .then((res) => setNeosResponse(res))
        .catch(setError)
        .finally(() => setLoading(false));
    }
  }, [mounted, requestType, date]);

  return {
    /**
     * If the data is being loaded
     */
    loading,
    /**
     * If there was an error loading the data
     */
    error,
    /**
     * The response from the NEO API
     */
    neosResponse,
  };
}
