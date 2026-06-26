import { NeoDashboard } from '../neo-dashboard';

export interface ViewDailyProps {
  /**
   * The day we are to display for. All metrics will be relative
   * to this day.
   *
   * Should be in format yyyy-MM-dd
   */
  date?: string;
  /**
   * The mode to display the data in, defaults to size
   */
  mode?: 'size' | 'distance';
}

/**
 * Page wrapper for daily timescale view.
 * Delegated to the consolidated NeoDashboard component.
 */
export function ViewDaily(props: ViewDailyProps) {
  return <NeoDashboard timescale="daily" date={props.date} />;
}
