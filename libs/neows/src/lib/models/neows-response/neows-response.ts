import { LookupCloseApproachData } from './lookup-close-approach-data';
import { LookupEstimatedDiameter } from './lookup-estimated-diameter';
import { LookupOrbitalData } from './lookup-orbital-data';

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
    kilometers: LookupEstimatedDiameter;
    meters: LookupEstimatedDiameter;
    miles: LookupEstimatedDiameter;
    feet: LookupEstimatedDiameter;
  };
  /**
   * If the asteroid is potentially hazardous
   */
  is_potentially_hazardous_asteroid: boolean;
  /**
   * Close orbital approach data for NEO's
   */
  close_approach_data: Array<LookupCloseApproachData>;
  /**
   * Advanced orbital data
   */
  orbitalData?: LookupOrbitalData;
  /**
   * ???
   */
  is_sentry_object: boolean;
}
