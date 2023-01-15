import { API_KEY } from '@chrome-neo-plus/common';
import { FeedRequest } from '../models/feed-request';
import { FeedResponse } from '../models/feed-response';
import { DateTime } from 'luxon';

/**
 * Returns the feed of NEOWs for the given date range.
 * https://api.nasa.gov/neo/rest/v1/feed?start_date=START_DATE&end_date=END_DATE&api_key=API_KEY
 *
 * @param params the search param requests
 */
export async function getNeowsFeed(params: FeedRequest): Promise<FeedResponse> {
  const url = new URL('https://api.nasa.gov/neo/rest/v1/feed');
  url.searchParams.append('api_key', API_KEY);

  if (params.start_date)
    url.searchParams.append('start_date', params.start_date);
  if (params.end_date) url.searchParams.append('end_date', params.end_date);

  const res = await fetch(url.toString()).then((res) => {
    if (res.ok) return res.json();
    throw new Error(res.statusText);
  });

  return res;
}

/**
 * Returns the current week's feed of NEOWs. This should be the default data load
 * for the app.
 *
 * @param params the search param request
 */
export async function getThisWeekNeowsFeed(
  params: Pick<FeedRequest, 'api_key'>
): Promise<FeedResponse> {
  return getNeowsFeed({
    ...params,
    start_date: DateTime.now().startOf('week').toFormat('yyyy-MM-dd'),
    end_date: DateTime.now().endOf('week').toFormat('yyyy-MM-dd'),
  });
}

/**
 * Returns the current day's feed of NEOWs.
 *
 * @param params the search param request
 */
export async function getDailyNeowsFeed(
  params: Pick<FeedRequest, 'api_key'>
): Promise<FeedResponse> {
  return getNeowsFeed({
    ...params,
    start_date: DateTime.now().toFormat('yyyy-MM-dd'),
    end_date: DateTime.now().toFormat('yyyy-MM-dd'),
  });
}

/**
 * Returns the current month's feed of NEOWs.
 *
 * @param params the search param request
 */
export async function getMonthlyNeowsFeed(
  params: Pick<FeedRequest, 'api_key'>
): Promise<FeedResponse> {
  return getNeowsFeed({
    ...params,
    start_date: DateTime.now().startOf('month').toFormat('yyyy-MM-dd'),
    end_date: DateTime.now().endOf('month').toFormat('yyyy-MM-dd'),
  });
}
