import { ClockIcon } from '@heroicons/react/24/solid';
import { Card } from 'flowbite-react';
import { Link } from 'react-router-dom';
import { useNeos } from '../hooks/use-neos';
import { CommonValueWrapper } from './common-value-wrapper';

/**
 * The daily overview component is shown within the
 * overview, displaying day metrics.
 *
 * @param props The props for the daily overview component.
 * @param props.date The day to display metrics for, defaults to today.
 * Should be in yyyy-MM-dd format.
 */
export function DailyOverview(props: { date?: string }) {
  const { date } = props;
  const { error, loading, neosResponse } = useNeos({
    requestType: 'daily',
    date,
  });
  return (
    <Link to={'neows/daily'}>
      <Card className="dark:bg-slate-800 dark:text-white">
        <div className="flex flex-row justify-between text-center">
          <div className="flex flex-row gap-1">
            <ClockIcon className="w-5" />
            <h3>Daily</h3>
          </div>
          <CommonValueWrapper loading={loading} error={error}>
            <div>{neosResponse?.element_count ?? '???'}</div>
          </CommonValueWrapper>
        </div>
      </Card>
    </Link>
  );
}
