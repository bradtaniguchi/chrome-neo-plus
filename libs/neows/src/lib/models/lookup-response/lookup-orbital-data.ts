export interface LookupOrbitalData {
  /**
   * ???
   */
  orbit_id: '24';
  /**
   * ???
   * in YYYY-MM-DD HH:MM format
   */
  orbit_determination_date: string;
  /**
   * Date first observed
   * in YYYY-MM-DD format
   */
  first_observation_date: string;
  /**
   * Last date observed.
   * in YYYY-MM-DD format
   */
  last_observation_date: string;
  /**
   * ???
   */
  data_arc_in_days: number;
  /**
   * ???
   */
  observations_used: number;
  /**
   * ???
   * string of number
   */
  orbit_uncertainty: string;
  /**
   * ???
   * ex: '.0160944'
   */
  minimum_orbit_intersection: string;
  /**
   * ???
   * ex: '8.149'
   */
  jupiter_tisserand_invariant: string;
  /**
   * ???
   * ex: '2459000.5'
   */
  epoch_osculation: string;
  /**
   * ???
   * ex: '.6758647649336718'
   */
  eccentricity: string;
  /**
   * ???
   * ex: '.6820991440997924'
   */
  semi_major_axis: string;
  /**
   * ???
   * ex: '12.59375211310295'
   */
  inclination: string;
  /**
   * ???
   * ex: '306.5383739332946'
   */
  ascending_node_longitude: string;
  /**
   * ???
   * ex: '205.7641373207782'
   */
  orbital_period: string;
  /**
   * ???
   * ex: '.2210923664113275'
   */
  perihelion_distance: string;
  /**
   * ???
   * ex: '195.6183173571407'
   */
  perihelion_argument: string;
  /**
   * ???
   * ex:'1.143105921788257'
   */
  aphelion_distance: string;
  /**
   * ???
   * ex: '2459037.634584693991'
   */
  perihelion_time: string;
  /**
   * ???
   * ex: '295.0302211847739'
   */
  mean_anomaly: string;
  /**
   * ???
   * ex: '1.749576017898465'
   */
  mean_motion: string;
  /**
   * ???
   * ex: 'J2000'
   */
  equinox: string;
  orbit_class: {
    /**
     * ???
     * ex: 'ATE'
     */
    orbit_class_type: string;
    /**
     * ???
     * ex: 'Near-Earth asteroid orbits similar to that of 2062 Aten'
     */
    orbit_class_description: string;
    /**
     * ???
     * ex: 'a (semi-major axis) < 1.0 AU; q (perihelion) > 0.983 AU'
     */
    orbit_class_range: string;
  };
}
