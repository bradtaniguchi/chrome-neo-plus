import { getToday } from '@chrome-neo-plus/common';
import { Card, Spinner } from 'flowbite-react';
import { Chart } from 'react-charts';
import { useParams } from 'react-router-dom';
import { useViewDaily } from './use-view-daily';

export interface ViewDailyProps {
  /**
   * The day we are to display for. All metrics will be relative
   * to this day.
   *
   * Should be in format yyyy-MM-dd
   */
  date?: string;
}
/**
 * Page that shows the daily NEOs.
 *
 * Page should be split in half, the top is the chart display.
 *
 * The bottom is the list of NEOs and high level data.
 *
 * @param props The props for the view daily page.
 */
export function ViewDaily(props: ViewDailyProps) {
  const { date: propsDate } = props;
  const { date: paramsDate } = useParams();
  const {
    error,
    loading,
    neosResponse,
    chartData,
    primaryAxis,
    secondaryAxes,
  } = useViewDaily({ date: propsDate ?? paramsDate ?? getToday() });

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
      <div
        style={{
          width: '400px',
          height: '300px',
        }}
      >
        <Chart
          options={{
            data: chartData,
            primaryAxis,
            secondaryAxes,
          }}
        />
      </div>
    </div>
  );
}
