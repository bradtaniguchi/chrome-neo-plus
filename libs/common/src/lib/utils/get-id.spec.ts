import { getId } from './get-id';

describe('getId', () => {
  test('returns empty string if given falsy', () => expect(getId('')).toBe(''));
  test('returns document-id', () =>
    expect(getId('document-id')).toBe('document-id'));
  test('returns returns nested document-id', () =>
    expect(
      getId({
        id: 'document-id',
      })
    ).toBe('document-id'));
});
