import { NeowsCloseApproachData } from './neows-close-approach-data';
import { NeowsEstimatedDiameter } from './neows-estimated-diameter';
import { NeowsOrbitalData } from './neows-orbital-data';

/**
 * The type definition for the lookup endpoint response.
 */
export interface NeowsResponse {
  links: {
    /**
     * The api called, with key.
     */
    self: string;
  };
  /**
   * The id passed
   */
  id: string;
  /**
   * The neo_reference_id attached to the given body
   */
  neo_reference_id: string;
  /**
   * The name of the body
   */
  name: string;
  /**
   * ???
   */
  designation?: string;
  /**
   * tThe NASA JPL url for more information
   */
  nasa_jpl_url: string;
  /**
   * ???
   */
  absolute_magnitude_h: number;
  estimated_diameter: {
    kilometers: NeowsEstimatedDiameter;
    meters: NeowsEstimatedDiameter;
    miles: NeowsEstimatedDiameter;
    feet: NeowsEstimatedDiameter;
  };
  /**
   * If the asteroid is potentially hazardous
   */
  is_potentially_hazardous_asteroid: boolean;
  /**
   * Close orbital approach data for NEO's
   */
  close_approach_data: Array<NeowsCloseApproachData>;
  /**
   * Advanced orbital data
   */
  orbitalData?: NeowsOrbitalData;
  /**
   * ???
   */
  is_sentry_object: boolean;
}
