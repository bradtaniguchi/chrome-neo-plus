/**
 * A help entry is a type that can be searched within the
 * help page. Each entry must have a unique key
 */
export interface HelpEntry {
  /**
   * The unique key of the help entry, this must be unique
   * across all help entries.
   */
  key: string;
  /**
   * The description of the help entry.
   */
  description: string;
  /**
   * The data type of the help entry.
   * Undefined if not sure.
   */
  dataType?: 'string' | 'number' | 'date';
}
