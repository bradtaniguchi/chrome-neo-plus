import { useMemo } from 'react';
import { NeowsResponse } from '../../models';
import { getNextCloseApproach } from '../../utils';

/**
 * Detail stats are shown for each NEO, in a dynamically
 * generated table format.
 *
 * @param props The props for the detailed stats.
 * @param props.neo The NEO to show detailed stats for.
 */
export function DetailedStats(props: { neo: NeowsResponse }) {
  const { neo } = props;

  const nextCloseApproach = useMemo(() => {
    return getNextCloseApproach({
      closeApproaches: neo.close_approach_data,
    });
  }, [neo]);

  return (
    <table className="w-full">
      <tbody>
        <tr className="row-auto flex justify-between">
          <td>Name</td>
          <td>{neo.name}</td>
        </tr>

        <tr className="row-auto flex justify-between">
          <td>Estimated Diameter</td>
          <td>{neo.estimated_diameter.meters.estimated_diameter_max}</td>
        </tr>

        <tr className="row-auto flex justify-between">
          <td>Is Dangerous</td>
          <td>{neo.is_potentially_hazardous_asteroid ? 'yes' : 'no'}</td>
        </tr>

        {nextCloseApproach ? (
          <>
            <tr className="row-auto flex justify-between">
              <td>Close Approach Date</td>
              <td>{nextCloseApproach.close_approach_date}</td>
            </tr>

            <tr className="row-auto flex justify-between">
              <td>Miss Distance</td>
              {/* TODO: update to a setting */}
              <td>{nextCloseApproach.miss_distance.kilometers} km</td>
            </tr>

            <tr className="row-auto flex justify-between">
              <td>Relative Velocity</td>
              <td>
                {/* TODO: update to a setting */}
                {/* TODO: add  */}
                {nextCloseApproach.relative_velocity.kilometers_per_hour} km/h
              </td>
            </tr>
          </>
        ) : null}
      </tbody>
    </table>
  );
}
