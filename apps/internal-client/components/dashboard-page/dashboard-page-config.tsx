import { BaseConfig } from '@nx-template/common-react';
import { Card } from 'flowbite-react';
import { memo } from 'react';

export const DashboardPageConfig = memo(function DashboardPageConfig({
  config,
}: {
  config: BaseConfig;
}) {
  return (
    <Card>
      <h5 className="text-lg dark:text-white">config.json</h5>
      <div>
        <div className="rounded outline outline-gray-400">
          <pre className="m-0 overflow-x-auto dark:bg-slate-800 dark:text-white">
            {JSON.stringify(config, null, 2)}
          </pre>
        </div>
      </div>
    </Card>
  );
});
