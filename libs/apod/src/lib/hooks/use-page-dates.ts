import { DATE_FORMAT } from '@chrome-neo-plus/common';
import { DateTime } from 'luxon';
import { useMemo } from 'react';

/**
 * Custom hook used to calculate start and end dates from possible
 * end user inputs.
 *
 * Internally this will manage any possible edge-cases tied with
 * dates in the future and invalid entry dates.
 *
 * @param params The parameters for the hook
 * @param params.initStartDate The start date, if not given we assume 5 day look-back.
 * @param params.initEndDate The end-date, cannot be in the future. If not given we assume today.
 */
export function usePageDates(params: {
  initStartDate?: string;
  initEndDate?: string;
}) {
  const { initStartDate, initEndDate } = params;

  return useMemo(() => {
    // calculate the end date first.
    let endDateTime = initEndDate
      ? DateTime.fromFormat(initEndDate, DATE_FORMAT)
      : DateTime.local();
    if (!endDateTime.isValid || endDateTime > DateTime.local()) {
      endDateTime = DateTime.local();
    }

    // calculate the start date relative to the end-date.
    let startDateTime = initStartDate
      ? DateTime.fromFormat(initStartDate, DATE_FORMAT)
      : endDateTime.minus({ days: 5 });
    if (!startDateTime.isValid || startDateTime > endDateTime) {
      startDateTime = endDateTime.minus({ days: 5 });
    }

    return {
      /**
       * The end-date time calculated from the input dates, and validated.
       */
      endDateTime,
      /**
       * The start-date time calculated from the input dates, and validated.
       */
      startDateTime,
      /**
       * The end-date in the format yyyy-MM-dd
       */
      endDate: endDateTime.toFormat(DATE_FORMAT),
      /**
       * The start-date in the format yyyy-MM-dd
       */
      startDate: startDateTime.toFormat(DATE_FORMAT),

      /**
       * The previous end-date that should be used for "previous"
       */
      previousEndDate: endDateTime.minus({ days: 5 }).toFormat(DATE_FORMAT),
      /**
       * The next end-date that should be used for "next"
       */
      nextEndDate: endDateTime.plus({ days: 5 }).toFormat(DATE_FORMAT),

      /**
       * The previous start-date that should be used for "previous"
       */
      previousStartDate: startDateTime.minus({ days: 5 }).toFormat(DATE_FORMAT),
      /**
       * The next start-date that should be used for "next"
       */
      nextStartDate: startDateTime.plus({ days: 5 }).toFormat(DATE_FORMAT),
    };
  }, [initStartDate, initEndDate]);
}
