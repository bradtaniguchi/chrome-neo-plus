import { useParams } from 'react-router-dom';
import { useNeos } from '../../hooks';
import { DATE_FORMAT, DAYS, Day } from '@chrome-neo-plus/common';
import { LookupResponse } from '../../models';
import { useMemo } from 'react';
import { DateTime } from 'luxon';

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

/**
 * Custom hook that handles a single day for NEO lookup.
 *
 * This primarily provides more separated data based
 * around the given day to make it easier to display
 * within a chart and table.
 */
export function useViewDaily() {
  const { date } = useParams();
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
      ['monday', neosResponse.near_earth_objects[monday.toISODate()]],
      ['tuesday', neosResponse.near_earth_objects[tuesday.toISODate()]],
      ['wednesday', neosResponse.near_earth_objects[wednesday.toISODate()]],
      ['thursday', neosResponse.near_earth_objects[thursday.toISODate()]],
      ['friday', neosResponse.near_earth_objects[friday.toISODate()]],
      ['saturday', neosResponse.near_earth_objects[saturday.toISODate()]],
    ];
  }, [neosResponse, date]);

  return {
    error,
    loading,
    neosResponse,
    dailyResponse,
  };
}
