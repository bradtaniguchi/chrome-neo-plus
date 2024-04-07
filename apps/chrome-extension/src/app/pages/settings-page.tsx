import { neowsCache } from '@chrome-neo-plus/neows';
import { Button, Card } from 'flowbite-react';
import { useCallback, useReducer } from 'react';

/**
 * The settings page will allow users to update their settings for the app.
 */
export default function SettingsPage() {
  // wonky way to force refresh, since the neowsCache isn't within react.
  const [, forceUpdate] = useReducer((x) => x + 1, 0);

  const handleDeleteCacheHistory = useCallback(() => {
    neowsCache.clear();
    forceUpdate();
  }, []);

  const {
    dailyCacheSize,
    localStorageSize,
    monthlyCacheSize,
    totalInMemorySize,
    weeklyCacheSize,
  } = neowsCache.size();

  return (
    <Card className="dark:bg-slate-800 dark:text-white">
      <h1>Settings</h1>
      <p>
        This extension relies on local caches which can be cleared if things
        aren't working correctly.
      </p>
      <div>
        <Button color="failure" onClick={handleDeleteCacheHistory}>
          Delete Cache History
        </Button>
        {/* list out cache sizes  */}
        <table>
          <thead>
            <tr>
              <th>Cache Type</th>
              <th>Number of entries</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Daily</td>
              <td>{dailyCacheSize}</td>
            </tr>
            <tr>
              <td>Weekly</td>
              <td>{weeklyCacheSize}</td>
            </tr>
            <tr>
              <td>Monthly</td>
              <td>{monthlyCacheSize}</td>
            </tr>
            <tr>
              <td>Local Storage</td>
              <td>{localStorageSize}</td>
            </tr>
            <tr>
              <td>Total In Memory</td>
              <td>{totalInMemorySize}</td>
            </tr>
            <tr>
              <td>Total In Memory</td>
              <td>{totalInMemorySize}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </Card>
  );
}
