import { Card, Spinner } from 'flowbite-react';
import { useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import ApodImage from '../../components/apod-image/apod-image';
import { useApod } from '../../hooks/use-apod';
import { usePageDates } from '../../hooks/use-page-dates';
import { GetWithStartAndEndDatesParams } from '../../models/apod-request-params';
import { DATE_FORMAT } from '@chrome-neo-plus/common';

/**
 * Page that shows the entire list of APODs
 * If no dates are given, then this by default shows the current week's APODs.
 */
export function ApodListPage() {
  const [searchParams] = useSearchParams();
  const start_date = searchParams.get('start_date') ?? undefined;
  const end_date = searchParams.get('end_date') ?? undefined;

  const {
    startDateTime,
    endDateTime,
    previousStartDate,
    nextStartDate,
    previousEndDate,
    nextEndDate,
  } = usePageDates({
    initEndDate: end_date,
    initStartDate: start_date,
  });

  const apodRequest = useMemo(
    () =>
      ({
        start_date: startDateTime.toFormat(DATE_FORMAT),
        end_date: endDateTime.toFormat(DATE_FORMAT),
      } as GetWithStartAndEndDatesParams),
    [startDateTime, endDateTime]
  );

  const { loading, apodResponse, error } = useApod(apodRequest);

  if (!startDateTime.isValid || !endDateTime.isValid)
    return (
      <Card className="flex max-w-3xl flex-col items-center justify-center dark:bg-slate-800 dark:text-white">
        <div>
          An invalid date provided "{startDateTime.toString()}", expected
          format: yyyy-mm-dd
        </div>
      </Card>
    );
  if (loading)
    return (
      <Card className="flex max-w-3xl flex-col items-center justify-center dark:bg-slate-800 dark:text-white">
        <Spinner color="info" aria-label="Info spinner example" />
      </Card>
    );
  if (error)
    return (
      <div title={JSON.stringify(error, null, 2)}>Oops there was an error!</div>
    );
  if (!apodResponse) return <div>No APODs found</div>;
  return (
    <div>
      <ul className="flex flex-col items-center justify-center gap-2">
        {apodResponse.map((apod) => (
          <li key={apod.date}>
            <Card className="flex max-w-3xl flex-col items-center justify-center dark:bg-slate-800 dark:text-white">
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
      <div className="mt-2 flex flex-row justify-between">
        <Link
          to={(() => {
            const newSearchParams = new URLSearchParams(
              Array.from(searchParams.entries())
            );
            newSearchParams.set('start_date', previousStartDate);
            newSearchParams.set('end_date', previousEndDate);
            return newSearchParams.toString();
          })()}
        >
          Previous
        </Link>
        <Link
          to={(() => {
            const newSearchParams = new URLSearchParams(
              Array.from(searchParams.entries())
            );
            newSearchParams.set('start_date', nextStartDate);
            newSearchParams.set('end_date', nextEndDate);
            return newSearchParams.toString();
          })()}
        >
          Next
        </Link>
      </div>
    </div>
  );
}

export default ApodListPage;
