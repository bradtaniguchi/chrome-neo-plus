/**
 * The list of days we will display things in order for.
 * Starts at Sunday
 */
export const DAYS = [
  'sunday',
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
] as const;

export type Day = typeof DAYS[number];

/**
 * The index of the days, where sunday is 0.
 * Should align with Luxon dates
 */
export const DAYS_INDEX = DAYS.map((_, index) => index);
