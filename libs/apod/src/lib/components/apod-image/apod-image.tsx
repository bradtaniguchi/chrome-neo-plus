import { ApodResponse } from '../../models/apod-response';

export type ApodImageProps = Partial<ApodResponse>;

/**
 * Component that renders the Astronomy Picture of the Day.
 *
 * Browse the list of images here:
 * https://www.nasa.gov/multimedia/imagegallery/iotd.html
 *
 * @param props component props
 */
export function ApodImage(props: ApodImageProps) {
  return (
    <img
      src={props.url}
      aria-label={props.explanation}
      title={props.title}
      alt={props.title}
    />
  );
}

export default ApodImage;
