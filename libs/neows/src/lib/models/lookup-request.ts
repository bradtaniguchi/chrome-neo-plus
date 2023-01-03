/**
 * Query+Route param data for the lookup api
 * Example:
 * ```
 * https://api.nasa.gov/neo/rest/v1/neo/3542519?api_key=DEMO_KEY
 * ```
 */
export interface LookupRequest {
  /**
   * Asteroid SPK-ID that correlates to the NASA JPL small body
   */
  asteroid_id: string;
  /**
   * api.nasa.gov key for expanded usage
   */
  api_key: string;
}
