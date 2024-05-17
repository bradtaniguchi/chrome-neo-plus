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

  // TODO: improve layout
  return (
    <div>
      <h1>Detailed Stats</h1>
      <table>
        <tbody>
          <tr>
            <td>Name</td>
            <td>{neo.name}</td>
          </tr>

          <tr>
            <td>Estimated Diameter</td>
            <td>{neo.estimated_diameter.meters.estimated_diameter_max}</td>
          </tr>

          <tr>
            <td>Is Dangerous</td>
            <td>{neo.is_potentially_hazardous_asteroid}</td>
          </tr>

          {nextCloseApproach ? (
            <>
              <tr>
                <td>Close Approach Date</td>
                <td>{nextCloseApproach.close_approach_date}</td>
              </tr>

              <tr>
                <td>Miss Distance</td>
                {/* TODO: update to a setting */}
                <td>{nextCloseApproach.miss_distance.kilometers} km</td>
              </tr>

              <tr>
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
    </div>
  );
}
