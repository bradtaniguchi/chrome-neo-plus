import { Card, Spinner } from 'flowbite-react';
import { Link } from 'react-router-dom';
import {
  ClockIcon,
  CalendarIcon,
  ViewColumnsIcon,
} from '@heroicons/react/24/solid';
import { useNeos } from '../hooks/use-neos';
import { PropsWithChildren } from 'react';
export interface OverviewProps {
  /**
   * The day we are to display for. All metrics will be relative
   * to this day.
   *
   * Should be in format yyyy-MM-dd
   */
  day?: string;
}

/**
 * The overview component is a "dashboard-like" component that
 * should appear within a card, and manages the main display and functionality
 * of the NEOWs application.
 *
 * @param props The props for the overview component.
 */
export function Overview(props: OverviewProps) {
  const { day } = props;
  return (
    <div>
      <ul className="flex flex-col gap-1">
        <li>
          <DailyOverview day={day} />
        </li>
        <li>
          <WeeklyOverview day={day} />
        </li>
        <li>
          <MonthlyOverview day={day} />
        </li>
      </ul>
    </div>
  );
}

/**
 * This component "wraps" any nested overview component. This manages
 * displaying errors and loading states automatically.
 *
 * @param props The props for the common overview wrapper.
 * @param props.loading Whether or not the overview is loading.
 * @param props.error The error that occurred, if any.
 */
export function CommonValueWrapper(
  props: PropsWithChildren<{ loading?: boolean; error?: unknown }>
) {
  const { loading, error, children } = props;
  if (loading)
    return (
      <div className="flex flex-col items-center justify-center ">
        <Spinner color="info" aria-label="Loading data" />
      </div>
    );
  if (error)
    return (
      <div title={JSON.stringify(error, null, 2)}>Oops there was an error!</div>
    );
  return <div>{children}</div>;
}

/**
 * The daily overview component is shown within the
 * overview, displaying day metrics.
 *
 * @param props The props for the daily overview component.
 */
export function DailyOverview(props: OverviewProps) {
  const { error, loading, neosResponse } = useNeos('daily');
  return (
    <Link to={'neows/daily'}>
      <Card>
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

/**
 * The weekly overview component is shown within the
 * overview, displaying week metrics.
 *
 * @param props The props for the weekly overview component.
 */
export function WeeklyOverview(props: OverviewProps) {
  const { error, loading, neosResponse } = useNeos('weekly');
  return (
    <Link to={'neows/weekly'}>
      <Card>
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

/**
 * The monthly overview component is shown within the
 * overview, displaying month metrics.
 *
 * @param props The props for the monthly overview component.
 */
export function MonthlyOverview(props: OverviewProps) {
  // TODO: get a calendar component
  return (
    <Card>
      <div className="flex flex-row justify-between text-center">
        <div className="flex flex-row gap-1">
          <CalendarIcon className="w-5" />
          <h3>Monthly</h3>
        </div>
        <div>
          {/* TODO: get dynamically */}
          1234
        </div>
      </div>
    </Card>
  );
}
