import { DocumentWithId } from '../models/document-with-id';

/**
 * Utility function to get id information
 *
 * @param id the id or the document itself
 */
export const getId = <DocId extends string>(
  id: DocId | DocumentWithId<DocId>
): DocId => (typeof id === 'string' ? id : id.id);
