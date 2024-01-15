import { DATE_FORMAT, Day } from '@chrome-neo-plus/common';
import { DateTime } from 'luxon';
import { useMemo } from 'react';
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
  date: Date;
  count: number;
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
 */
export function useViewDaily(params: { date: string }) {
  const { date } = params;
  const { error, loading, neosResponse } = useNeos({
    requestType: 'daily',
    date,
  });

  const dailyResponse = useMemo(() => {
    if (!neosResponse || !date) return [];

    // using luxon to get the day of the week
    const startDate = DateTime.fromISO(date);
    const sunday = startDate.startOf('week');
    const monday = sunday.plus({ days: 1 });
    const tuesday = monday.plus({ days: 1 });
    const wednesday = tuesday.plus({ days: 1 });
    const thursday = wednesday.plus({ days: 1 });
    const friday = thursday.plus({ days: 1 });
    const saturday = friday.plus({ days: 1 });

    return [
      ['sunday', neosResponse.near_earth_objects[sunday.toFormat(DATE_FORMAT)]],
      ['monday', neosResponse.near_earth_objects[monday.toFormat(DATE_FORMAT)]],
      [
        'tuesday',
        neosResponse.near_earth_objects[tuesday.toFormat(DATE_FORMAT)],
      ],
      [
        'wednesday',
        neosResponse.near_earth_objects[wednesday.toFormat(DATE_FORMAT)],
      ],
      [
        'thursday',
        neosResponse.near_earth_objects[thursday.toFormat(DATE_FORMAT)],
      ],
      ['friday', neosResponse.near_earth_objects[friday.toFormat(DATE_FORMAT)]],
      [
        'saturday',
        neosResponse.near_earth_objects[saturday.toFormat(DATE_FORMAT)],
      ],
    ] as const;
  }, [neosResponse, date]);

  const chartData: UserSerie<ChartData>[] = useMemo(() => {
    return dailyResponse.map(([day, lookupResponse]) => {
      return {
        label: day,
        data: [
          {
            date: new Date(),
            count: lookupResponse.length,
          },
        ],
      };
    });
  }, [dailyResponse]);

  const primaryAxis = useMemo(
    (): AxisOptions<ChartData> => ({
      getValue: (datum) => datum.date,
    }),

    []
  );

  const secondaryAxes = useMemo(
    (): AxisOptions<ChartData>[] => [
      {
        getValue: (datum) => datum.count,
      },
    ],
    []
  );

  return {
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
}
