/**
 * The close approach data for the given NEO, could be in the past/future
 */
export interface NeowsCloseApproachData {
  /**
   * The date of closest approach, in YYYY-MM-DD format
   * example: '1900-06-01'
   */
  close_approach_date: string;
  /**
   * The date and time of closest approach, in YYYY-MM-DD HH:MM format
   * example: '1900-Jun-01 16:40'
   */
  close_approach_date_full: string;
  /**
   * epoch date time of closest approach
   */
  epoch_date_close_approach: number;
  /**
   * Relative velocity data
   */
  relative_velocity: {
    /**
     * ex: '30.9364987254'
     */
    kilometers_per_second: string;
    /**
     * ex: '111371.3954112805'
     */
    kilometers_per_hour: string;
    /**
     * ex: '69201.8539987482'
     */
    miles_per_hour: string;
  };
  /**
   * The miss distance of the orbiting body
   */
  miss_distance: {
    /**
     * Distance in astronomical units
     * ex: '0.0445445654'
     */
    astronomical: string;
    /**
     * ???
     * ex: '17.3278359406'
     */
    lunar: string;
    /**
     * Distance in astronomical units
     * ex: '6663772.103915698'
     */
    kilometers: string;
    /**
     * Distance in miles
     * ex: '4140675.9796767124'
     */
    miles: string;
  };
  /**
   * The orbiting body,
   * Ex. Merc (Mercury), 'Earth
   *
   */
  orbiting_body: string;
}
