import { DATE_FORMAT, getToday } from '@chrome-neo-plus/common';
import { Card, Spinner, Table, Button, Badge, Dropdown } from 'flowbite-react';
import { Chart } from 'react-charts';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useNeoDashboard, Timescale } from './use-neo-dashboard';
import { useMemo, useState } from 'react';
import { DateTime } from 'luxon';
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ArrowLeftIcon,
  ChartBarIcon,
  ArrowTopRightOnSquareIcon,
  CalendarIcon,
  ClockIcon,
  ViewColumnsIcon,
} from '@heroicons/react/24/solid';

export interface NeoDashboardProps {
  /**
   * Optional default timescale, will be overridden by route parameters if match.
   */
  timescale?: Timescale;
  /**
   * Optional default date.
   */
  date?: string;
}

export function NeoDashboard(props: NeoDashboardProps) {
  const { timescale: propsTimescale, date: propsDate } = props;
  const params = useParams<{ date?: string; viewType?: string }>();
  const navigate = useNavigate();

  // Detect timescale from route path (e.g. /neows/daily -> daily)
  const activeTimescale = useMemo<Timescale>(() => {
    if (params.viewType && ['daily', 'weekly', 'monthly'].includes(params.viewType)) {
      return params.viewType as Timescale;
    }
    return propsTimescale ?? 'daily';
  }, [params.viewType, propsTimescale]);

  // Determine current active date
  const date = params.date ?? propsDate ?? getToday();

  // Mode for daily sorting ('size' | 'distance')
  const [stateMode, setStateMode] = useState<'size' | 'distance'>('size');

  const {
    loading,
    error,
    neosResponse,
    aggregateSummary,
    chartData,
    primaryAxis,
    secondaryAxes,
    dailyResponseWeekly,
    weeklySummaryMonthly,
    dailySummaryMonthly,
  } = useNeoDashboard({
    timescale: activeTimescale,
    date,
    mode: stateMode,
  });

  const currentDateTime = useMemo(() => {
    return DateTime.fromISO(date);
  }, [date]);

  // Route/Timescale updates
  const handleTimescaleChange = (newTimescale: Timescale) => {
    navigate(`/neows/${newTimescale}/${date}`);
  };

  // Date Navigation handlers
  const handlePrev = () => {
    let nextDate = currentDateTime;
    if (activeTimescale === 'daily') {
      nextDate = currentDateTime.minus({ days: 1 });
    } else if (activeTimescale === 'weekly') {
      nextDate = currentDateTime.minus({ weeks: 1 }).startOf('week');
    } else if (activeTimescale === 'monthly') {
      nextDate = currentDateTime.minus({ months: 1 }).startOf('month');
    }
    navigate(`/neows/${activeTimescale}/${nextDate.toFormat(DATE_FORMAT)}`);
  };

  const handleNext = () => {
    let nextDate = currentDateTime;
    if (activeTimescale === 'daily') {
      nextDate = currentDateTime.plus({ days: 1 });
    } else if (activeTimescale === 'weekly') {
      nextDate = currentDateTime.plus({ weeks: 1 }).startOf('week');
    } else if (activeTimescale === 'monthly') {
      nextDate = currentDateTime.plus({ months: 1 }).startOf('month');
    }
    navigate(`/neows/${activeTimescale}/${nextDate.toFormat(DATE_FORMAT)}`);
  };

  const handleResetToToday = () => {
    navigate(`/neows/${activeTimescale}/${getToday()}`);
  };

  // Label for current time period
  const formattedPeriodLabel = useMemo(() => {
    if (activeTimescale === 'daily') {
      return currentDateTime.toFormat('LLLL dd, yyyy');
    }
    if (activeTimescale === 'weekly') {
      return `Week of ${currentDateTime.startOf('week').toFormat('LLL dd, yyyy')}`;
    }
    return currentDateTime.toFormat('LLLL yyyy');
  }, [activeTimescale, currentDateTime]);

  // Extract individual NEOs for Daily Table
  const neos = useMemo(() => {
    if (activeTimescale !== 'daily' || !neosResponse) return [];
    return neosResponse.near_earth_objects[date] ?? [];
  }, [neosResponse, date, activeTimescale]);

  // List of weekly summary formatted
  const formattedWeeklySummary = useMemo(() => {
    if (activeTimescale !== 'weekly' || !dailyResponseWeekly) return [];
    return dailyResponseWeekly.map(([dayName, dateStr, lookupResponse]) => {
      const parsedDay = DateTime.fromISO(dateStr);
      return {
        dayLabel: dayName.charAt(0).toUpperCase() + dayName.slice(1),
        date: dateStr,
        formattedDate: parsedDay.toFormat('LLL dd'),
        count: lookupResponse?.length ?? 0,
        link: `/neows/daily/${dateStr}`,
      };
    });
  }, [dailyResponseWeekly, activeTimescale]);

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Spinner size="xl" color="info" aria-label="Loading near earth objects..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-4 max-w-5xl mt-6">
        <div className="p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg dark:bg-red-200 dark:text-red-800" role="alert">
          <span className="font-bold">Error:</span> {(error as Error).message || 'Failed to load Near Earth Objects.'}
        </div>
      </div>
    );
  }

  if (!neosResponse) {
    return (
      <div className="container mx-auto p-4 max-w-5xl mt-6">
        <div className="p-4 mb-4 text-sm text-yellow-700 bg-yellow-100 rounded-lg dark:bg-yellow-200 dark:text-yellow-800" role="alert">
          <span className="font-bold">Warning:</span> No Near Earth Objects data found.
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 space-y-6 max-w-5xl dark:text-white">
      {/* Top Breadcrumb & Timescale Switcher */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between border-b border-gray-200 dark:border-gray-700 pb-4">
        <div className="space-y-1">
          <Link to="/" className="inline-flex items-center gap-1 text-sm text-blue-500 hover:underline mb-1">
            <ArrowLeftIcon className="w-3.5 h-3.5" />
            <span>Overview</span>
          </Link>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-3xl">
            Near-Earth Objects Dashboard
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Chronological cosmic surveillance and details for <span className="font-semibold text-cyan-600 dark:text-cyan-400">{formattedPeriodLabel}</span>
          </p>
        </div>

        {/* Timescale Switcher Tabs */}
        <div className="inline-flex rounded-lg border border-gray-200 dark:border-gray-700 p-1 bg-gray-50 dark:bg-gray-800 self-start md:self-center">
          <button
            onClick={() => handleTimescaleChange('daily')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition ${
              activeTimescale === 'daily'
                ? 'bg-cyan-500 text-white shadow-sm'
                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-150 dark:hover:bg-gray-700'
            }`}
          >
            <ClockIcon className="w-3.5 h-3.5" />
            <span>Daily</span>
          </button>
          <button
            onClick={() => handleTimescaleChange('weekly')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition ${
              activeTimescale === 'weekly'
                ? 'bg-cyan-500 text-white shadow-sm'
                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-150 dark:hover:bg-gray-700'
            }`}
          >
            <ViewColumnsIcon className="w-3.5 h-3.5" />
            <span>Weekly</span>
          </button>
          <button
            onClick={() => handleTimescaleChange('monthly')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition ${
              activeTimescale === 'monthly'
                ? 'bg-cyan-500 text-white shadow-sm'
                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-150 dark:hover:bg-gray-700'
            }`}
          >
            <CalendarIcon className="w-3.5 h-3.5" />
            <span>Monthly</span>
          </button>
        </div>
      </div>

      {/* Date Navigation Bar */}
      <div className="flex flex-row items-center justify-between gap-4 bg-gray-50 dark:bg-gray-800/50 p-3 rounded-lg border border-gray-100 dark:border-gray-800">
        <Button size="xs" onClick={handlePrev} color="gray" className="!p-1.5">
          <ChevronLeftIcon className="w-4 h-4" />
        </Button>
        <span className="text-base font-bold text-gray-800 dark:text-white">
          {formattedPeriodLabel}
        </span>
        <div className="flex items-center gap-2">
          <Button size="xs" onClick={handleResetToToday} color="gray">
            Today
          </Button>
          <Button size="xs" onClick={handleNext} color="gray" className="!p-1.5">
            <ChevronRightIcon className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Aggregate KPI Ribbon Grid (All Timescales) */}
      {aggregateSummary && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="dark:bg-slate-800 dark:border-slate-700 hover:shadow-md transition">
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider font-bold">Total NEOs</p>
              <p className="text-3xl font-extrabold mt-1 text-gray-900 dark:text-white">{aggregateSummary.totalCount}</p>
            </div>
          </Card>
          <Card className="dark:bg-slate-800 dark:border-slate-700 hover:shadow-md transition">
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider font-bold">Hazardous NEOs</p>
              <p className={`text-3xl font-extrabold mt-1 ${aggregateSummary.hazardousCount > 0 ? 'text-red-500' : 'text-green-500'}`}>
                {aggregateSummary.hazardousCount} <span className="text-sm font-medium">({aggregateSummary.hazardousPercentage}%)</span>
              </p>
            </div>
          </Card>
          <Card className="dark:bg-slate-800 dark:border-slate-700 hover:shadow-md transition">
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider font-bold">Closest Approach</p>
              <p className="text-sm font-bold truncate mt-1 text-cyan-600 dark:text-cyan-400" title={aggregateSummary.closestNeoName || 'N/A'}>
                {aggregateSummary.closestNeoName || 'N/A'}
              </p>
              <p className="text-xs text-gray-400 mt-0.5">{aggregateSummary.closestKm ? `${aggregateSummary.closestKm} km` : 'N/A'}</p>
            </div>
          </Card>
          <Card className="dark:bg-slate-800 dark:border-slate-700 hover:shadow-md transition">
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider font-bold">Largest Detected</p>
              <p className="text-sm font-bold truncate mt-1 text-cyan-600 dark:text-cyan-400" title={aggregateSummary.largestNeoName || 'N/A'}>
                {aggregateSummary.largestNeoName || 'N/A'}
              </p>
              <p className="text-xs text-gray-400 mt-0.5">{aggregateSummary.largestMeters ? `${aggregateSummary.largestMeters} m max` : 'N/A'}</p>
            </div>
          </Card>
        </div>
      )}

      {/* Chart Section */}
      <Card className="dark:bg-slate-800 dark:border-slate-700">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-gray-200 dark:border-gray-700 pb-3 gap-2">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              {activeTimescale === 'daily'
                ? `Visual Attributes Comparison (${stateMode === 'distance' ? 'Miss Distance' : 'Estimated Size'})`
                : 'Near-Earth Objects Frequency Distribution'}
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              {activeTimescale === 'daily'
                ? 'Hover bars to inspect exact measurements of individual NEOs'
                : 'Tracks detection frequency of cosmic elements over time'}
            </p>
          </div>

          {activeTimescale === 'daily' && (
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-gray-600 dark:text-gray-400">Y-Axis:</span>
              <Dropdown
                label={stateMode === 'distance' ? 'View by Distance' : 'View by Size'}
                color="info"
                size="sm"
              >
                <Dropdown.Item onClick={() => setStateMode('size')}>
                  View by Size (m)
                </Dropdown.Item>
                <Dropdown.Item onClick={() => setStateMode('distance')}>
                  View by Distance (km)
                </Dropdown.Item>
              </Dropdown>
            </div>
          )}
        </div>

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
              No chart data available for this timescale.
            </div>
          )}
        </div>
      </Card>

      {/* List / Data Directory Area */}
      <div className="space-y-6">
        {/* Daily Timescale Table */}
        {activeTimescale === 'daily' && (
          <Card className="dark:bg-slate-800 dark:border-slate-700">
            <div className="flex flex-row items-center justify-between border-b border-gray-200 dark:border-gray-700 pb-4">
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">NEO Directory</h2>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Individual listings and orbital data on {date}
                </p>
              </div>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-200">
                Objects: {neos.length}
              </span>
            </div>

            {neos.length === 0 ? (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                No objects detected on this day.
              </div>
            ) : (
              <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
                <Table hoverable={true}>
                  <Table.Head className="bg-gray-50 dark:bg-gray-700">
                    <Table.HeadCell>Name</Table.HeadCell>
                    <Table.HeadCell>Ref ID</Table.HeadCell>
                    <Table.HeadCell>Hazard Status</Table.HeadCell>
                    <Table.HeadCell>Estimated Diameter (m)</Table.HeadCell>
                    <Table.HeadCell>Closest Approach</Table.HeadCell>
                    <Table.HeadCell>Miss Distance (km)</Table.HeadCell>
                    <Table.HeadCell>
                      <span className="sr-only">Links</span>
                    </Table.HeadCell>
                  </Table.Head>
                  <Table.Body className="divide-y divide-gray-200 dark:divide-gray-700">
                    {neos.map((neo) => {
                      const closeApproach = neo.close_approach_data?.find(
                        (app) => app.close_approach_date === date
                      ) ?? neo.close_approach_data?.[0];

                      const missDistanceStr = closeApproach?.miss_distance?.kilometers
                        ? Number(closeApproach.miss_distance.kilometers).toLocaleString()
                        : 'N/A';

                      const minDiameter = neo.estimated_diameter?.meters?.estimated_diameter_min;
                      const maxDiameter = neo.estimated_diameter?.meters?.estimated_diameter_max;
                      const formattedSize = minDiameter && maxDiameter
                        ? `${minDiameter.toFixed(1)} - ${maxDiameter.toFixed(1)}`
                        : 'N/A';

                      const closeApproachTime = closeApproach?.close_approach_date_full || closeApproach?.close_approach_date || 'N/A';

                      return (
                        <Table.Row
                          key={neo.id}
                          className="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                        >
                          <Table.Cell className="whitespace-nowrap font-bold text-gray-900 dark:text-white text-base">
                            {neo.name}
                          </Table.Cell>
                          <Table.Cell className="font-mono text-xs text-gray-500 dark:text-gray-400">
                            {neo.neo_reference_id}
                          </Table.Cell>
                          <Table.Cell>
                            {neo.is_potentially_hazardous_asteroid ? (
                              <Badge color="failure" className="w-fit">Hazardous</Badge>
                            ) : (
                              <Badge color="success" className="w-fit">Safe</Badge>
                            )}
                          </Table.Cell>
                          <Table.Cell className="whitespace-nowrap font-medium text-gray-700 dark:text-gray-300">
                            {formattedSize}
                          </Table.Cell>
                          <Table.Cell className="whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                            {closeApproachTime}
                          </Table.Cell>
                          <Table.Cell className="whitespace-nowrap font-semibold text-gray-800 dark:text-gray-200">
                            {missDistanceStr}
                          </Table.Cell>
                          <Table.Cell>
                            <div className="flex flex-row items-center gap-3">
                              <Link
                                to={`/neo/${neo.id}`}
                                className="inline-flex items-center gap-1 text-sm font-semibold text-cyan-600 hover:text-cyan-800 dark:text-cyan-400 dark:hover:text-cyan-300 hover:underline"
                              >
                                <ChartBarIcon className="h-4 w-4" />
                                <span>Details</span>
                              </Link>
                              <a
                                href={neo.nasa_jpl_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 text-sm font-semibold text-cyan-600 hover:text-cyan-800 dark:text-cyan-400 dark:hover:text-cyan-300 hover:underline"
                              >
                                <span>JPL</span>
                                <ArrowTopRightOnSquareIcon className="h-4 w-4" />
                              </a>
                            </div>
                          </Table.Cell>
                        </Table.Row>
                      );
                    })}
                  </Table.Body>
                </Table>
              </div>
            )}
          </Card>
        )}

        {/* Weekly Timescale Table */}
        {activeTimescale === 'weekly' && (
          <Card className="dark:bg-slate-800 dark:border-slate-700">
            <h3 className="text-lg font-bold mb-2">Daily Breakdown</h3>
            <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
              <Table hoverable>
                <Table.Head className="bg-gray-50 dark:bg-gray-700">
                  <Table.HeadCell>Day</Table.HeadCell>
                  <Table.HeadCell>Date</Table.HeadCell>
                  <Table.HeadCell>NEO Count</Table.HeadCell>
                  <Table.HeadCell>Actions</Table.HeadCell>
                </Table.Head>
                <Table.Body className="divide-y">
                  {formattedWeeklySummary.map((day, idx) => (
                    <Table.Row key={idx} className="bg-white dark:border-gray-700 dark:bg-slate-800">
                      <Table.Cell className="whitespace-nowrap font-bold text-gray-900 dark:text-white">
                        {day.dayLabel}
                      </Table.Cell>
                      <Table.Cell className="whitespace-nowrap font-medium text-gray-600 dark:text-gray-400">
                        {`${day.formattedDate} (${day.date})`}
                      </Table.Cell>
                      <Table.Cell>
                        <span className={day.count > 0 ? 'font-bold' : 'text-gray-400'}>
                          {day.count}
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
          </Card>
        )}

        {/* Monthly Timescale Tables (Weeks & Scrollable Days) */}
        {activeTimescale === 'monthly' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="dark:bg-slate-800 dark:border-slate-700">
              <h3 className="text-lg font-bold mb-2">Weekly Periods</h3>
              <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
                <Table hoverable>
                  <Table.Head className="bg-gray-50 dark:bg-gray-700">
                    <Table.HeadCell>Period</Table.HeadCell>
                    <Table.HeadCell>NEO Count</Table.HeadCell>
                    <Table.HeadCell>Actions</Table.HeadCell>
                  </Table.Head>
                  <Table.Body className="divide-y">
                    {weeklySummaryMonthly.map((week, idx) => (
                      <Table.Row key={idx} className="bg-white dark:border-gray-700 dark:bg-slate-800">
                        <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                          {`${week.start} to ${week.end}`}
                        </Table.Cell>
                        <Table.Cell className="font-bold">{week.count}</Table.Cell>
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
            </Card>

            <Card className="dark:bg-slate-800 dark:border-slate-700">
              <h3 className="text-lg font-bold mb-2">Daily Breakdown</h3>
              <div className="max-h-72 overflow-y-auto border border-gray-200 dark:border-gray-700 rounded-lg">
                <Table hoverable>
                  <Table.Head className="sticky top-0 bg-gray-50 dark:bg-slate-700 z-10">
                    <Table.HeadCell>Date</Table.HeadCell>
                    <Table.HeadCell>NEO Count</Table.HeadCell>
                    <Table.HeadCell>Actions</Table.HeadCell>
                  </Table.Head>
                  <Table.Body className="divide-y">
                    {dailySummaryMonthly.map((day, idx) => (
                      <Table.Row key={idx} className="bg-white dark:border-gray-700 dark:bg-slate-800">
                        <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                          {`${day.dayLabel} (${day.date})`}
                        </Table.Cell>
                        <Table.Cell>
                          <span className={day.count > 0 ? 'font-bold' : 'text-gray-400'}>
                            {day.count}
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
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
