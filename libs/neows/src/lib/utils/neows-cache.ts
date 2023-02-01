import { FeedResponse } from '../models/feed-response';
import { LookupResponse } from '../models/lookup-response/lookup-response';

/**
 * Map used to cache NEOWs responses by their date-range.
 */
export class NeowsCache {
  private STORAGE_KEY: string;
  private DAILY_KEY: string;
  private WEEKLY_KEY: string;
  private MONTHLY_KEY: string;
  private ID_KEY: string;

  /**
   * The public underlying data for the daily-cache.
   */
  public readonly dailyCache = new Map<string, FeedResponse>();
  /**
   * Currently made daily-cache request data. This is used to prevent
   * duplicate requests from being made.
   */
  public readonly dailyCache$ = new Map<string, Promise<FeedResponse>>();
  /**
   * The public underlying data for the weekly-cache.
   */
  public readonly weeklyCache = new Map<string, FeedResponse>();
  /**
   * The public underlying data for the monthly-cache.
   */
  public readonly monthlyCache = new Map<string, Omit<FeedResponse, 'links'>>();
  /**
   * The public underlying data for the id-cache.
   */
  public readonly idCache = new Map<string, LookupResponse>();

  constructor(params: {
    /**
     * The top-level key to use when storing the cache in local storage.
     */
    STORAGE_KEY: string;
    /**
     * The sub-key used to store things under the top-level STORAGE_KEY property
     * in local storage.
     */
    DAILIES_KEY: string;
    /**
     * The sub-key used to store things under the top-level STORAGE_KEY property
     * in local storage.
     */
    WEEKLY_KEY: string;
    /**
     * The sub-key used to store things under the top-level STORAGE_KEY property
     * in local storage.
     */
    MONTHLY_KEY: string;
    /**
     * The sub-key used to store things under the top-level STORAGE_KEY property,
     * used to track individual lookup response data by their id.
     */
    ID_KEY: string;
  }) {
    this.STORAGE_KEY = params.STORAGE_KEY;
    this.DAILY_KEY = params.DAILIES_KEY;
    this.WEEKLY_KEY = params.WEEKLY_KEY;
    this.MONTHLY_KEY = params.MONTHLY_KEY;
    this.ID_KEY = params.ID_KEY;
  }

  /**
   * Saves the caches to local storage.
   */
  public saveToCache() {
    const data = {
      [this.DAILY_KEY]: Object.fromEntries(this.dailyCache),
      [this.WEEKLY_KEY]: Object.fromEntries(this.weeklyCache),
      [this.MONTHLY_KEY]: Object.fromEntries(this.monthlyCache),
      [this.ID_KEY]: Object.fromEntries(this.idCache),
    };

    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
    return this;
  }

  /**
   * Loads data from local storage into the cache.
   */
  public loadFromCache() {
    const cached = localStorage.getItem(this.STORAGE_KEY);
    if (cached) {
      const data = JSON.parse(cached);
      // TODO: verify loaded correctly.

      const dailies = data[this.DAILY_KEY] ?? [];
      if (dailies && typeof dailies === 'object')
        Object.entries(dailies).forEach(([key, value]) =>
          this.dailyCache.set(key, value as FeedResponse)
        );

      const weeklies = data[this.WEEKLY_KEY] ?? [];
      if (weeklies && typeof weeklies === 'object')
        Object.entries(weeklies).forEach(([key, value]) =>
          this.weeklyCache.set(key, value as FeedResponse)
        );

      const monthlies = data[this.MONTHLY_KEY] ?? [];
      if (monthlies && typeof monthlies === 'object')
        Object.entries(monthlies).forEach(([key, value]) =>
          this.monthlyCache.set(key, value as FeedResponse)
        );

      const ids = data[this.ID_KEY] ?? [];
      if (ids && typeof ids === 'object')
        Object.entries(ids).forEach(([key, value]) =>
          this.idCache.set(key, value as LookupResponse)
        );
    }
    return this;
  }

  /**
   * Utility method that returns the "flattened" data from the given response.
   *
   * Useful to flatten feed-response requests to get individual lookup responses.
   *
   * @param res The response to flatten.
   */
  private collapseNeowsResponse(
    res: Pick<FeedResponse, 'near_earth_objects'>
  ): LookupResponse[] {
    return Object.values(res.near_earth_objects).reduce((acc, neos) => {
      neos.forEach((neo) => {
        acc.push(neo);
      });
      return acc;
    }, [] as LookupResponse[]);
  }

