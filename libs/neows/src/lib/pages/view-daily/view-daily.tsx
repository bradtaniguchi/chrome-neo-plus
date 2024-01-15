import { getToday } from '@chrome-neo-plus/common';
import { Card, Dropdown, Spinner } from 'flowbite-react';
import { Chart } from 'react-charts';
import { useParams } from 'react-router-dom';
import { useViewDaily } from './use-view-daily';
import { useState } from 'react';

export interface ViewDailyProps {
  /**
   * The day we are to display for. All metrics will be relative
   * to this day.
   *
   * Should be in format yyyy-MM-dd
   */
  date?: string;
  /**
   * The mode to display the data in, defaults to size
   *
   * TODO: I think the old version also had "danger"?
   *
   * Maybe also do this alphabetically.
   */
  mode?: 'size' | 'distance';
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
  const { date: propsDate, mode: propsMode } = props;
  const { date: paramsDate, mode: paramsMode } = useParams();

  const [stateMode, setStateMode] = useState<'size' | 'distance' | undefined>(
    'size'
  );

  const date = propsDate ?? paramsDate ?? getToday();

  const mode =
    stateMode ??
    propsMode ??
    (paramsMode && ['size', 'distance'].includes(paramsMode)
      ? (paramsMode as 'size' | 'distance')
      : 'size');

  const {
    error,
    loading,
    neosResponse,
    chartData,
    primaryAxis,
    secondaryAxes,
  } = useViewDaily({
    date,
    mode,
  });

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
      <h1>View Daily ({date})</h1>
      <div>
        <Dropdown
          label={(() => {
            if (mode === 'distance') {
              return 'View by Distance';
            }
            if (mode === 'size') {
              return 'View by Size';
            }
            return 'View by';
          })()}
        >
          <Dropdown.Item
            onClick={() => {
              setStateMode('size');
            }}
          >
            View by Size
          </Dropdown.Item>
          <Dropdown.Item
            onClick={() => {
              setStateMode('distance');
            }}
          >
            View by Distance
          </Dropdown.Item>
        </Dropdown>
      </div>
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
