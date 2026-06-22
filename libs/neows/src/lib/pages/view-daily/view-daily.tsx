import { getToday } from '@chrome-neo-plus/common';
import { Card, Dropdown, Spinner, Table, Badge } from 'flowbite-react';
import { Chart } from 'react-charts';
import { Link, useParams } from 'react-router-dom';
import { useViewDaily } from './use-view-daily';
import { useState, useMemo } from 'react';
import { ChartBarIcon, ArrowTopRightOnSquareIcon } from '@heroicons/react/24/solid';

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
 * Page should be split in half, the top is the chart display.
 * The bottom is the list of NEOs and high level data.
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

  const neos = useMemo(() => {
    return neosResponse?.near_earth_objects?.[date] ?? [];
  }, [neosResponse, date]);

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Spinner size="xl" color="info" aria-label="Loading near earth objects..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg dark:bg-red-200 dark:text-red-800" role="alert">
        <span className="font-bold">Error:</span> {(error as Error).message || 'Failed to load Near Earth Objects.'}
      </div>
    );
  }

  if (!neosResponse) {
    return (
      <div className="p-4 mb-4 text-sm text-yellow-700 bg-yellow-100 rounded-lg dark:bg-yellow-200 dark:text-yellow-800" role="alert">
        <span className="font-bold">Warning:</span> No Near Earth Objects data found.
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-gray-200 dark:border-gray-700 pb-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-3xl">
            Daily Near-Earth Objects
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Astrophysical lookup and visualization for <span className="font-semibold text-cyan-600 dark:text-cyan-400">{date}</span>
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Sort Chart by:</span>
          <Dropdown
            label={mode === 'distance' ? 'View by Distance' : 'View by Size'}
            color="info"
            size="sm"
          >
            <Dropdown.Item onClick={() => setStateMode('size')}>
              View by Size
            </Dropdown.Item>
            <Dropdown.Item onClick={() => setStateMode('distance')}>
              View by Distance
            </Dropdown.Item>
          </Dropdown>
        </div>
      </div>

      {/* Chart Section */}
      <Card className="dark:bg-slate-800 dark:text-white">
        <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 pb-2">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Visual Comparison ({mode === 'distance' ? 'Miss Distance' : 'Estimated Size'})
          </h2>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            Hover over bars to see individual values
          </span>
        </div>
        <div className="w-full h-80 sm:h-96 relative pr-4">
          <Chart
            options={{
              data: chartData,
              primaryAxis,
              secondaryAxes,
            }}
          />
        </div>
      </Card>

      {/* List / Table Section */}
      <Card className="dark:bg-slate-800 dark:text-white">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-gray-200 dark:border-gray-700 pb-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              NEO Directory
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Detailed breakdown of Near-Earth Objects detected on {date}
            </p>
          </div>
          <div className="shrink-0">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-200">
              Total Count: {neos.length}
            </span>
          </div>
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
                      <Table.Cell className="whitespace-nowrap font-semibold text-gray-900 dark:text-white text-base">
                        {neo.name}
                      </Table.Cell>
                      <Table.Cell className="font-mono text-xs text-gray-500 dark:text-gray-400">
                        {neo.neo_reference_id}
                      </Table.Cell>
                      <Table.Cell>
                        {neo.is_potentially_hazardous_asteroid ? (
                          <Badge color="failure" className="w-fit">
                            Hazardous
                          </Badge>
                        ) : (
                          <Badge color="success" className="w-fit">
                            Non-Hazardous
                          </Badge>
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
    </div>
  );
}
