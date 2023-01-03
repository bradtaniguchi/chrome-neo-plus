/**
 * Base apod-request-params, available
 * for all request types
 */
export type WithThumbs = {
  /**
   * Return the URL of video thumbnail. If an APOD is not a video, this parameter is ignored.
   */
  thumbs?: boolean;
};

/**
 * apod-request-param type
 */
export type GetWithDateParams = {
  /**
   * The date of the APOD image to retrieve
   * defaults to today
   * format: YYYY-MM-DD
   */
  date: string;
} & WithThumbs;

/**
 * Type-guard for apod-request-param GetWithDate.
 *
 * @param params
 * @see GetWithDateParams
 */
export const isGetWithDate = (params: unknown): params is GetWithDateParams =>
  !!params &&
  typeof params === 'object' &&
  typeof (params as GetWithDateParams).date === 'string';

/**
 * apod-request-param type
 */
export type GetWithStartAndEndDatesParams = {
  /**
   * The start of a date range, when requesting date for a range of dates.
   * Cannot be used with date.
   * format: YYYY-MM-DD
   */
  start_date: string;
  /**
   * The end of the date range, when used with start_date.
   * defaults to today
   * format: YYYY-MM-DD
   */
  end_date?: string;
} & WithThumbs;
export const isGetWithStartAndEndDates = (
  params: unknown
): params is GetWithStartAndEndDatesParams =>
  !!params &&
  typeof params === 'object' &&
  typeof (params as GetWithStartAndEndDatesParams).start_date === 'string' &&
  typeof (params as GetWithStartAndEndDatesParams).end_date === 'string';

/**
 * apod-request-param type
 */
export type GetWithCountParams = {
  /**
   * If this is specified then count randomly chosen images will be returned.
   * Cannot be used with date or start_date and end_date.
   */
  count: number;
} & WithThumbs;

/**
 * Type-guard for apod-request-param GetWithCount.
 *
 * @param params
 */
export const isGetWithCount = (params: unknown): params is GetWithCountParams =>
  !!params &&
  typeof params === 'object' &&
  typeof (params as GetWithCountParams).count === 'number' &&
  (params as GetWithCountParams).count >= 0 &&
  !isGetWithDate(params) &&
  !isGetWithStartAndEndDates(params);

/**
 * Union type representing all possible ApodRequestsParams
 */
export type ApodRequestParams =
  | GetWithDateParams
  | GetWithStartAndEndDatesParams
  | GetWithCountParams;
