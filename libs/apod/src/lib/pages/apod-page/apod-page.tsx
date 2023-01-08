// import CircularProgress from '@mui/material/CircularProgress';
// import Link from '@mui/material/Link';
// import Typography from '@mui/material/Typography';
import { Card, Spinner } from 'flowbite-react';
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
      <div className="flex flex-col items-center justify-center">
        <Card className="flex max-w-3xl flex-col items-center justify-center dark:bg-slate-800 dark:text-white">
          <div>
            An invalid date provided "{date}", expected format: yyyy-mm-dd
          </div>
        </Card>
      </div>
    );
  if (loading)
    return (
      <div className="flex flex-col items-center justify-center">
        <Card className="flex max-w-3xl flex-col items-center justify-center dark:bg-slate-800 dark:text-white">
          <Spinner color="info" aria-label="Info spinner example" />
        </Card>
      </div>
    );
  if (error)
    return (
      <div className="flex flex-col items-center justify-center">
        <Card className="flex max-w-3xl flex-col items-center justify-center dark:bg-slate-800 dark:text-white">
          <div title={JSON.stringify(error, null, 2)}>
            Oops there was an error!
          </div>
        </Card>
      </div>
      // <div title={JSON.stringify(error, null, 2)}>Oops there was an error!</div>
    );
  if (!apodResponse)
    return (
      <div className="flex flex-col items-center justify-center">
        <Card className="flex max-w-3xl flex-col items-center justify-center dark:bg-slate-800 dark:text-white">
          <div>No APOD found for date "{dateTime.toFormat('yyyy-MM-dd')}"</div>
        </Card>
      </div>
    );

  return (
    <div className="flex flex-col items-center justify-center">
      <Card className="flex max-w-3xl flex-col items-center justify-center dark:bg-slate-800 dark:text-white">
        <ApodImage {...apodResponse} />
        <div>
          <h3>{apodResponse.title}</h3>
          <p>{apodResponse.explanation}</p>
        </div>
        <div>
          <a href={apodResponse.hdurl}>HD Image</a>
        </div>
      </Card>
    </div>
  );
}

export default ApodPage;
