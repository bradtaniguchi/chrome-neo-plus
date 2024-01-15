import { DATE_FORMAT } from '@chrome-neo-plus/common';
import { useNeos } from '../../hooks/use-neos';
import { DateTime } from 'luxon';
import { useMemo } from 'react';
import { UserSerie, AxisOptions } from 'react-charts';
import { ChartData } from '../view-daily';

/**
 * Custom hook that handles the current week for NEO lookups.
 *
 * Lists elements by day of the week, or by size across all days.
 *
 * @param params the parameters of the hook
 * @param params.date the date to lookup, in yyyy-MM-dd format
 */
export function useViewWeekly(params: { date: string }) {
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
