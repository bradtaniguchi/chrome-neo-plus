import { useMemo } from 'react';
import { Chart } from 'react-charts';

/**
 * Chart shown on the view-daily page
 */
export function ViewDailyChart(props: {
  // TODO: replace with daily response type
  dailyResponse: any;
}) {
  const data = useMemo(() => {

    return [];
  }, []);
  const axes = useMemo(() => {}, []);

  return  <Chart data={data} axes={axes} />
}
