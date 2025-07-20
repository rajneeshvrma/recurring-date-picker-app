// src/stores/useRecurringDateStore.js
import { create } from 'zustand';

const useRecurringDateStore = create((set) => ({
  // --- Recurrence Settings ---
  recurrenceType: 'daily', // 'daily', 'weekly', 'monthly', 'yearly'
  everyXValue: 1, // For "Every X days/weeks/months/years"
  selectedDaysOfWeek: [], // e.g., ['Monday', 'Wednesday'] for weekly
  monthlyPatternType: 'dayOfMonth', // 'dayOfMonth' or 'nthWeekday'
  dayOfMonth: 1, // For monthly: e.g., '1st'
  nthWeekdayValue: 'first', // 'first', 'second', etc.
  nthWeekdayDay: 'Monday', // 'Monday', 'Tuesday', etc.
  yearlyPatternMonth: 0, // January (0-indexed)
  yearlyPatternDay: 1, // 1st of the month
  yearlyPatternNthWeekdayValue: 'first',
  yearlyPatternNthWeekdayDay: 'Monday',

  // --- Date Range ---
  startDate: null, // Date object or ISO string
  endDate: null,   // Date object or ISO string (optional)

  // --- Calculated Dates (derived state) ---
  calculatedRecurringDates: [], // Will be updated by the main component

  // --- Actions ---
  setRecurrenceType: (type) => set({ recurrenceType: type }),
  setEveryXValue: (value) => set({ everyXValue: value }),
  setSelectedDaysOfWeek: (days) => set({ selectedDaysOfWeek: days }),
  setMonthlyPatternType: (type) => set({ monthlyPatternType: type }),
  setDayOfMonth: (day) => set({ dayOfMonth: day }),
  setNthWeekdayValue: (value) => set({ nthWeekdayValue: value }),
  setNthWeekdayDay: (day) => set({ nthWeekdayDay: day }),
  setYearlyPatternMonth: (month) => set({ yearlyPatternMonth: month }),
  setYearlyPatternDay: (day) => set({ yearlyPatternDay: day }),
  setYearlyPatternNthWeekdayValue: (value) => set({ yearlyPatternNthWeekdayValue: value }),
  setYearlyPatternNthWeekdayDay: (day) => set({ yearlyPatternNthWeekdayDay: day }),
  setStartDate: (date) => set({ startDate: date }),
  setEndDate: (date) => set({ endDate: date }),
  setCalculatedRecurringDates: (dates) => set({ calculatedRecurringDates: dates }),
}));

export default useRecurringDateStore;