import { DATE_FORMAT, getToday } from '@chrome-neo-plus/common';
import { Card, Spinner, Table, Button } from 'flowbite-react';
import { Chart } from 'react-charts';
import { useParams, Link } from 'react-router-dom';
import { useViewMonthly } from './use-view-monthly';
import { useMemo, useState } from 'react';
import { DateTime } from 'luxon';
import { getWeeklyBlocks } from '../../utils/get-weekly-blocks';
import { ChevronLeftIcon, ChevronRightIcon, ArrowLeftIcon } from '@heroicons/react/24/solid';

export interface ViewMonthlyProps {
  /**
   * The date to display metrics for.
   *
   * Should be in format yyyy-MM-dd
   */
  date?: string;
}

/**
 * Component that displays the monthly overview of Near Earth Objects.
 *
 * @param props The props for the ViewMonthly component.
 */
export function ViewMonthly(props: ViewMonthlyProps) {
  const { date: propsDate } = props;
  const { date: paramsDate } = useParams();

  const initialDate = propsDate ?? paramsDate ?? getToday();
  const [currentDate, setCurrentDate] = useState<string>(initialDate);

  const {
    error,
    loading,
    neosResponse,
    chartData,
    primaryAxis,
    secondaryAxes,
  } = useViewMonthly({ date: currentDate });

  const currentDateTime = useMemo(() => {
    return DateTime.fromISO(currentDate);
  }, [currentDate]);

  const handlePrevMonth = () => {
    setCurrentDate(
      currentDateTime.minus({ months: 1 }).startOf('month').toFormat(DATE_FORMAT)
    );
  };

  const handleNextMonth = () => {
    setCurrentDate(
      currentDateTime.plus({ months: 1 }).startOf('month').toFormat(DATE_FORMAT)
    );
  };

  const handleResetToToday = () => {
    setCurrentDate(getToday());
  };

  // 1. Calculate Weekly Summary
  const weeklySummary = useMemo(() => {
    if (!neosResponse || !currentDate) return [];

    const startOfMonth = currentDateTime.startOf('month');
    const blocks = getWeeklyBlocks(startOfMonth);

    return blocks.map((block) => {
      const startStr = block.start_date.toFormat(DATE_FORMAT);
      const endStr = block.end_date.toFormat(DATE_FORMAT);

      let count = 0;
      Object.entries(neosResponse.near_earth_objects).forEach(([dateKey, neos]) => {
        const d = DateTime.fromISO(dateKey);
        if (d >= block.start_date.startOf('day') && d <= block.end_date.endOf('day')) {
          count += neos.length;
        }
      });

      return {
        start: startStr,
        end: endStr,
        count,
        link: `/neows/weekly/${startStr}`,
      };
    });
  }, [neosResponse, currentDateTime, currentDate]);

  // 2. Calculate Daily Summary
  const dailySummary = useMemo(() => {
    if (!neosResponse || !currentDate) return [];

    const startOfMonth = currentDateTime.startOf('month');
    const daysInMonth = startOfMonth.daysInMonth ?? 30;
    const summaries = [];

    for (let i = 0; i < daysInMonth; i++) {
      const currentDay = startOfMonth.plus({ days: i });
      const dateStr = currentDay.toFormat(DATE_FORMAT);
      const count = neosResponse.near_earth_objects[dateStr]?.length ?? 0;

      summaries.push({
        date: dateStr,
        dayLabel: currentDay.toFormat('LLL dd'),
        count,
        link: `/neows/daily/${dateStr}`,
      });
    }

    return summaries;
  }, [neosResponse, currentDateTime, currentDate]);

  // 3. Calculate Aggregate Summary
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
          <Button size="xs" onClick={handlePrevMonth} color="gray">
            <ChevronLeftIcon className="w-4 h-4" />
          </Button>
          <h2 className="text-xl font-bold">
            {currentDateTime.toFormat('LLLL yyyy')}
          </h2>
          <Button size="xs" onClick={handleNextMonth} color="gray">
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
            Monthly Near Earth Objects Frequency
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

      {/* Weekly Summary Period List */}
      <Card className="dark:bg-slate-800">
        <div>
          <h3 className="text-lg font-bold mb-2">Weekly Periods</h3>
          <div className="overflow-x-auto">
            <Table hoverable>
              <Table.Head>
                <Table.HeadCell>Period</Table.HeadCell>
                <Table.HeadCell>NEO Count</Table.HeadCell>
                <Table.HeadCell>Actions</Table.HeadCell>
              </Table.Head>
              <Table.Body className="divide-y">
                {weeklySummary.map((week, idx) => (
                  <Table.Row key={idx} className="bg-white dark:border-gray-700 dark:bg-slate-800">
                    <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                      {`${week.start} to ${week.end}`}
                    </Table.Cell>
                    <Table.Cell>{`${week.count}`}</Table.Cell>
                    <Table.Cell>
                      <Link to={week.link} className="font-semibold text-blue-600 dark:text-blue-500 hover:underline">
                        View Week
                      </Link>
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
          </div>
        </div>
      </Card>

      {/* Daily list scrollable container */}
      <Card className="dark:bg-slate-800">
        <div>
          <h3 className="text-lg font-bold mb-2">Daily Breakdown</h3>
          <div className="max-h-72 overflow-y-auto border border-gray-200 dark:border-gray-700 rounded-lg">
            <Table hoverable>
              <Table.Head className="sticky top-0 bg-gray-50 dark:bg-slate-700">
                <Table.HeadCell>Date</Table.HeadCell>
                <Table.HeadCell>NEO Count</Table.HeadCell>
                <Table.HeadCell>Actions</Table.HeadCell>
              </Table.Head>
              <Table.Body className="divide-y">
                {dailySummary.map((day, idx) => (
                  <Table.Row key={idx} className="bg-white dark:border-gray-700 dark:bg-slate-800">
                    <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                      {`${day.dayLabel} (${day.date})`}
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
