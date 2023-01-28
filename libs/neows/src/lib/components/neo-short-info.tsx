import { Card } from 'flowbite-react';

/**
 * Short info about a single NEO object.
 *
 * Previous version:
 * https://github.com/bradtaniguchi/chrome-neo/blob/master/app/components/interesting-neo/interesting-neo.view.html
 *
 * Need to show the following properties:
 * - name/title
 * - ref ID
 * - if its dangerous
 * - next pass time
 * - pass distance
 * - link to JPL page
 *
 * Add a "help" for each property.
 */
export function NeoShortInfo() {
  return (
    <Card className="dark:bg-slate-800 dark:text-white">
      <p>info goes here</p>
    </Card>
  );
}
