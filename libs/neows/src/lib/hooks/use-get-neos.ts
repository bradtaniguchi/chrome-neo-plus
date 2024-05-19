import { useHasMounted } from '@chrome-neo-plus/common-react';
import { useEffect, useState } from 'react';
import { NeowsResponse } from '../models/neows-response';
import { getNeows } from '../utils/get-neows';
import { neowsCache } from '../utils/neows-cache';

/**
 * Custom hook that returns detailed information for a
 * for a given NEO from the NEOWs API.
 *
 * @param params the search param requests
 * @param params.asteroid_id the asteroid id to search for
 * the Asteroid SPK-ID that correlates to the NASA JPL small body. If nothing is given
 * this will return nothing automatically.
 * @param params.noCache whether to skip the cache
 */
export function useGetNeos(params: {
  asteroid_id?: string;
  noCache?: boolean;
}) {
  const { asteroid_id, noCache } = params;
  const mounted = useHasMounted();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<unknown>();
  const [neoResponse, setNeoResponse] = useState<NeowsResponse>();

  /**
   * Load the cache on mount automatically.
   */
  useEffect(() => {
    if (mounted) neowsCache.loadFromCache();
  }, [mounted]);

  useEffect(() => {
    if (mounted) {
      setLoading(true);

      if (!asteroid_id) {
        // if nothing is given then return nothing.
        setLoading(false);
        return;
      }

      getNeows({
        asteroid_id,
        noCache,
      })
        .then(setNeoResponse)
        .catch(setError)
        .finally(() => setLoading(false));
    }
  }, [asteroid_id, mounted, noCache]);

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
     * The response from the API
     */
    neoResponse,
  };
}
