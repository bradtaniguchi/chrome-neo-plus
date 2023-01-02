import { useState, useEffect, useDebugValue, useRef } from 'react';
import { BaseConfig } from '../types';
import { getConfig } from '../utils';

/**
 * Hook that can be used to get the config file.
 *
 * @param params the single param object
 * @param params.path the path to get the config from
 * @param params.overrides overrides for the config loading
 * @see getConfig
 * @see Config
 */
export function useConfig<AppConfig extends object>(params?: {
  path?: string;
  overrides?: Partial<BaseConfig & AppConfig>;
}) {
  const { path, overrides } = params ?? {};
  const mounted = useRef(false);
  const [configLoading, setConfigLoading] = useState<boolean>(false);
  const [configError, setConfigError] = useState<unknown>();
  const [config, setConfig] = useState<BaseConfig>();

  useEffect(() => {
    if (!mounted.current) {
      setConfigLoading(true);
      getConfig(params)
        .then((config) => {
          setConfigLoading(false);
          setConfig(config);
        })
        .catch((err) => {
          setConfigLoading(false);
          if (!overrides) setConfigError(err);
        });
      mounted.current = true;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [path, overrides]);

  useDebugValue({ configLoading, configError, config });

  return { configLoading, configError, config };
}
