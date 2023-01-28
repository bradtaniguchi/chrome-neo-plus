import { ViewColumnsIcon } from '@heroicons/react/24/solid';
import { Card } from 'flowbite-react';
import { Link } from 'react-router-dom';
import { useNeos } from '../hooks/use-neos';
import { CommonValueWrapper } from './common-value-wrapper';

/**
 * The weekly overview component is shown within the
 * overview, displaying week metrics.
 *
 * @param props The props for the weekly overview component.
 * @param props.date The day to display metrics for, defaults to today.
 * Should be in yyyy-MM-dd format.
 */
export function WeeklyOverview(props: { date?: string }) {
  const { date } = props;
  const { error, loading, neosResponse } = useNeos({
    requestType: 'weekly',
    date,
  });
  return (
    <Link to={'neows/weekly'}>
      <Card className="dark:bg-slate-800 dark:text-white">
        <div className="flex flex-row justify-between text-center">
          <div className="flex flex-row gap-1">
            <ViewColumnsIcon className="w-5" />
            <h3>Weekly</h3>
          </div>
          <CommonValueWrapper loading={loading} error={error}>
            <div>{neosResponse?.element_count ?? '???'}</div>
          </CommonValueWrapper>
        </div>
      </Card>
    </Link>
  );
}
