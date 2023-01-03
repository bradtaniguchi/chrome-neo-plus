// import CircularProgress from '@mui/material/CircularProgress';
// import Link from '@mui/material/Link';
// import Typography from '@mui/material/Typography';
import { DateTime } from 'luxon';
import { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import ApodImage from '../../components/apod-image/apod-image';
import { useApod } from '../../hooks';
import { GetWithDateParams } from '../../models/apod-request-params';

export interface ApodPageProps {
  /**
   * Optional date param that can be used to override the
   * route param.
   *
   * Primarily useful for prototyping.
   */
  date?: string;
}

// TODO: temp
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const Box = (props: any) => <div>{props.children}</div>;

/**
 * Page that displays the APOD image of the day, based on the `date` route param.
 *
 * Works with the `ApodListPage` to display a given APOD.
 *
 * @param props ApodPageProps
 */
export function ApodPage(props: ApodPageProps) {
  const { date: paramDate } = useParams<Pick<GetWithDateParams, 'date'>>();
  const { date: propDate } = props;
  const date = propDate ?? paramDate ?? '';

  const dateTime = useMemo(
    () => DateTime.fromFormat(date, 'yyyy-MM-dd'),
    [date]
  );
  const apodRequest = useMemo(
    () =>
      ({
        // not passing a date will error out as it isn't a valid param,
        // this is expected
        date: dateTime.isValid ? dateTime.toFormat('yyyy-MM-dd') : undefined,
      } as GetWithDateParams),
    [dateTime]
  );

  const { loading, apodResponse, error } = useApod(apodRequest);

  if (!dateTime.isValid)
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div>
          An invalid date provided "{date}", expected format: yyyy-mm-dd
        </div>
      </Box>
    );
  if (loading)
    return (
      <Box sx={{ display: 'flex' }}>
        {/* <CircularProgress /> */}
        loading...
      </Box>
    );
  if (error)
    return (
      <div title={JSON.stringify(error, null, 2)}>Oops there was an error!</div>
    );
  if (!apodResponse) return <div>No APOD found</div>;
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
      }}
      p={2}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'center',
        }}
      >
        {/* style={{
            height: '100%',
            width: '100%',
            maxWidth: '300px',
          }} */}
        <ApodImage {...apodResponse} />
      </Box>
      <div>
        <h3>{apodResponse.title}</h3>
        <p>{apodResponse.explanation}</p>
      </div>
      <div>
        <a href={apodResponse.hdurl}>HD Image</a>
      </div>
    </Box>
  );
}

export default ApodPage;
