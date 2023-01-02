import { BaseConfig, getProjectsByTarget } from '@nx-template/common-react';
import { GetStaticPropsResult } from 'next';
import {
  DashboardPage,
  DashboardPageProps,
} from '../components/dashboard-page/dashboard-page';
import { loadNxGraph } from '../utils/load-nx-graph';

/**
 * The Main index landing page. Renders the dashboard page
 *
 * @param props DashboardPageProps
 */
export function Index(props: DashboardPageProps) {
  return <DashboardPage {...props} />;
}

export default Index;

/**
 * Returns the props for the index page.
 */
export async function getStaticProps(): Promise<
  GetStaticPropsResult<DashboardPageProps>
> {
  const config = (() => {
    const common = {
      sha: process.env.GITHUB_SHA ?? '',
      ref_type: process.env.GITHUB_REF_TYPE ?? '',
      date: new Date().toISOString(),
    };
    if (process.env.GITHUB_REF_TYPE === 'branch')
      return {
        ...common,
        branch: process.env.GITHUB_REF ?? '',
      };
    // Fallback just return tag, as branch release models usually are used.
    return {
      ...common,
      tag: process.env.GITHUB_REF ?? '',
    };
  })() as BaseConfig;

  const nxGraph = await loadNxGraph();

  const typedocProjects = getProjectsByTarget({
    graph: nxGraph,
    target: 'typedoc',
  });

  return {
    props: {
      config,
      typedocProjects,
    },
  };
}
