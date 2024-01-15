import { Day } from '@chrome-neo-plus/common';
import { useCallback, useDebugValue, useMemo, useState } from 'react';
import { AxisOptions, UserSerie } from 'react-charts';
import { useNeos } from '../../hooks';
import { LookupResponse } from '../../models';

/**
 * The daily breakdown of neosResponses by day.
 */
export type DailyResponse = {
  /**
   * Array of tuples where the first value is the day,
   * and the second is the lookup response for that day.
   *
   * Week starts on Sunday.
   *
   * @see {@link Day}
   */
  dailyResponse: [Day, LookupResponse][];
};

export type ChartData = {
  name: string;
  size: number;
  // **Note** this is a string due to large floating point values
  distance: number;
};

/**
 * Custom hook that handles a single day for NEO lookup.
 *
 * This primarily provides more separated data based
 * around the given day to make it easier to display
 * within a chart and table.
 *
 * @param params The parameters for the hook.
 * @param params.date The date to lookup, in yyyy-MM-dd format.
 * @param params.mode The mode to display the data in, defaults to size.
 */
export function useViewDaily(params: {
  date?: string;
  mode?: 'size' | 'distance';
}) {
  const { date, mode } = params;
  const { error, loading, neosResponse } = useNeos({
    requestType: 'daily',
    date,
  });

  // helper function
  const mapSorted = useCallback(
    (data: LookupResponse) => ({
      name: data.name,
      size: data.estimated_diameter.meters.estimated_diameter_max,
      distance: Number(data.close_approach_data[0].miss_distance.kilometers),
    }),
    []
  );

  const sortedBySizeData = useMemo(() => {
    // sort dailyResponses by their size
    const sorted = [
      ...(neosResponse?.near_earth_objects[date ?? ''] ?? []),
    ]?.sort((a, b) => {
      const aSize = a.estimated_diameter.meters.estimated_diameter_max;
      const bSize = b.estimated_diameter.meters.estimated_diameter_max;

      return aSize - bSize;
    });
    return sorted.map(mapSorted);
  }, [neosResponse, date, mapSorted]);

  const sortedByDistanceData = useMemo(() => {
    // sort dailyResponses by their distance
    const sorted = [
      ...(neosResponse?.near_earth_objects[date ?? ''] ?? []),
    ]?.sort((a, b) => {
      const aDistance = Number(
        a.close_approach_data[0].miss_distance.kilometers
      );
      const bDistance = Number(
        b.close_approach_data[0].miss_distance.kilometers
      );
      return aDistance < bDistance ? -1 : aDistance > bDistance ? 1 : 0;
    });
    return sorted.map(mapSorted);
  }, [neosResponse, date, mapSorted]);

  const chartData: UserSerie<ChartData>[] = useMemo(() => {
    if (mode === 'distance') {
      return [
        {
          label: 'distance',
          data: sortedByDistanceData,
        },
      ];
    }
    return [
      {
        label: 'size',
        data: sortedBySizeData,
      },
    ];
  }, [mode, sortedByDistanceData, sortedBySizeData]);

  const primaryAxis = useMemo(
    (): AxisOptions<ChartData> => ({
      getValue: (datum) => datum.name,
      elementType: 'bar',
    }),
    []
  );

  const secondaryAxes = useMemo(
    (): AxisOptions<ChartData>[] => [
      {
        // getValue: (datum) => datum.name,
        getValue: (datum) =>
          mode === 'distance' ? datum.distance : datum.size,
        elementType: 'bar',
      },
    ],
    [mode]
  );

  const value = {
    /**
     * If there is an error with loading neo data
     */
    error,
    /**
     * If we are loading neo data
     */
    loading,
    /**
     * The raw response of data from the useNeos hook.
     */
    neosResponse,

    chartData,
    primaryAxis,
    secondaryAxes,
  };

  useDebugValue({ ...value, sortedBySizeData, sortedByDistanceData });

  return value;
}
