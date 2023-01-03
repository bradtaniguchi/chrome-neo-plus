/**
 * Represents an APOD response from the API.
 */
export interface ApodResponse {
  /**
   * Copyright if image is not public domain
   */
  copyright?: string;
  /**
   * The date for this image
   * format: YYYY-MM-DD
   */
  date: string;
  /**
   * Explanation of the image
   */
  explanation: string;
  /**
   * hd-url image url
   */
  hdurl: string;
  /**
   * The media type
   * ex: 'image'
   */
  media_type: 'image' | 'video' | string;
  /**
   * Service version,
   * currently 'v1'
   */
  service_version: string;
  /**
   * Image title
   * ex: 'Southern Cross over Chilean Volcano'
   */
  title: string;
  /**
   * The url of the lower-res image/video
   * ex: 'https://apod.nasa.gov/apod/image/2101/SouthernCross_Slovinsky_960.jpg'
   */
  url: string;
}
