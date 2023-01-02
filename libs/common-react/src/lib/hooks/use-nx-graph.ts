import { ProjectGraph } from '@nrwl/devkit';
import { useDebugValue, useEffect, useRef, useState } from 'react';
import { getNxGraph } from '../utils';

/**
 * Hook that can can be used to get the nx-graph file.
 *
 * @param params
 * @param params.path
 * @param params.overrides
 * @see getNxGraph
 */
export function useNxGraph(params?: {
  path?: string;
  overrides?: Partial<ProjectGraph>;
}) {
  const { path, overrides } = params ?? {};
  const mounted = useRef(false);
  const [nxGraphLoading, setNxGraphLoading] = useState<boolean>(false);
  const [nxGraphError, setNxGraphError] = useState<unknown>();
  const [nxGraph, setNxGraph] = useState<ProjectGraph>();

  useEffect(() => {
    if (!mounted.current) {
      setNxGraphLoading(true);
      getNxGraph(params)
        .then((config) => {
          setNxGraphLoading(false);
          setNxGraph(config);
        })
        .catch((err) => {
          setNxGraphLoading(false);
          if (!overrides) setNxGraphError(err);
        });
      mounted.current = true;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [path, overrides]);

  useDebugValue({ nxGraphLoading, nxGraphError, nxGraph });

  return { nxGraphLoading, nxGraphError, nxGraph };
}
