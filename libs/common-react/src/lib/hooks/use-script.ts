// largely taken from:
// https://stackoverflow.com/questions/34424845/adding-script-tag-to-react-jsx
import { useDebugValue, useEffect } from 'react';

/**
 * Options that could be passed to the userScript hook.
 */
export interface UseScriptOptions {
  /**
   * The url of the script to load.
   */
  url: string;
  /**
   * If the script should be loaded as async,
   * this defaults to true.
   */
  async?: boolean;
  /**
   * Callback for the `onload` event of the script.
   * Can be used to
   */
  onLoad?: () => void;
}

/**
 * Hook that adds a script to the page.
 *
 * This should be called only 1 time
 *
 * (untested)
 *
 * @see UseScriptOptions
 * @param options the options pertaining to using the following script.
 */
export function useScript(options?: UseScriptOptions) {
  useDebugValue(options);

  useEffect(() => {
    const { url, async, onLoad } = options || {};

    if (!url) return;

    const script = document.createElement('script');

    script.src = url;
    script.async = async ?? true;
    if (typeof onLoad === 'function') script.onload = onLoad;

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, [options]);
}
