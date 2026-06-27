import { NeoDashboard } from '../neo-dashboard';

export interface ViewWeeklyProps {
  /**
   * The day we are to display for. All metrics will be relative
   * to this day.
   *
   * Should be in format yyyy-MM-dd
   */
  date?: string;
}

/**
 * Page wrapper for weekly timescale view.
 * Delegated to the consolidated NeoDashboard component.
 */
export function ViewWeekly(props: ViewWeeklyProps) {
  return <NeoDashboard timescale="weekly" date={props.date} />;
}
