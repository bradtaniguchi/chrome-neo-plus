import { DATE_FORMAT, getToday } from '@chrome-neo-plus/common';
import { Card, Spinner, Table, Button } from 'flowbite-react';
import { Chart } from 'react-charts';
import { useParams, Link } from 'react-router-dom';
import { useViewWeekly } from './use-view-weekly';
import { useMemo, useState } from 'react';
import { DateTime } from 'luxon';
import { ChevronLeftIcon, ChevronRightIcon, ArrowLeftIcon } from '@heroicons/react/24/solid';

export interface ViewWeeklyProps {
  /**
   * The day we are to display for. All metrics will be relative
   * to this day.
   *
   * Should be in format yyyy-MM-dd
   */
  date?: string;
}

/**
 * Page that shows the weekly NEOs.
 * Displays a frequency chart for the week, high-level metrics, and a daily list breakdown.
 *
 * @param props The props for the view weekly page.
 */
export function ViewWeekly(props: ViewWeeklyProps) {
  const { date: propsDate } = props;
  const { date: paramsDate } = useParams();

  const initialDate = propsDate ?? paramsDate ?? getToday();
  const [currentDate, setCurrentDate] = useState<string>(initialDate);

  const {
    error,
    loading,
    neosResponse,
    dailyResponse,
    chartData,
    primaryAxis,
    secondaryAxes,
  } = useViewWeekly({ date: currentDate });

  const currentDateTime = useMemo(() => {
    return DateTime.fromISO(currentDate);
  }, [currentDate]);

  const handlePrevWeek = () => {
    setCurrentDate(
      currentDateTime.minus({ weeks: 1 }).startOf('week').toFormat(DATE_FORMAT)
    );
  };

  const handleNextWeek = () => {
    setCurrentDate(
      currentDateTime.plus({ weeks: 1 }).startOf('week').toFormat(DATE_FORMAT)
    );
  };

  const handleResetToToday = () => {
    setCurrentDate(getToday());
  };

  // Calculate Aggregate Summary for the current week
  const aggregateSummary = useMemo(() => {
    if (!neosResponse) return null;

    const allNeos = Object.values(neosResponse.near_earth_objects).flat();
    const totalCount = allNeos.length;

    const hazardousCount = allNeos.filter(
      (neo) => neo.is_potentially_hazardous_asteroid
    ).length;

    const hazardousPercentage =
      totalCount > 0 ? ((hazardousCount / totalCount) * 100).toFixed(1) : '0.0';

    let closestKm = Infinity;
    let closestNeoName = '';
    let largestMeters = 0;
    let largestNeoName = '';

    allNeos.forEach((neo) => {
      const missDistance = Number(
        neo.close_approach_data[0]?.miss_distance.kilometers ?? Infinity
      );
      if (missDistance < closestKm) {
        closestKm = missDistance;
        closestNeoName = neo.name;
      }

      const maxDiameter =
        neo.estimated_diameter.meters.estimated_diameter_max;
      if (maxDiameter > largestMeters) {
        largestMeters = maxDiameter;
        largestNeoName = neo.name;
      }
    });

    return {
      totalCount,
      hazardousCount,
      hazardousPercentage,
      closestKm: closestKm === Infinity ? null : closestKm.toLocaleString(undefined, { maximumFractionDigits: 0 }),
      closestNeoName,
      largestMeters: largestMeters.toLocaleString(undefined, { maximumFractionDigits: 0 }),
      largestNeoName,
    };
  }, [neosResponse]);

  // Format daily breakdowns list for display
  const dailySummary = useMemo(() => {
    if (!dailyResponse) return [];
    return dailyResponse.map(([dayName, dateStr, lookupResponse]) => {
      const parsedDay = DateTime.fromISO(dateStr);
      return {
        dayLabel: dayName.charAt(0).toUpperCase() + dayName.slice(1),
        date: dateStr,
        formattedDate: parsedDay.toFormat('LLL dd'),
        count: lookupResponse?.length ?? 0,
        link: `/neows/daily/${dateStr}`,
      };
    });
  }, [dailyResponse]);

  if (loading) {
    return (
      <Card className="flex max-w-3xl flex-col items-center justify-center dark:bg-slate-800 dark:text-white mx-auto mt-8">
        <Spinner color="info" aria-label="Loading near earth objects..." />
      </Card>
    );
  }

  if (error) {
    return (
      <div className="p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg dark:bg-red-200 dark:text-red-800 max-w-4xl mx-auto mt-8" role="alert">
        <span className="font-bold">Error:</span> {(error as Error).message}
      </div>
    );
  }

  if (!neosResponse) {
    return (
      <div className="p-4 mb-4 text-sm text-yellow-700 bg-yellow-100 rounded-lg dark:bg-yellow-200 dark:text-yellow-800 max-w-4xl mx-auto mt-8" role="alert">
        <span className="font-bold">Warning:</span> No Near Earth Objects data found.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 p-4 max-w-4xl mx-auto dark:text-white">
      {/* Navigation Header */}
      <div className="flex flex-row items-center justify-between gap-2">
        <Link to="/" className="flex items-center gap-1 text-sm text-blue-500 hover:underline">
          <span className="flex items-center gap-1">
            <ArrowLeftIcon className="w-4 h-4" />
            <span>Overview</span>
          </span>
        </Link>
        <div className="flex items-center gap-2">
          <Button size="xs" onClick={handlePrevWeek} color="gray">
            <ChevronLeftIcon className="w-4 h-4" />
          </Button>
          <h2 className="text-xl font-bold text-center">
            {`Week of ${currentDateTime.startOf('week').toFormat('LLL dd, yyyy')}`}
          </h2>
          <Button size="xs" onClick={handleNextWeek} color="gray">
            <ChevronRightIcon className="w-4 h-4" />
          </Button>
        </div>
        <Button size="xs" onClick={handleResetToToday} color="gray">
          Today
        </Button>
      </div>

      {/* Chart Display */}
      <Card className="dark:bg-slate-800">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Weekly Near Earth Objects Frequency
          </h2>
          <div className="w-full h-80 sm:h-96 relative pr-4">
            {chartData && chartData.length > 0 ? (
              <Chart
                options={{
                  data: chartData,
                  primaryAxis,
                  secondaryAxes,
                }}
              />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">
                No chart data available
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* Aggregate Summary */}
      {aggregateSummary && (
        <div className="flex flex-col gap-4">
          <Card className="dark:bg-slate-800">
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider font-semibold">Total NEOs</p>
              <p className="text-2xl font-extrabold">{`${aggregateSummary.totalCount}`}</p>
            </div>
          </Card>
          <Card className="dark:bg-slate-800">
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider font-semibold">Hazardous NEOs</p>
              <p className="text-2xl font-extrabold text-red-500">
                {`${aggregateSummary.hazardousCount} (${aggregateSummary.hazardousPercentage}%)`}
              </p>
            </div>
          </Card>
          <Card className="dark:bg-slate-800">
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider font-semibold">Closest Approach</p>
              <p className="text-md font-bold truncate" title={aggregateSummary.closestNeoName}>{aggregateSummary.closestNeoName || 'N/A'}</p>
              <p className="text-xs text-gray-400">{aggregateSummary.closestKm ? `${aggregateSummary.closestKm} km` : 'N/A'}</p>
            </div>
          </Card>
          <Card className="dark:bg-slate-800">
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider font-semibold">Largest NEO</p>
              <p className="text-md font-bold truncate" title={aggregateSummary.largestNeoName}>{aggregateSummary.largestNeoName || 'N/A'}</p>
              <p className="text-xs text-gray-400">{aggregateSummary.largestMeters ? `${aggregateSummary.largestMeters} m max` : 'N/A'}</p>
            </div>
          </Card>
        </div>
      )}

      {/* Daily Breakdown List */}
      <Card className="dark:bg-slate-800">
        <div>
          <h3 className="text-lg font-bold mb-2">Daily Breakdown</h3>
          <div className="overflow-x-auto">
            <Table hoverable>
              <Table.Head>
                <Table.HeadCell>Day</Table.HeadCell>
                <Table.HeadCell>Date</Table.HeadCell>
                <Table.HeadCell>NEO Count</Table.HeadCell>
                <Table.HeadCell>Actions</Table.HeadCell>
              </Table.Head>
              <Table.Body className="divide-y">
                {dailySummary.map((day, idx) => (
                  <Table.Row key={idx} className="bg-white dark:border-gray-700 dark:bg-slate-800">
                    <Table.Cell className="whitespace-nowrap font-bold text-gray-900 dark:text-white">
                      {day.dayLabel}
                    </Table.Cell>
                    <Table.Cell className="whitespace-nowrap font-medium text-gray-600 dark:text-gray-400">
                      {`${day.formattedDate} (${day.date})`}
                    </Table.Cell>
                    <Table.Cell>
                      <span className={day.count > 0 ? 'font-bold' : 'text-gray-400'}>
                        {`${day.count}`}
                      </span>
                    </Table.Cell>
                    <Table.Cell>
                      <Link to={day.link} className="font-semibold text-blue-600 dark:text-blue-500 hover:underline">
                        View Day
                      </Link>
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
          </div>
        </div>
      </Card>
    </div>
  );
}
