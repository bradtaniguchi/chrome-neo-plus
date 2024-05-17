import { NeowsResponse } from './neows-response/neows-response';

/**
 * The top level response from the feed.
 * URL example:
 * ```
 * https://api.nasa.gov/neo/rest/v1/feed?start_date=START_DATE&end_date=END_DATE&api_key=API_KEY
 * ```
 */
export interface FeedResponse {
  /**
   * This is not provided for monthly requests
   */
  links?: {
    /**
     * The next day chunk
     */
    next: string;
    /**
     * The previous day chunk
     */
    prev: string;
    /**
     * The current day chunk
     */
    self: string;
  };
  /**
   * The number of elements in this query
   */
  element_count: number;
  /**
   * A record, where the key is the day in format:
   * YYYY-MM-DD with the array of lookups
   */
  near_earth_objects: Record<string, Array<NeowsResponse>>;
}
