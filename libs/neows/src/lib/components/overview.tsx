export interface OverviewProps {
  /**
   * The day we are to display for. All metrics will be relative
   * to this day.
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
      <ul>
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
 * The daily overview component is shown within the
 * overview, displaying day metrics.
 *
 * @param props The props for the daily overview component.
 */
export function DailyOverview(props: OverviewProps) {
  return <div></div>;
}

/**
 * The weekly overview component is shown within the
 * overview, displaying week metrics.
 *
 * @param props The props for the weekly overview component.
 */
export function WeeklyOverview(props: OverviewProps) {
  return <div></div>;
}

/**
 * The monthly overview component is shown within the
 * overview, displaying month metrics.
 *
 * @param props The props for the monthly overview component.
 */
export function MonthlyOverview(props: OverviewProps) {
  return <div></div>;
}
