import { DATE_FORMAT } from '@chrome-neo-plus/common';
import { useNeos } from '../../hooks/use-neos';
import { DateTime } from 'luxon';
import { useMemo } from 'react';
import { UserSerie, AxisOptions } from 'react-charts';

export interface MonthlyChartData {
  date: string;
  count: number;
}

export interface UseViewMonthlyParams {
  date: string;
}

/**
 * Custom hook that handles the current month for NEO lookups.
 *
 * @param params The parameters of the hook.
 * @param params.date The date to lookup, in yyyy-MM-dd format.
 */
export function useViewMonthly(params: UseViewMonthlyParams) {
  const { date } = params;
  const { error, loading, neosResponse } = useNeos({
    requestType: 'monthly',
    date,
  });

  const chartData: UserSerie<MonthlyChartData>[] = useMemo(() => {
    if (!neosResponse || !date) return [];

    const startOfMonth = DateTime.fromISO(date).startOf('month');
    const daysInMonth = startOfMonth.daysInMonth ?? 30;
    const dataPoints: MonthlyChartData[] = [];

    for (let i = 0; i < daysInMonth; i++) {
      const currentDay = startOfMonth.plus({ days: i });
      const dateStr = currentDay.toFormat(DATE_FORMAT);
      const count = neosResponse.near_earth_objects[dateStr]?.length ?? 0;
      dataPoints.push({
        date: currentDay.toFormat('dd'),
        count,
      });
    }

    return [
      {
        label: 'NEOs per Day',
        data: dataPoints,
      },
    ];
  }, [neosResponse, date]);

  const primaryAxis = useMemo(
    (): AxisOptions<MonthlyChartData> => ({
      getValue: (datum) => datum.date,
      elementType: 'bar',
    }),
    []
  );

  const secondaryAxes = useMemo(
    (): AxisOptions<MonthlyChartData>[] => [
      {
        getValue: (datum) => datum.count,
      },
    ],
    []
  );

  return {
    error,
    loading,
    neosResponse,
    chartData,
    primaryAxis,
    secondaryAxes,
  };
}
