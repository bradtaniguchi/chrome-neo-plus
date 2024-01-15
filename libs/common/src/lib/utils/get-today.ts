import { DATE_FORMAT } from '../constants/date-format';
import { DateTime } from 'luxon';

/**
 * Returns today's date in the format of DATE_FORMAT
 *
 * Should be in yyyy-MM-dd format.
 *
 * @returns today's date
 */
export function getToday() {
  return DateTime.now().toFormat(DATE_FORMAT);
}
