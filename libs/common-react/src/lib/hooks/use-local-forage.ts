/* eslint-disable react-hooks/rules-of-hooks */
import { createInstance } from 'localforage';
import { createContext, useMemo } from 'react';

/**
 * Hook that creates a localForage instance and returns it.
 * This should be used for one-off instance creations at the top level of the
 * app. It should not be used for common updates to localStorage.
 *
 * Instead use the `localForageContextFactory` to create a context that
 * can be used over time.
 *
 * For more information see:
 * https://github.com/localForage/localForage
 *
 * @param options the localforage options we pass to createInstance
 *
 * @see localForageContextFactory
 * @unstable
 */
export function useLocalForage(options: LocalForageOptions) {
  return useMemo(() => createInstance(options), [options]);
}

/**
 * Creates a localForageContext, that can be used across the entire app.
 *
 * This should be used to create a single high-level instance of localForage
 * that can be used within components.
 *
 * For more information see:
 * https://github.com/localForage/localForage
 *
 * @see useLocalForage
 * @unstable
 */
export function localForageContextFactory(options: LocalForageOptions = {}) {
  return createContext(createInstance(options));
}
