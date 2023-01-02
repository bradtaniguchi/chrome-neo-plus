import { useCallback, useEffect, useMemo, useState } from 'react';
import { isSelectableTheme, SelectableTheme, Theme } from '../types';
import { useLocalForage } from './use-local-forage';
import { useLogger } from './use-logger';

/**
 * The key that should be used to save the theme
 * to local-storage
 */
export const USE_THEME_KEY = 'color-theme';

/**
 * Theme hook that directly manages the application theme, while
 * considering the system's theme preference.
 *
 * @param key the key to use for saving the theme to local-storage
 */
export function useTheme(key: string = USE_THEME_KEY) {
  const logger = useLogger();
  const localForage = useLocalForage();

  const [selectedTheme, setSelectedTheme] = useState<SelectableTheme>();
  const [systemTheme, setSystemTheme] = useState<Theme>();
  const [theme, setTheme] = useState<Theme | undefined>();

  const themeIcon = useMemo(() => {
    switch (selectedTheme) {
      case 'light':
        return '☀️';
      case 'dark':
        return '🌙';
      case 'system':
      default:
        return '🌓';
    }
  }, [selectedTheme]);

  const themeDisplay = useMemo(() => {
    switch (selectedTheme) {
      case 'light':
        return 'light';
      case 'dark':
        return 'dark';
      case 'system':
      default:
        return 'system';
    }
  }, [selectedTheme]);

  useEffect(() => {
    const localForageSelectedTheme$ = localForage.getItem(key);

    localForageSelectedTheme$.then((localForageSelectedTheme) => {
      if (isSelectableTheme(localForageSelectedTheme)) {
        setSelectedTheme(localForageSelectedTheme);
      } else {
        // otherwise if nothing is selected, then default to
        // the system theme.
        setSelectedTheme('system');
      }

      // to prevent a flash of content
      document.documentElement.style.visibility = 'visible';
    });
  }, [localForage, setSelectedTheme, key]);

  useEffect(() => {
    localForage.setItem(USE_THEME_KEY, selectedTheme);
  }, [selectedTheme, localForage]);

  useEffect(() => {
    const darkThemeMediaMatch = window.matchMedia(
      '(prefers-color-scheme: dark)'
    );

    const initMatchesDark = darkThemeMediaMatch.matches;
    setSystemTheme(initMatchesDark ? 'dark' : 'light');

    const handleDarkThemeMediaMatchChange = (e: MediaQueryListEvent) => {
      logger.log('[App] system-theme-change event:', e);
      const isDarkTheme = e.matches;
      setSystemTheme(isDarkTheme ? 'dark' : 'light');
    };

    darkThemeMediaMatch.addEventListener(
      'change',
      handleDarkThemeMediaMatchChange
    );

    return () => {
      darkThemeMediaMatch.removeEventListener(
        'change',
        handleDarkThemeMediaMatchChange
      );
    };
  }, [logger, selectedTheme, setSystemTheme]);

  useEffect(() => {
    if (selectedTheme === 'system') {
      setTheme(systemTheme);
    } else {
      setTheme(selectedTheme);
    }
  }, [systemTheme, selectedTheme, setTheme]);

  const handleToggleTheme = useCallback(() => {
    if (selectedTheme === 'system') {
      setSelectedTheme('dark');
    }
    if (selectedTheme === 'dark') {
      setSelectedTheme('light');
    }
    if (selectedTheme === 'light') {
      setSelectedTheme('system');
    }
  }, [selectedTheme]);

  return {
    /**
     * Callback to force set the them to a specific theme. This bypasses
     * the order of changed themes.
     */
    setSelectedTheme,
    /**
     * Callback that can be used to handle toggling the them in the following order:
     * 1. system
     * 2. dark
     * 3. light
     */
    handleToggleTheme,
    /**
     * The selected theme the user has picked. This includes
     * the "system theme" option.
     */
    selectedTheme,
    /**
     * The systems underlying theme, this is provided
     * via a media match. It is only used if the selectedTheme
     * is "system"
     */
    systemTheme,
    /**
     * The actual calculated theme to display.
     * This is calculated based on the selectedTheme and
     * systemTheme.
     */
    theme,
    /**
     * The theme icon that can be displayed instead of the
     * theme display property.
     */
    themeIcon,
    /**
     * The theme string that can be displayed to the user instead
     * of the theme icon.
     */
    themeDisplay,
  };
}
