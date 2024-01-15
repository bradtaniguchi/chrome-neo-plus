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
  day: Day;
  date: string;
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
    requestType: 'weekly',
    date,
  });

  // TODO: this is actually weekly!
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
      [
        'sunday',
        sunday.toFormat(DATE_FORMAT),
        neosResponse.near_earth_objects[sunday.toFormat(DATE_FORMAT)],
      ],
      [
        'monday',
        monday.toFormat(DATE_FORMAT),
        neosResponse.near_earth_objects[monday.toFormat(DATE_FORMAT)],
      ],
      [
        'tuesday',
        tuesday.toFormat(DATE_FORMAT),
        neosResponse.near_earth_objects[tuesday.toFormat(DATE_FORMAT)],
      ],
      [
        'wednesday',
        wednesday.toFormat(DATE_FORMAT),
        neosResponse.near_earth_objects[wednesday.toFormat(DATE_FORMAT)],
      ],
      [
        'thursday',
        thursday.toFormat(DATE_FORMAT),
        neosResponse.near_earth_objects[thursday.toFormat(DATE_FORMAT)],
      ],
      [
        'friday',
        friday.toFormat(DATE_FORMAT),
        neosResponse.near_earth_objects[friday.toFormat(DATE_FORMAT)],
      ],
      [
        'saturday',
        saturday.toFormat(DATE_FORMAT),
        neosResponse.near_earth_objects[saturday.toFormat(DATE_FORMAT)],
      ],
    ] as const;
  }, [neosResponse, date]);

  const chartData: UserSerie<ChartData>[] = useMemo(() => {
    return dailyResponse.map(([day, date, lookupResponse]) => {
      return {
        label: day,
        data: [
          {
            day,
            date,
            count: lookupResponse?.length ?? 0,
          },
        ],
      };
    });
  }, [dailyResponse]);

  const primaryAxis = useMemo(
    (): AxisOptions<ChartData> => ({
      getValue: (datum) => datum.date,
      elementType: 'bar',
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
