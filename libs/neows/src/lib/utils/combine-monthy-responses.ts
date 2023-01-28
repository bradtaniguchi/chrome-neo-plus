import { FeedResponse } from '../models';

/**
 * Combines multiple monthly responses into one. This is required
 * as the API only supports up to 7 day requests periods, so we make
 * multiple requests, and then combine them into one.
 *
 * @param responses The responses to combine
 */
export function combineMonthlyResponses(
  responses: FeedResponse[]
): Omit<FeedResponse, 'links'> {
  return responses.reduce(
    (acc, response) => {
      acc.element_count += response.element_count;
      Object.entries(response.near_earth_objects).forEach(([key, value]) => {
        if (acc.near_earth_objects[key]) {
          acc.near_earth_objects[key].push(...value);
        } else {
          acc.near_earth_objects[key] = value;
        }
      });
      return acc;
    },
    {
      element_count: 0,
      near_earth_objects: {},
    } as Omit<FeedResponse, 'links'>
  );
}
