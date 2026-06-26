import { DATE_FORMAT } from '@chrome-neo-plus/common';
import { useNeos } from '../../hooks/use-neos';
import { DateTime } from 'luxon';
import { useMemo, useCallback } from 'react';
import { UserSerie, AxisOptions } from 'react-charts';
import { getWeeklyBlocks } from '../../utils/get-weekly-blocks';

export type Timescale = 'daily' | 'weekly' | 'monthly';

export interface UseNeoDashboardParams {
  timescale: Timescale;
  date: string;
  mode?: 'size' | 'distance'; // Only for daily
}

export function useNeoDashboard(params: UseNeoDashboardParams) {
  const { timescale, date, mode = 'size' } = params;

  const { error, loading, neosResponse } = useNeos({
    requestType: timescale,
    date,
  });

  // Calculate Aggregates (works for weekly and monthly, and daily summaries)
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

  // DAILY SPECIFIC PROCESSORS
  const mapSorted = useCallback(
    (data: any) => ({
      name: data.name,
      size: data.estimated_diameter.meters.estimated_diameter_max,
      distance: Number(data.close_approach_data[0].miss_distance.kilometers),
    }),
    []
  );

  const sortedBySizeData = useMemo(() => {
    if (timescale !== 'daily' || !neosResponse) return [];
    const sorted = [
      ...(neosResponse.near_earth_objects[date] ?? []),
    ]?.sort((a, b) => {
      const aSize = a.estimated_diameter.meters.estimated_diameter_max;
      const bSize = b.estimated_diameter.meters.estimated_diameter_max;
      return aSize - bSize;
    });
    return sorted.map(mapSorted);
  }, [neosResponse, date, timescale, mapSorted]);

  const sortedByDistanceData = useMemo(() => {
    if (timescale !== 'daily' || !neosResponse) return [];
    const sorted = [
      ...(neosResponse.near_earth_objects[date] ?? []),
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
  }, [neosResponse, date, timescale, mapSorted]);

  // WEEKLY SPECIFIC PROCESSORS
  const dailyResponseWeekly = useMemo(() => {
    if (timescale !== 'weekly' || !neosResponse || !date) return [];
    const startDate = DateTime.fromISO(date);
    const monday = startDate.startOf('week');
    const days = Array.from({ length: 7 }, (_, i) => monday.plus({ days: i }));

    const dayNames = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

    return days.map((day, i) => [
      dayNames[i],
      day.toFormat(DATE_FORMAT),
      neosResponse.near_earth_objects[day.toFormat(DATE_FORMAT)],
    ] as const);
  }, [neosResponse, date, timescale]);

  // MONTHLY SPECIFIC PROCESSORS
  const currentDateTime = useMemo(() => DateTime.fromISO(date), [date]);

  const weeklySummaryMonthly = useMemo(() => {
    if (timescale !== 'monthly' || !neosResponse || !date) return [];
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
  }, [neosResponse, currentDateTime, date, timescale]);

  const dailySummaryMonthly = useMemo(() => {
    if (timescale !== 'monthly' || !neosResponse || !date) return [];
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
  }, [neosResponse, currentDateTime, date, timescale]);

  // CHART DATA GENERATORS
  const chartData: UserSerie<any>[] = useMemo(() => {
    if (!neosResponse) return [];

    if (timescale === 'daily') {
      const activeData = mode === 'distance' ? sortedByDistanceData : sortedBySizeData;
      return [
        {
          label: mode === 'distance' ? 'distance' : 'size',
          data: activeData,
        },
      ];
    }

    if (timescale === 'weekly') {
      return dailyResponseWeekly.map(([day, date, lookupResponse]) => ({
        label: day,
        data: [
          {
            day,
            date,
            count: lookupResponse?.length ?? 0,
          },
        ],
      }));
    }

    if (timescale === 'monthly') {
      const startOfMonth = currentDateTime.startOf('month');
      const daysInMonth = startOfMonth.daysInMonth ?? 30;
      const dataPoints = [];

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
    }

    return [];
  }, [timescale, neosResponse, mode, sortedByDistanceData, sortedBySizeData, dailyResponseWeekly, currentDateTime]);

  // CHART AXES
  const primaryAxis = useMemo(
    (): AxisOptions<any> => {
      if (timescale === 'daily') {
        return {
          getValue: (datum) => datum.name,
          elementType: 'bar',
        };
      }
      return {
        getValue: (datum) => datum.date,
        elementType: 'bar',
      };
    },
    [timescale]
  );

  const secondaryAxes = useMemo(
    (): AxisOptions<any>[] => {
      if (timescale === 'daily') {
        return [
          {
            getValue: (datum) => (mode === 'distance' ? datum.distance : datum.size),
            elementType: 'bar',
          },
        ];
      }
      return [
        {
          getValue: (datum) => datum.count,
        },
      ];
    },
    [timescale, mode]
  );

  return {
    loading,
    error,
    neosResponse,
    aggregateSummary,
    chartData,
    primaryAxis,
    secondaryAxes,
    // Timescale specific lists
    dailyResponseWeekly,
    weeklySummaryMonthly,
    dailySummaryMonthly,
  };
}
