import { getProjectsByTarget } from './get-projects-by-target';
import { ProjectGraph } from '@nrwl/devkit';

describe('getProjectsByTarget', () => {
  const BASE_GRAPH: ProjectGraph = {
    nodes: {
      'my-project': {
        name: 'my-project',
        type: 'app',
        data: {
          targets: {
            'my-target': {},
          },
        },
      },
      'my-project-2': {
        name: 'my-project',
        type: 'app',
        data: {
          targets: {
            'my-target': {},
          },
        },
      },
      'my-lib': {
        name: 'my-lib',
        type: 'lib',
        data: {
          targets: {
            'my-other-target': {},
          },
        },
      },
    },
    // Provided for type-completion, but not used
    dependencies: {},
  };

  it('returns empty if given nothing', () => {
    expect(
      getProjectsByTarget({
        graph: undefined as unknown as ProjectGraph,
        target: 'my-target',
      })
    ).toEqual([]);
  });

  it('returns empty if given empty array', () => {
    expect(
      getProjectsByTarget({
        graph: { ...BASE_GRAPH, nodes: {} },
        target: 'my-target',
      })
    ).toEqual([]);
  });

  it('returns projects with target', () => {
    expect(
      getProjectsByTarget({
        graph: { ...BASE_GRAPH },
        target: 'my-target',
      })
    ).toEqual(['my-project', 'my-project-2']);
  });
});
