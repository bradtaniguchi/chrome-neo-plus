import { ApodResponse } from '@chrome-neo-plus/apod-common';
import Box from '@mui/material/Box';
import { SxProps, Theme } from '@mui/material/styles';

/* eslint-disable-next-line */
export interface ApodImageProps extends Partial<ApodResponse> {
  sx: SxProps<Theme>;
}

/**
 * Component that renders the Astronomy Picture of the Day.
 *
 * Browse the list of images here:
 * https://www.nasa.gov/multimedia/imagegallery/iotd.html
 *
 * @see ApodImageProps
 */
export function ApodImage(props: ApodImageProps) {
  return (
    <Box
      sx={props.sx}
      component="img"
      src={props.url}
      aria-label={props.explanation}
      title={props.title}
      alt={props.title}
    />
  );
}

export default ApodImage;
