import { Card } from 'flowbite-react';
import { useMemo } from 'react';
import { useNeoBookmark } from '../../hooks/use-neo-bookmark';
import { useNeos } from '../../hooks/use-neos';
import { getBestNeo } from '../../utils';
import { NeoShortInfo } from '../neo-short-info/neo-short-info';
import { NeoShortInfoBookmark } from '../neo-short-info/neo-short-info-bookmark';
import { NeoShortInfoLinks } from '../neo-short-info/neo-short-info-links';

export interface BestNeoProps {
  /**
   * The day we are to display for. All metrics will be relative to this date.
   */
  date?: string;
  /**
   * The range we are to display the "best" for. Defaults to "week"
   */
  bestRange?: 'daily' | 'weekly' | 'monthly';
}

/**
 * The best NEO component is a high level component that displays the NeoShortInfo
 * for a single NEO, that is considered "the best" for the app.
 *
 * I internally uses `useNeos` to get the cached or loaded data automatically.
 *
 * @param props The props for the best NEO component.
 */
export function BestNeo(props: BestNeoProps) {
  const { date, bestRange } = props;
  const { neosResponse } = useNeos({
    requestType: bestRange ?? 'weekly',
    date,
  });

  const neosObject = neosResponse?.near_earth_objects;

  const bestNeo = useMemo(
    () => getBestNeo(Object.values(neosObject ?? {}).flat()) ?? undefined,
    [neosObject]
  );

  const { isBookmarked, handleToggleBookmark } = useNeoBookmark({
    neo: bestNeo,
  });

  if (!bestNeo)
    // if there is
    return null;

  return (
    <Card className="dark:bg-slate-800 dark:text-white">
      <NeoShortInfo
        neo={bestNeo}
        bookmark={
          <NeoShortInfoBookmark
            bookmarkedChanged={handleToggleBookmark}
            isBookmarked={isBookmarked}
          />
        }
        footer={<NeoShortInfoLinks neo={bestNeo} />}
      />
    </Card>
  );
}
