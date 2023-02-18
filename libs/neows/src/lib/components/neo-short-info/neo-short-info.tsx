import {
  ArrowTopRightOnSquareIcon,
  BookOpenIcon,
  ChartBarIcon,
} from '@heroicons/react/24/solid';
import { Button } from 'flowbite-react';
import { memo, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { LookupResponse } from '../../models';

export interface NeoShortInfoProps {
  /**
   * A single NEO response.
   */
  neo: LookupResponse;
  /**
   * If the NEO is bookmarked.
   */
  isBookmarked?: boolean;
  /**
   * Callback that is called when the user clicks on the bookmark.
   * The value is the new bookmarked state.
   */
  bookmarkedChanged?: (bookmarked: boolean) => void;

  /**
   * If we are to hide the links to the JPL page and the details stats page.
   */
  noLinks?: boolean;
}

/**
 * Short info about a single NEO object. This is a "dumb" component that only displays
 * the given information as-is.
 *
 * Previous version:
 * https://github.com/bradtaniguchi/chrome-neo/blob/master/app/components/interesting-neo/interesting-neo.view.html
 *
 * Need to show the following properties:
 * - name/title
 * - ref ID
 * - if its dangerous
 * - next pass time
 * - pass distance
 * - link to JPL page
 *
 * Add a "help" for each property.
 *
 * @param props the props for the component.
 */
export const NeoShortInfo = memo(function NeoShortInfo(
  props: NeoShortInfoProps
) {
  const { neo, isBookmarked, bookmarkedChanged, noLinks } = props;

  const passDistance = neo?.close_approach_data?.[0]?.miss_distance?.kilometers;

  /**
   * Handle the on-bookmark click event.
   */
  const handleOnBookmark = () => {
    if (typeof bookmarkedChanged === 'function')
      bookmarkedChanged(!isBookmarked);
  };

  /**
   * The trimmed-pass-distance is calculated based on the kilometers pass distance
   * of the next close approach.
   */
  const trimmedPassDistance = useMemo(() => {
    const num = Number(passDistance);
    if (!isNaN(num)) return Math.round(num);
    if (typeof num === 'number') return num;
    return 0;
  }, [passDistance]);

  if (!neo) return null;

  return (
    <div>
      <div className="flex flex-row justify-between">
        <h1 className="text-lg">{neo.name}</h1>
        <div>
          <Button
            pill={true}
            outline={!isBookmarked}
            onClick={handleOnBookmark}
          >
            <BookOpenIcon className="w-4" />
          </Button>
        </div>
      </div>
      <ul>
        <li className="flex flex-row justify-between">
          <div>Neo Ref ID</div>
          <div>{neo.neo_reference_id}</div>
        </li>
        <li className="flex flex-row justify-between">
          <div>Dangerous</div>
          {/* Change to chip color? */}
          <div className="font-bold">
            {neo.is_potentially_hazardous_asteroid ? 'Yes' : 'No'}
          </div>
        </li>
        <li className="flex flex-row justify-between">
          <div>Next Pass:</div>
          <div>{neo.close_approach_data[0].close_approach_date}</div>
        </li>
        <li className="flex flex-row justify-between">
          {/* TODO: change based on global values */}
          <div>Pass Distance (km)</div>
          <div title={passDistance.toLocaleString()}>
            {trimmedPassDistance.toLocaleString()}
          </div>
        </li>
        {noLinks ? null : (
          <li className="flex flex-row justify-end gap-2">
            <Link to={`/neo/${neo.id}`} className="flex flex-row gap-1">
              <ChartBarIcon className="w-4" />
              <div>detailed stats</div>
            </Link>
            <a
              href={neo.nasa_jpl_url}
              target="_blank"
              rel="noreferrer"
              className="flex flex-row gap-1"
            >
              <ArrowTopRightOnSquareIcon className="w-4" />
              <div>JPL Link</div>
            </a>
          </li>
        )}
      </ul>
    </div>
  );
});
