import { Card, Spinner } from 'flowbite-react';
import { DateTime } from 'luxon';
import { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import ApodImage from '../../components/apod-image/apod-image';
import { useApod } from '../../hooks/use-apod';
import { GetWithStartAndEndDatesParams } from '../../models/apod-request-params';

/**
 * The ApodListPage lists all the given APODs for the given date range.
 */
export interface ApodListPageProps {
  /**
   * The starting date, can be used to override the query param.
   */
  startDate?: string;
  /**
   * The starting date, can be used to override the query param.
   */
  endDate?: string;
}

/**
 *
 * @param props ApodListPageProps
 */
export function ApodListPage(props: ApodListPageProps) {
  const { startDate: propsStartDate, endDate: propsEndDate } = props;
  const { end_date: paramEndDate, start_date: paramStartDate } =
    useParams<Pick<GetWithStartAndEndDatesParams, 'start_date' | 'end_date'>>();

  const startDate = useMemo(() => {
    const date = propsStartDate ?? paramStartDate;
    if (!date) return DateTime.local().minus({ day: 5 });
    const dateTime = DateTime.fromFormat(date, 'yyyy-MM-dd');
    if (dateTime.startOf('day') <= DateTime.local().startOf('day'))
      // if the date is in the past, return it
      return dateTime;

    // otherwise, return the current date as it can't be in the future
    return DateTime.local();
  }, [propsStartDate, paramStartDate]);

  const endDate = useMemo(() => {
    const date = propsEndDate ?? paramEndDate;
    if (!date) return DateTime.local();
    const dateTime = DateTime.fromFormat(date, 'yyyy-MM-dd');
    if (dateTime.startOf('day') <= DateTime.local().startOf('day'))
      // if the date is in the past, return it
      return dateTime;
    // otherwise, return the current date as it can't be in the future
    return DateTime.local();
  }, [propsEndDate, paramEndDate]);

  const apodRequest = useMemo(
    () =>
      ({
        start_date: startDate.isValid
          ? startDate.toFormat('yyyy-MM-dd')
          : undefined,
        end_date: endDate.isValid ? endDate.toFormat('yyyy-MM-dd') : undefined,
      } as GetWithStartAndEndDatesParams),
    [startDate, endDate]
  );

  const { loading, apodResponse, error } = useApod(apodRequest);

  if (!startDate.isValid || !endDate.isValid)
    return (
      <Card className="flex flex-col items-center justify-center">
        <div>
          An invalid date provided "{startDate.toString()}", expected format:
          yyyy-mm-dd
        </div>
      </Card>
    );
  if (loading)
    return (
      <Card className="flex flex-col items-center justify-center">
        <Spinner color="info" aria-label="Info spinner example" />
      </Card>
    );
  if (error)
    return (
      <div title={JSON.stringify(error, null, 2)}>Oops there was an error!</div>
    );
  if (!apodResponse) return <div>No APODs found</div>;
  return (
    <ul className="flex flex-col items-center justify-center gap-2">
      {apodResponse.map((apod) => (
        <li key={apod.date}>
          <Card className="flex max-w-3xl flex-col items-center justify-center">
            <ApodImage {...apod} />
            <div>
              <h3>{apod.title}</h3>
              <p>{apod.explanation}</p>
            </div>
            <div>
              {/* TODO: make anchor tag */}
              <a href={apod.hdurl}>HD Image</a>
            </div>
          </Card>
        </li>
      ))}
    </ul>
  );
}

export default ApodListPage;