  /**
   * Sets data for the given daily request.
   *
   * @param params The parameters for the request.
   * @param params.date The date of the data being cached. in format yyyy-MM-dd
   * @param params.res The feed response data to cache into local storage.
   */
  public setDaily(params: { date: string; res: FeedResponse }) {
    const { date, res } = params;
    this.dailyCache.set(date, res);
    this.setMultipleById(this.collapseNeowsResponse(res));
    this.saveToCache();
    return this;
  }

  /**
   * Gets data for the given daily request.
   *
   * @param date The date of the data that needs to be checked for
   */
  public getDaily(date: string): FeedResponse | undefined {
    return this.dailyCache.get(date);
  }

  /**
   * Sets data for an on-going daily request.
   *
   * @param params The parameters for the request.
   * @param params.date The date of the data being cached. in format yyyy-MM-dd
   * @param params.res The feed response data to cache into local storage.
   */
  public setCurrentDailyRequest(params: {
    date: string;
    res: Promise<FeedResponse>;
  }) {
    const { date, res } = params;
    this.dailyCache$.set(date, res);

    return res;
  }

  /**
   * Gets data for the current daily requests that are in progress.
   *
   * @param date The date of the data that needs to be checked for
   */
  public getCurrentDailyRequest(
    date: string
  ): Promise<FeedResponse> | undefined {
    return this.dailyCache$.get(date);
  }

  /**
   * Sets data for the given weekly request.
   *
   * @param params The parameters for the request.
   * @param params.week The week of the data being cached, should be the number of the year
   *  according to luxon.
   * @param params.year The year of the data being cached.
   * @param params.res The feed response data to cache into local storage.
   */
  public setWeekly(params: { week: number; year: number; res: FeedResponse }) {
    const { week, year, res } = params;
    this.weeklyCache.set(`${year}-${week}`, res);
    this.setMultipleById(this.collapseNeowsResponse(res));
    this.saveToCache();
    return this;
  }

  /**
   * Returns the data for the given week
   *
   * @param week The week to load data for
   * @param year The year to load data for
   */
  public getWeekly(week: number, year: number): FeedResponse | undefined {
    return this.weeklyCache.get(`${year}-${week}`);
  }

  /**
   * Sets data for the given monthly request.
   *
   * @param params The parameters for the request.
   * @param params.month The month of the data being cached, should be the number of the year
   * according to luxon.
   * @param params.year The year of the data being cached.
   * @param params.res The feed response data to cache into local storage.
   */
  public setMonthly(params: {
    month: number;
    year: number;
    res: Omit<FeedResponse, 'links'>;
  }) {
    const { month, year, res } = params;
    this.monthlyCache.set(`${year}-${month}`, res);
    this.setMultipleById(this.collapseNeowsResponse(res));
    this.saveToCache();
    return this;
  }

  /**
   * Returns the data for the given month
   *
   * @param month The month to load data for
   * @param year The year to load data for
   */
  public getMonthly(
    month: number,
    year: number
  ): Omit<FeedResponse, 'links'> | undefined {
    return this.monthlyCache.get(`${year}-${month}`);
  }

  /**
   * Sets the given NEOs by the id
   *
   * @param res The neo data to save to cache
   */
  public setById(res: LookupResponse) {
    this.idCache.set(res.id, res);
    this.saveToCache();
    return this;
  }

  /**
   * Sets multiple NEOs by their id
   *
   * @param res The NEOs to save data for
   */
  public setMultipleById(res: LookupResponse[]) {
    res.forEach((neo) => this.setById(neo));
    return this;
  }

  /**
   * Returns the NEOs data for the given id
   *
   * @param id The id to get the NEO data for
   */
  public getById(id: string): LookupResponse | undefined {
    return this.idCache.get(id);
  }
}

/**
 * Singleton cache for NEO requests.
 */
export const neowsCache = new NeowsCache({
  STORAGE_KEY: 'NEOWS_CACHE',
  DAILIES_KEY: 'NEOWS_DAILIES',
  WEEKLY_KEY: 'NEOWS_WEEKLY',
  MONTHLY_KEY: 'NEOWS_MONTHLY',
  ID_KEY: 'NEOWS_IDS',
});
