import { API_KEY } from '@chrome-neo-plus/common';
import { FeedRequest } from '../models/feed-request';
import { FeedResponse } from '../models/feed-response';
import { DateTime } from 'luxon';
import { neowsCache } from './neows-cache';
import { getWeeklyBlocks } from './get-weekly-blocks';
import { combineMonthlyResponses } from './combine-monthy-responses';

/**
 * Returns the feed of NEOWs for the given date range.
 * https://api.nasa.gov/neo/rest/v1/feed?start_date=START_DATE&end_date=END_DATE&api_key=API_KEY
 *
 * @param params the search param requests
 */
export async function getNeowsFeed(
  params: FeedRequest & { noCache?: boolean }
): Promise<FeedResponse> {
  const url = new URL('https://api.nasa.gov/neo/rest/v1/feed');
  url.searchParams.append('api_key', API_KEY);

  if (params.start_date)
    url.searchParams.append('start_date', params.start_date);
  if (params.end_date) url.searchParams.append('end_date', params.end_date);

  const res = await fetch(url.toString()).then((res) => {
    if (res.ok) return res.json() as Promise<FeedResponse>;
    throw new Error(res.statusText);
  });

  neowsCache.setMultipleById(Object.values(res.near_earth_objects).flat());

  // TODO: add "period" generic request check
  return res;
}

/**
 * Returns the current week's feed of NEOWs.
 *
 * @param params The params to use for the request
 * @param params.noCache Whether to skip the cache and fetch from the API
 */
export async function getThisWeekNeowsFeed(params?: {
  noCache?: boolean;
}): Promise<FeedResponse> {
  const cachedWeekly = neowsCache.getWeekly(
    DateTime.now().weekNumber,
    DateTime.now().year
  );

  if (cachedWeekly && !params?.noCache) return cachedWeekly;

  const res = await getNeowsFeed({
    start_date: DateTime.now().startOf('week').toFormat('yyyy-MM-dd'),
    end_date: DateTime.now().endOf('week').toFormat('yyyy-MM-dd'),
  });

  neowsCache.setWeekly({
    week: DateTime.now().weekNumber,
    year: DateTime.now().year,
    res,
  });

  return res;
}

/**
 * Returns the current day's feed of NEOWs.
 *
 * @param params The params to use for the request
 * @param params.noCache Whether to skip the cache and fetch from the API
 */
export async function getDailyNeowsFeed(params?: {
  noCache?: boolean;
}): Promise<FeedResponse> {
  const cachedDaily = neowsCache.getDaily(
    DateTime.now().toFormat('yyyy-MM-dd')
  );

  if (cachedDaily && !params?.noCache) return cachedDaily;

  const res = await getNeowsFeed({
    start_date: DateTime.now().toFormat('yyyy-MM-dd'),
    end_date: DateTime.now().toFormat('yyyy-MM-dd'),
  });

  neowsCache.setDaily({
    date: DateTime.now().toFormat('yyyy-MM-dd'),
    res,
  });

  return res;
}

/**
 * Returns the current month's feed of NEOWs.
 *
 * Due to the API being limited to 7 days, this will make multiple http
 * request calls.
 *
 * @param params The params to use for the request
 * @param params.noCache Whether to skip the cache and fetch from the API
 */
export async function getMonthlyNeowsFeed(params?: {
  noCache?: boolean;
}): Promise<Omit<FeedResponse, 'links'>> {
  const cachedMonthly = neowsCache.getMonthly(
    DateTime.now().month,
    DateTime.now().year
  );

  if (cachedMonthly && !params?.noCache) return cachedMonthly;

  const weeklyBlocks = getWeeklyBlocks(DateTime.now());

  const responses = await Promise.all(
    weeklyBlocks.map(({ start_date, end_date }) =>
      getNeowsFeed({
        start_date: start_date.toFormat('yyyy-MM-dd'),
        end_date: end_date.toFormat('yyyy-MM-dd'),
      })
    )
  );

  const res = combineMonthlyResponses(responses);

  neowsCache.setMonthly({
    month: DateTime.now().month,
    year: DateTime.now().year,
    res,
  });

  return res;
}
