// src/utils/__tests__/dateCalculations.test.js
import { describe, it, expect } from 'vitest';
import { calculateRecurringDatesLogic } from '../../Utils/dateCalculations';
import { format, parseISO, addDays, addMonths, addYears, getDay, setDay } from 'date-fns';

describe('calculateRecurringDatesLogic', () => {
  // Helper to create a date object safely from a YYYY-MM-DD string
  const d = (dateStr) => parseISO(dateStr);

  it('should return an empty array if startDate is null or invalid', () => {
    expect(calculateRecurringDatesLogic({ startDate: null })).toEqual([]);
    expect(calculateRecurringDatesLogic({ startDate: new Date('invalid') })).toEqual([]);
  });

  // --- Daily Recurrence Tests ---
  it('should calculate daily recurrence every 1 day', () => {
    const result = calculateRecurringDatesLogic({
      startDate: d('2025-07-20'),
      recurrenceType: 'daily',
      everyXValue: 1,
    });
    expect(result.length).toBe(100); // Max preview dates
    expect(format(result[0], 'yyyy-MM-dd')).toBe('2025-07-20');
    expect(format(result[1], 'yyyy-MM-dd')).toBe('2025-07-21');
    expect(format(result[99], 'yyyy-MM-dd')).toBe('2025-10-27'); // 20 + 99 = 119, or 100 days from 20th
  });

  it('should calculate daily recurrence every 3 days', () => {
    const result = calculateRecurringDatesLogic({
      startDate: d('2025-07-20'),
      recurrenceType: 'daily',
      everyXValue: 3,
    });
    expect(result.length).toBe(100);
    expect(format(result[0], 'yyyy-MM-dd')).toBe('2025-07-20');
    expect(format(result[1], 'yyyy-MM-dd')).toBe('2025-07-23');
    expect(format(result[2], 'yyyy-MM-dd')).toBe('2025-07-26');
  });

  it('should respect endDate for daily recurrence', () => {
    const result = calculateRecurringDatesLogic({
      startDate: d('2025-07-20'),
      endDate: d('2025-07-25'),
      recurrenceType: 'daily',
      everyXValue: 1,
    });
    expect(result.map(date => format(date, 'yyyy-MM-dd'))).toEqual([
      '2025-07-20', '2025-07-21', '2025-07-22', '2025-07-23', '2025-07-24', '2025-07-25'
    ]);
  });

  // --- Weekly Recurrence Tests ---
  it('should calculate weekly recurrence on specific days', () => {
    const result = calculateRecurringDatesLogic({
      startDate: d('2025-07-20'), // Sunday
      recurrenceType: 'weekly',
      everyXValue: 1,
      selectedDaysOfWeek: ['Monday', 'Wednesday'],
    });
    expect(result.length).toBeGreaterThan(0);
    expect(format(result[0], 'yyyy-MM-dd')).toBe('2025-07-21'); // First Monday after 20th
    expect(format(result[1], 'yyyy-MM-dd')).toBe('2025-07-23'); // First Wednesday after 20th
    expect(format(result[2], 'yyyy-MM-dd')).toBe('2025-07-28'); // Next Monday
  });

  it('should handle weekly recurrence with startDate on a selected day', () => {
    const result = calculateRecurringDatesLogic({
      startDate: d('2025-07-21'), // Monday
      recurrenceType: 'weekly',
      everyXValue: 1,
      selectedDaysOfWeek: ['Monday', 'Wednesday'],
    });
    expect(format(result[0], 'yyyy-MM-dd')).toBe('2025-07-21');
    expect(format(result[1], 'yyyy-MM-dd')).toBe('2025-07-23');
  });

  it('should respect endDate for weekly recurrence', () => {
    const result = calculateRecurringDatesLogic({
      startDate: d('2025-07-20'), // Sunday
      endDate: d('2025-07-24'),
      recurrenceType: 'weekly',
      everyXValue: 1,
      selectedDaysOfWeek: ['Monday', 'Wednesday', 'Friday'],
    });
    expect(result.map(date => format(date, 'yyyy-MM-dd'))).toEqual([
      '2025-07-21', '2025-07-23'
    ]);
  });

  // --- Monthly Recurrence Tests (Day of Month) ---
  it('should calculate monthly recurrence on a specific day of month', () => {
    const result = calculateRecurringDatesLogic({
      startDate: d('2025-07-15'),
      recurrenceType: 'monthly',
      everyXValue: 1,
      monthlyPatternType: 'dayOfMonth',
      dayOfMonth: 15,
    });
    expect(result.length).toBe(100);
    expect(format(result[0], 'yyyy-MM-dd')).toBe('2025-07-15');
    expect(format(result[1], 'yyyy-MM-dd')).toBe('2025-08-15');
  });

  it('should handle dayOfMonth exceeding days in month (e.g., Feb 30th)', () => {
    const result = calculateRecurringDatesLogic({
      startDate: d('2025-01-31'),
      recurrenceType: 'monthly',
      everyXValue: 1,
      monthlyPatternType: 'dayOfMonth',
      dayOfMonth: 31,
    });
    expect(format(result[0], 'yyyy-MM-dd')).toBe('2025-01-31');
    expect(format(result[1], 'yyyy-MM-dd')).toBe('2025-02-28'); // Feb 28th
    expect(format(result[2], 'yyyy-MM-dd')).toBe('2025-03-31');
  });

  // --- Monthly Recurrence Tests (Nth Weekday) ---
  it('should calculate monthly recurrence on the Nth weekday', () => {
    const result = calculateRecurringDatesLogic({
      startDate: d('2025-07-01'), // July 1st, 2025 is a Tuesday
      recurrenceType: 'monthly',
      everyXValue: 1,
      monthlyPatternType: 'nthWeekday',
      nthWeekdayValue: 'first',
      nthWeekdayDay: 'Monday',
    });
    expect(format(result[0], 'yyyy-MM-dd')).toBe('2025-07-07'); // First Monday of July
    expect(format(result[1], 'yyyy-MM-dd')).toBe('2025-08-04'); // First Monday of August
  });

  it('should calculate monthly recurrence on the last weekday', () => {
    const result = calculateRecurringDatesLogic({
      startDate: d('2025-07-01'),
      recurrenceType: 'monthly',
      everyXValue: 1,
      monthlyPatternType: 'nthWeekday',
      nthWeekdayValue: 'last',
      nthWeekdayDay: 'Friday',
    });
    expect(format(result[0], 'yyyy-MM-dd')).toBe('2025-07-25'); // Last Friday of July
    expect(format(result[1], 'yyyy-MM-dd')).toBe('2025-08-29'); // Last Friday of August
  });

  // --- Yearly Recurrence Tests (Day of Month) ---
  it('should calculate yearly recurrence on a specific month and day', () => {
    const result = calculateRecurringDatesLogic({
      startDate: d('2025-07-20'),
      recurrenceType: 'yearly',
      everyXValue: 1,
      monthlyPatternType: 'dayOfMonth', // This is used for yearly 'on day'
      yearlyPatternMonth: 1, // February (0-indexed)
      yearlyPatternDay: 15,
    });
    expect(format(result[0], 'yyyy-MM-dd')).toBe('2026-02-15');
    expect(format(result[1], 'yyyy-MM-dd')).toBe('2027-02-15');
  });

  it('should handle yearly recurrence day exceeding days in month (e.g., Feb 30th)', () => {
    const result = calculateRecurringDatesLogic({
      startDate: d('2025-07-20'),
      recurrenceType: 'yearly',
      everyXValue: 1,
      monthlyPatternType: 'dayOfMonth',
      yearlyPatternMonth: 1, // February
      yearlyPatternDay: 30,
    });
    expect(format(result[0], 'yyyy-MM-dd')).toBe('2026-02-28');
    expect(format(result[1], 'yyyy-MM-dd')).toBe('2027-02-28');
  });

  // --- Yearly Recurrence Tests (Nth Weekday) ---
  it('should calculate yearly recurrence on the Nth weekday of a month', () => {
    const result = calculateRecurringDatesLogic({
      startDate: d('2025-07-20'),
      recurrenceType: 'yearly',
      everyXValue: 1,
      monthlyPatternType: 'nthWeekday',
      yearlyPatternMonth: 9, // October (0-indexed)
      yearlyPatternNthWeekdayValue: 'third',
      yearlyPatternNthWeekdayDay: 'Thursday',
    });
    // Oct 2025: 3rd Thursday is 16th
    expect(format(result[0], 'yyyy-MM-dd')).toBe('2025-10-16');
    // Oct 2026: 3rd Thursday is 15th
    expect(format(result[1], 'yyyy-MM-dd')).toBe('2026-10-15');
  });

  it('should respect endDate for yearly recurrence', () => {
    const result = calculateRecurringDatesLogic({
      startDate: d('2025-01-01'),
      endDate: d('2026-06-30'),
      recurrenceType: 'yearly',
      everyXValue: 1,
      monthlyPatternType: 'dayOfMonth',
      yearlyPatternMonth: 0, // Jan
      yearlyPatternDay: 15,
    });
    expect(result.map(date => format(date, 'yyyy-MM-dd'))).toEqual([
      '2025-01-15', '2026-01-15'
    ]);
  });
});