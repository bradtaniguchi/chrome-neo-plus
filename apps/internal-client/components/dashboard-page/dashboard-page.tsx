import { BaseConfig } from '@nx-template/common-react';
import { DashboardPageConfig } from './dashboard-page-config';
import { DashboardPageLinks } from './dashboard-page-links';
import { DashboardPageProjects } from './dashboard-page-projects';

export interface DashboardPageProps {
  config: BaseConfig;
  /**
   * The list of project keys/names that have a typedoc target
   */
  typedocProjects: string[];
}

/**
 * The dashboard page component.
 *
 * This is the main and only component that acts as a "project landing page"
 * in regards to compiled docs and helper tools.
 *
 * @param props DashboardPageProps
 */
export function DashboardPage(props: DashboardPageProps) {
  const { config, typedocProjects } = props;

  return (
    <div className="width-full p-3">
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 sm:grid-rows-2">
        <div>
          <DashboardPageConfig config={config} />
        </div>
        <div>
          <DashboardPageLinks />
        </div>
        <div>
          <DashboardPageProjects typedocProjects={typedocProjects} />
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;
