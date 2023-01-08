import { DateTime, Interval } from 'luxon';
import { ApodResponse } from '../models/apod-response';

/**
 * Map used to cache APOD responses by their date.
 * This extends the Map instance
 */
export class ApodCache extends Map<ApodResponse['date'], ApodResponse> {
  /**
   * Adds a new element with a specified key and value to the Map.
   * If an element with the same key already exists, the element will be updated.
   * This will throw an error if the key is not a valid date.
   *
   * @param key The key of the element to add.
   * @param value The value of the element to add.
   */
  public override set(key: ApodResponse['date'], value: ApodResponse): this {
    if (!DateTime.fromFormat(key, 'yyyy-MM-dd').isValid)
      throw new Error('Invalid date format');
    return super.set(key, value);
  }

  /**
   * Sets multiple APOD responses in the cache.
   * This will throw an error if the key is not a valid date.
   *
   * @param res the list of APODs to set.
   */
  public setMany(res: ApodResponse[]): this {
    res.forEach((r) => this.set(r.date, r));
    return this;
  }

  /**
   * Returns the cached range, and if there are possible "gaps".
   * If there are gaps, the `gaps` property will be an array of the missing dates.
   *
   * @param startDate the start date of the range
   * @param endDate the end date of the range
   * @returns the list of apods currently within the range, including gaps,
   * and if there are gaps.
   */
  public getRange(
    startDate: string,
    endDate: string
  ): {
    apods: Array<ApodResponse | undefined>;
    hasGaps: boolean;
  } {
    const start = DateTime.fromFormat(startDate, 'yyyy-MM-dd');
    const end = DateTime.fromFormat(endDate, 'yyyy-MM-dd');
    const interval = Interval.fromDateTimes(start, end);

    const days: string[] = [];
    let cursor = interval.start.startOf('day');

    // TODO: verify end is included!
    while (cursor < interval.end) {
      days.push(cursor.toFormat('yyyy-MM-dd'));
      cursor = cursor.plus({ days: 1 });
    }

    let hasGaps = false;
    const apods = days.map((day) => {
      const apod = this.get(day);
      if (!apod) hasGaps = true;
      return apod;
    });

    return {
      apods,
      hasGaps,
    };
  }
}
