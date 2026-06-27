import { NeoDashboard } from '../neo-dashboard';

export interface ViewMonthlyProps {
  /**
   * The date to display metrics for.
   *
   * Should be in format yyyy-MM-dd
   */
  date?: string;
}

/**
 * Page wrapper for monthly timescale view.
 * Delegated to the consolidated NeoDashboard component.
 */
export function ViewMonthly(props: ViewMonthlyProps) {
  return <NeoDashboard timescale="monthly" date={props.date} />;
}
