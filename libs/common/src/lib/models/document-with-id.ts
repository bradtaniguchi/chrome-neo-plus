/**
 * Generic object interface with an `id` property.
 *
 * Should be used as the base-type for all "persistent" objects saved.
 */
export interface DocumentWithId<DocumentId extends string> {
  id: DocumentId;
}
