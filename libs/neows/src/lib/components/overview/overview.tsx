import { DailyOverview } from './daily-overview';
import { MonthlyOverview } from './monthly-overview';
import { WeeklyOverview } from './weekly-overview';

export interface OverviewProps {
  /**
   * The day we are to display for. All metrics will be relative
   * to this day.
   *
   * Should be in format yyyy-MM-dd
   */
  date?: string;
}

/**
 * The overview component is a "dashboard-like" component that
 * should appear within a card, and manages the main display and functionality
 * of the NEOWs application.
 *
 * @param props The props for the overview component.
 */
export function Overview(props: OverviewProps) {
  const { date } = props;
  return (
    <div>
      <ul className="flex flex-col gap-1">
        <li>
          <DailyOverview date={date} />
        </li>
        <li>
          <WeeklyOverview date={date} />
        </li>
        <li>
          <MonthlyOverview date={date} />
        </li>
      </ul>
    </div>
  );
}
