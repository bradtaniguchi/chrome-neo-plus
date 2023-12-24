import { DATE_FORMAT } from '@chrome-neo-plus/common';
import {
  formatBlocksToStrings,
  getWeeklyBlocks,
  getWeeksInMonth,
} from './get-weekly-blocks';
import { DateTime } from 'luxon';

describe('getWeeklyBlocks', () => {
  test('returns 5 weekly blocks for 1st-day-of-month-sunday', () => {
    const today = DateTime.fromFormat('2023-01-01', DATE_FORMAT);
    const blocks = getWeeklyBlocks(today);
    expect(formatBlocksToStrings(blocks)).toEqual([
      {
        start_date: '2023-01-01',
        end_date: '2023-01-08',
      },
      {
        start_date: '2023-01-08',
        end_date: '2023-01-15',
      },
      {
        start_date: '2023-01-15',
        end_date: '2023-01-22',
      },
      {
        start_date: '2023-01-22',
        end_date: '2023-01-29',
      },
      {
        start_date: '2023-01-29',
        end_date: '2023-01-31',
      },
    ]);
  });
  test('returns 4 weekly blocks for feb-2021 ', () => {
    const today = DateTime.fromFormat('2021-02-05', DATE_FORMAT);
    const blocks = getWeeklyBlocks(today);
    expect(formatBlocksToStrings(blocks)).toEqual([
      {
        start_date: '2021-02-01',
        end_date: '2021-02-08',
      },
      {
        start_date: '2021-02-08',
        end_date: '2021-02-15',
      },
      {
        start_date: '2021-02-15',
        end_date: '2021-02-22',
      },
      {
        start_date: '2021-02-22',
        end_date: '2021-02-28',
      },
    ]);
  });
});

describe('getWeeksInMonth', () => {
  test('returns 5 for Jan-2023', () => {
    const today = DateTime.fromFormat('2023-01-01', DATE_FORMAT);
    expect(getWeeksInMonth(today)).toBe(5);
  });

  test('returns 4 in Feb-2020 (leap-year)', () => {
    const today = DateTime.fromFormat('2021-02-01', DATE_FORMAT);
    expect(getWeeksInMonth(today)).toBe(4);
  });
});
