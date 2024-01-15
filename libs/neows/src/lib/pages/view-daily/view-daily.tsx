import { Card, Spinner } from 'flowbite-react';
import { useViewDaily } from './use-view-daily';
import { AxisOptions, Chart, Series } from 'react-charts';
import { LookupResponse } from '../../models';

/**
 * Page that shows the daily NEOs.
 *
 * Page should be split in half, the top is the chart display.
 *
 * The bottom is the list of NEOs and high level data.
 */
export function ViewDaily() {
  const {
    error,
    loading,
    neosResponse,
    chartData,
    primaryAxis,
    secondaryAxes,
  } = useViewDaily();

  if (loading) {
    return (
      <Card className="flex max-w-3xl flex-col items-center justify-center dark:bg-slate-800 dark:text-white">
        <Spinner color="info" aria-label="Info spinner example" />
      </Card>
    );
  }

  if (error) {
    // TODO: improve
    return <div>Error: {(error as Error).message}</div>;
  }

  if (!neosResponse) {
    // TODO: update
    return <div>No NEOs found</div>;
  }

  // TODO: add chart here
  // TODO: add table of all the NEOs here
  return (
    <div>
      <h1>View Daily</h1>
      {/* <pre>{JSON.stringify(dailyResponse, null, 2)}</pre> */}
      <Chart
        options={{
          data: chartData,
          primaryAxis,
          secondaryAxes,
        }}
      />
    </div>
  );
}
