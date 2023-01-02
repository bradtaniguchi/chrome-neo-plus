/**
 * The list of selectable theme options, same as the actual theme values,
 * except there is a "system" theme selection that will default
 * to the user's systems theme.
 */
export const SELECTABLE_THEMES = ['dark', 'light', 'system'] as const;

/**
 * The list of selectable theme options
 */
export type SelectableTheme = typeof SELECTABLE_THEMES[number];

/**
 * Type-guard to check if the value is a selectable theme
 *
 * @param selectableTheme The theme to check
 */
export const isSelectableTheme = (
  selectableTheme: unknown
): selectableTheme is SelectableTheme =>
  typeof selectableTheme === 'string' &&
  SELECTABLE_THEMES.includes(selectableTheme as SelectableTheme);

/**
 * Tuple of themes, either light or dark.
 */
export const THEMES = ['dark', 'light'] as const;

/**
 * Starter type for the different kinds of themes.
 */
export type Theme = typeof THEMES[number];

/**
 * Type-guard to check if a theme is valid.
 *
 * @param value the value to check against
 */
export const isTheme = (value: unknown): value is Theme =>
  typeof value === 'string' && THEMES.includes(value as Theme);
