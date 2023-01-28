import { DateTime } from 'luxon';

export interface WeeklyBlock {
  /**
   * The start date of the block.
   */
  start_date: DateTime;
  /**
   * The end of the block
   */
  end_date: DateTime;
}
export interface WeeklyBlockStrings {
  /**
   * The start date of the block. Format: yyyy-MM-dd
   */
  start_date: string;
  /**
   * The end of the block. Format: yyyy-MM-dd
   */
  end_date: string;
}

/**
 * Returns "weekly blocks" of start/end-dates for the current month.
 *
 * @param date The date to use as the "today" date
 */
export function getWeeklyBlocks(date: DateTime): WeeklyBlock[] {
  const startOfMonth = date.startOf('month');
  const endOfMonth = date.endOf('month');

  return [
    {
      start_date: startOfMonth,
      end_date: startOfMonth.plus({ weeks: 1 }),
    },
    {
      start_date: startOfMonth.plus({ weeks: 1 }),
      end_date: startOfMonth.plus({ weeks: 2 }),
    },
    {
      start_date: startOfMonth.plus({ weeks: 2 }),
      end_date: startOfMonth.plus({ weeks: 3 }),
    },
    ...(getWeeksInMonth(date) === 5
      ? [
          {
            start_date: startOfMonth.plus({ weeks: 3 }),
            end_date: startOfMonth.plus({ weeks: 4 }),
          },
          {
            start_date: startOfMonth.plus({ weeks: 4 }),
            end_date: endOfMonth,
          },
        ]
      : [
          {
            start_date: startOfMonth.plus({ weeks: 3 }),
            end_date: endOfMonth,
          },
        ]),
  ];
}

/**
 * Returns how many weeks are in the given date's month.
 *
 * @param date The date to use as the relative date.
 */
export function getWeeksInMonth(date: DateTime): number {
  const startOfMonth = date.startOf('month');
  const endOfMonth = date.endOf('month');
  return Math.ceil(endOfMonth.diff(startOfMonth, 'weeks').weeks);
}

/**
 * Formats all the blocks to string versions with format yyyy-MM-dd.
 *
 * @param blocks The blocks to format
 */
export function formatBlocksToStrings(
  blocks: WeeklyBlock[]
): WeeklyBlockStrings[] {
  return blocks.map(({ start_date, end_date }) => ({
    start_date: start_date.toFormat('yyyy-MM-dd'),
    end_date: end_date.toFormat('yyyy-MM-dd'),
  })) as WeeklyBlockStrings[];
}
