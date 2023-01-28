import { CalendarIcon } from '@heroicons/react/24/solid';
import { Card } from 'flowbite-react';
import { useNeos } from '../hooks/use-neos';
import { CommonValueWrapper } from './common-value-wrapper';

/**
 * The monthly overview component is shown within the
 * overview, displaying month metrics.
 *
 * @param props The props for the monthly overview component.
 * @param props.date The day to display metrics for, defaults to today.
 * Should be in yyyy-MM-dd format.
 */
export function MonthlyOverview(props: { date?: string }) {
  const { date } = props;
  const { error, loading, neosResponse } = useNeos({
    requestType: 'monthly',
    date,
  });
  return (
    <Card className="dark:bg-slate-800 dark:text-white">
      <div className="flex flex-row justify-between text-center">
        <div className="flex flex-row gap-1">
          <CalendarIcon className="w-5" />
          <h3>Monthly</h3>
        </div>
        <CommonValueWrapper loading={loading} error={error}>
          <div>{neosResponse?.element_count ?? '???'}</div>
        </CommonValueWrapper>
      </div>
    </Card>
  );
}
