/**
 * Query param data for the feed API for the NeoWs API.
 * Example:
 * ```
 * https://api.nasa.gov/neo/rest/v1/feed?start_date=2015-09-07&end_date=2015-09-08&api_key=DEMO_KEY
 * ```
 */
export interface FeedRequest {
  /**
   * Starting data for asteroid search
   * Defaults to none
   * format: YYYY-MM-DD
   */
  start_date?: string;
  /**
   * Ending date for asteroid search
   * Defaults to 7 days after start_date
   * format: YYYY-MM-DD
   */
  end_date?: string;
  /**
   * api.nasa.gov key for expanded usage
   */
  api_key: string;
}
