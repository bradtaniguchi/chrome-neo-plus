import { DateTime, Interval } from 'luxon';
import { ApodResponse } from '../models/apod-response';

/**
 * Map used to cache APOD responses by their date.
 * This extends the Map instance
 */
export class ApodCache extends Map<ApodResponse['date'], ApodResponse> {
  constructor(
    entries: ReadonlyArray<readonly [ApodResponse['date'], ApodResponse]> = [],
    private STORAGE_KEY: string
  ) {
    super(entries);
  }

  /**
   * Loads the cache from local storage.
   */
  public loadFromCache() {
    const cached = localStorage.getItem(this.STORAGE_KEY);
    if (cached) {
      const apods = JSON.parse(cached) as ApodResponse[];
      this.setMany(apods ?? []);
    }
  }

  /**
   * Saves the current state of values to local storage.
   */
  private cacheToStorage() {
    localStorage.setItem(this.STORAGE_KEY, this.values().toString());
  }

  /**
   * Clears the local-storage and internal memory storage.
   */
  public override clear() {
    super.clear();
    this.cacheToStorage();
  }

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
    super.set(key, value);
    this.cacheToStorage();
    return this;
  }

  /**
   * Sets multiple APOD responses in the cache.
   * This will throw an error if the key is not a valid date.
   *
   * @param res the list of APODs to set.
   */
  public setMany(res: ApodResponse[]): this {
    res.forEach((r) => this.set(r.date, r));
    this.cacheToStorage();
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

/**
 * Basic singleton cache for APOD responses.
 */
export const apodCache = new ApodCache([], 'APOD_CACHE');
