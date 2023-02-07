import { useHasMounted } from '@chrome-neo-plus/common-react';
import { useCallback, useEffect, useState } from 'react';
import { LookupResponse } from '../models';

export const NEOWS_BOOKMARKS_KEY = 'NEOWS_BOOKMARKS';

/**
 *
 * @param params The params to use for the hook
 * @param params.neo The NEO to use for the hook
 * @param params.isBookmarked Whether or not the NEO is bookmarked. This is
 * optional, and if not provided, the hook will attempt to load the bookmarked
 * state from localStorage.
 */
export function useNeoBookmark(params: {
  neo?: LookupResponse;
  isBookmarked?: boolean;
}) {
  const { neo } = params;

  const neoId = neo?.id;

  const mounted = useHasMounted();
  const [isBookmarked, setIsBookmarked] = useState(
    params.isBookmarked ?? false
  );

  const handleToggleBookmark = useCallback(() => {
    setIsBookmarked((prev) => !prev);
  }, []);

  const getCurrentBookmarks = () => {
    const rawData =
      JSON.parse(localStorage.getItem(NEOWS_BOOKMARKS_KEY) ?? '[]') ?? [];
    const currentBookmarks: string[] = Array.isArray(rawData)
      ? rawData.filter((el) => typeof el === 'string')
      : [];
    return currentBookmarks;
  };

  useEffect(() => {
    if (mounted && neoId) {
      const currentBookmarks = getCurrentBookmarks();
      setIsBookmarked(currentBookmarks.includes(neoId ?? ''));
    }
  }, [mounted, neoId]);

  useEffect(() => {
    if (mounted && neoId) {
      const currentBookmarks = getCurrentBookmarks();

      if (isBookmarked) {
        localStorage.setItem(
          NEOWS_BOOKMARKS_KEY,
          JSON.stringify([
            // filter again to prevent any duplicates
            ...currentBookmarks.filter(
              (bookmarkedId) => bookmarkedId !== neoId
            ),
            // add it again at the end.
            neoId,
          ])
        );
      } else {
        localStorage.setItem(
          NEOWS_BOOKMARKS_KEY,
          JSON.stringify(
            currentBookmarks.filter((bookmarkedId) => bookmarkedId !== neoId)
          )
        );
      }
    }
  }, [neoId, isBookmarked, mounted]);

  return {
    /**
     * Whether or not the NEO is bookmarked.
     */
    isBookmarked,
    /**
     * Toggles the bookmark state for the given NEO
     */
    handleToggleBookmark,
    // TODO: return all the bookmarked neos
  };
}
