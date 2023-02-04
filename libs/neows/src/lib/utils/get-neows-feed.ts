import { API_KEY } from '@chrome-neo-plus/common';
import { FeedRequest } from '../models/feed-request';
import { FeedResponse } from '../models/feed-response';
import { DateTime } from 'luxon';
import { neowsCache } from './neows-cache';
import { getWeeklyBlocks } from './get-weekly-blocks';
import { combineMonthlyResponses } from './combine-monthly-responses';

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
 * Returns the current day's feed of NEOWs.
 *
 * @param params The params to use for the request
 * @param params.date The date to fetch the feed for
 * @param params.noCache Whether to skip the cache and fetch from the API
 */
export async function getDailyNeowsFeed(params?: {
  date?: string;
  noCache?: boolean;
}): Promise<FeedResponse> {
  const date = params?.date;
  const dateTime =
    date && DateTime.fromFormat(date, 'yyyy-MM-dd').isValid
      ? DateTime.fromFormat(date, 'yyyy-MM-dd')
      : DateTime.now();

  const dateTimeStr = dateTime.toFormat('yyyy-MM-dd');
  const cachedDaily = neowsCache.getDaily(dateTimeStr);

  if (cachedDaily && !params?.noCache) return cachedDaily;

  const cachedCurrentDailyRequest =
    neowsCache.getCurrentDailyRequest(dateTimeStr);

  const res = await (cachedCurrentDailyRequest
    ? cachedCurrentDailyRequest
    : neowsCache.setCurrentDailyRequest({
        date: dateTimeStr,
        res: getNeowsFeed({
          start_date: dateTimeStr,
          end_date: dateTimeStr,
        }),
      }));

  neowsCache.setDaily({
    date: dateTimeStr,
    res,
  });

  return res;
}

/**
 * Returns the current week's feed of NEOWs.
 *
 * @param params The params to use for the request
 * @param params.date The date to fetch the feed for
 * @param params.noCache Whether to skip the cache and fetch from the API
 */
export async function getThisWeekNeowsFeed(params?: {
  date?: string;
  noCache?: boolean;
}): Promise<FeedResponse> {
  const date = params?.date;

  const dateTime =
    date && DateTime.fromFormat(date, 'yyyy-MM-dd').isValid
      ? DateTime.fromFormat(date, 'yyyy-MM-dd')
      : DateTime.now();

  const cachedWeekly = neowsCache.getWeekly(dateTime.weekNumber, dateTime.year);

  if (cachedWeekly && !params?.noCache) return cachedWeekly;

  const cachedWeeklyRequest = neowsCache.getCurrentWeeklyRequests(
    dateTime.weekNumber,
    dateTime.year
  );

  const res = await (cachedWeeklyRequest
    ? cachedWeeklyRequest
    : getNeowsFeed({
        start_date: dateTime.startOf('week').toFormat('yyyy-MM-dd'),
        end_date: dateTime.endOf('week').toFormat('yyyy-MM-dd'),
      }));

  neowsCache.setWeekly({
    week: dateTime.weekNumber,
    year: dateTime.year,
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
 * @param params.date The date to fetch the feed for
 * @param params.noCache Whether to skip the cache and fetch from the API
 */
export async function getMonthlyNeowsFeed(params?: {
  date?: string;
  noCache?: boolean;
}): Promise<Omit<FeedResponse, 'links'>> {
  const date = params?.date;
  const dateTime =
    date && DateTime.fromFormat(date, 'yyyy-MM-dd').isValid
      ? DateTime.fromFormat(date, 'yyyy-MM-dd')
      : DateTime.now();

  const cachedMonthly = neowsCache.getMonthly(dateTime.month, dateTime.year);

  if (cachedMonthly && !params?.noCache) return cachedMonthly;

  const cachedMonthlyRequest = neowsCache.getCurrentMonthlyRequests({
    month: dateTime.month,
    year: dateTime.year,
  });

  const weeklyBlocks = getWeeklyBlocks(DateTime.now());

  if (cachedMonthlyRequest) {
    const res = await cachedMonthlyRequest;

    neowsCache.setMonthly({
      month: DateTime.now().month,
      year: DateTime.now().year,
      res,
    });

    return res;
  }

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
