import { memo, useMemo } from 'react';
import { NeowsResponse } from '../../models';

export interface NeoShortInfoProps {
  /**
   * A single NEO response.
   */
  neo: NeowsResponse;
  /**
   * Bookmark component that is shown to the right of the title.
   */
  bookmark?: JSX.Element;
  /**
   * Footer component that is shown at the bottom of this component,
   * could show links
   */
  footer?: JSX.Element;
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
  const { neo, bookmark, footer } = props;

  const passDistance = neo?.close_approach_data?.[0]?.miss_distance?.kilometers;

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
        {bookmark ? <div>{bookmark}</div> : null}
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
        {footer}
      </ul>
    </div>
  );
});
