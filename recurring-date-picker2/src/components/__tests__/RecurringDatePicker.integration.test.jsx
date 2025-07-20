// src/components/__tests__/RecurringDatePicker.integration.test.jsx
import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import '@testing-library/jest-dom';
import RecurringDatePicker from '../RecurringDatePicker';
import useRecurringDateStore from '../../stores/useRecurringDateStore';
import { act } from 'react'; // For state updates outside direct user events
import { format } from 'date-fns';

describe('RecurringDatePicker Integration', () => {
  // Clear Zustand state before each test
  beforeEach(() => {
    act(() => {
      useRecurringDateStore.setState({
        recurrenceType: 'daily',
        everyXValue: 1,
        selectedDaysOfWeek: [],
        monthlyPatternType: 'dayOfMonth',
        dayOfMonth: 1,
        nthWeekdayValue: 'first',
        nthWeekdayDay: 'Monday',
        yearlyPatternMonth: 0,
        yearlyPatternDay: 1,
        yearlyPatternNthWeekdayValue: 'first',
        yearlyPatternNthWeekdayDay: 'Monday',
        startDate: null,
        endDate: null,
        calculatedRecurringDates: [],
      });
    });
  });

  // Example: Test daily recurrence with start date// src/components/__tests__/RecurringDatePicker.integration.test.jsx

// ... (imports and beforeEach)

describe('RecurringDatePicker Integration', () => {
  // ... (beforeEach block)

  // Example: Test daily recurrence with start date
  it('should display correct daily recurring dates based on start date', async () => {
    render(<RecurringDatePicker />);

    // 1. Select a start date (simulating DatePicker interaction by directly setting state)
    act(() => {
      useRecurringDateStore.getState().setStartDate(new Date('2025-07-20T00:00:00.000Z'));
    });

    // We can still assert the value in the input if needed, but the primary interaction is via state.
    // For react-datepicker, the visible value might update asynchronously.
    await waitFor(() => {
      const startDateInput = screen.getByDisplayValue('2025/07/20'); // Check for the formatted value
      expect(startDateInput).toBeInTheDocument();
      // No extra 'Your assertions here' if it's already covered by the line above
    }, { timeout: 3000 }); // Increase timeout to 3 seconds

    // 2. Ensure recurrence is 'daily' (default) and everyXValue is '1' (default)
    const dailyRadio = screen.getByLabelText('Daily');
    expect(dailyRadio).toBeChecked();

    const everyXInput = screen.getByRole('spinbutton'); // Assuming it's the only one for now
    expect(everyXInput).toHaveValue(1);
    // screen.debug(july2025Calendar); // Debugging to see the current state of the DOM

    // 3. Wait for the preview to update and check dates
    await waitFor(() => {
      // Check the upcoming dates list
      expect(screen.getByText(/Sunday, July 20th, 2025/i)).toBeInTheDocument(); // Using regex for robustness
      expect(screen.getByText(/Monday, July 21st, 2025/i)).toBeInTheDocument();
      expect(screen.getByText(/Tuesday, July 22nd, 2025/i)).toBeInTheDocument();
      
      const july2025Calendar = screen.getByText('July 2025', { selector: '.card-header strong' }).closest('.mini-calendar-grid');
      // screen.debug(july2025Calendar); // Debugging to see the calendar state

      // You could also check the mini calendar for the highlights
      const july20thCell = within(july2025Calendar).getByText('20', { selector: '.bg-primary.text-white.rounded-circle' });
      expect(july20thCell).toBeInTheDocument();
      const july21stCell = within(july2025Calendar).getByText('21', { selector: '.bg-primary.text-white.rounded-circle' });
      expect(july21stCell).toBeInTheDocument();
    }, { timeout: 3000 }); // Increase timeout if needed for async updates
  }); // <-- THIS IS THE CORRECT CLOSING BRACE FOR THE 'it' BLOCK

  // ... (rest of the tests - ensure they also have 'async' if they use 'await')
});

  // Example: Test weekly recurrence
  it('should display correct weekly recurring dates', async () => {
    render(<RecurringDatePicker />);

    act(() => {
      useRecurringDateStore.getState().setStartDate(new Date('2025-07-20T00:00:00.000Z')); // Sunday
      useRecurringDateStore.getState().setRecurrenceType('weekly');
      useRecurringDateStore.getState().setSelectedDaysOfWeek(['Monday', 'Friday']);
      useRecurringDateStore.getState().setEveryXValue(1);
    });

    await waitFor(() => {
      expect(screen.getByText('Monday, July 21st, 2025')).toBeInTheDocument();
      expect(screen.getByText('Friday, July 25th, 2025')).toBeInTheDocument();
      expect(screen.getByText('Monday, July 28th, 2025')).toBeInTheDocument();
    });
  });

  // Example: Test monthly (day of month) recurrence
  it('should display correct monthly recurring dates (day of month)', async () => {
    render(<RecurringDatePicker />);

    act(() => {
      useRecurringDateStore.getState().setStartDate(new Date('2025-01-15T00:00:00.000Z'));
      useRecurringDateStore.getState().setRecurrenceType('monthly');
      useRecurringDateStore.getState().setMonthlyPatternType('dayOfMonth');
      useRecurringDateStore.getState().setDayOfMonth(15);
    });

    await waitFor(() => {
      expect(screen.getByText('Wednesday, January 15th, 2025')).toBeInTheDocument();
      expect(screen.getByText('Saturday, February 15th, 2025')).toBeInTheDocument();
      expect(screen.getByText('Saturday, March 15th, 2025')).toBeInTheDocument();
    });
  });

  // Example: Test monthly (nth weekday) recurrence with end date
  it('should display correct monthly recurring dates (nth weekday) with end date', async () => {
    render(<RecurringDatePicker />);

    act(() => {
      useRecurringDateStore.getState().setStartDate(new Date('2025-07-01T00:00:00.000Z')); // July 1st is Tuesday
      useRecurringDateStore.getState().setEndDate(new Date('2025-10-31T00:00:00.000Z'));
      useRecurringDateStore.getState().setRecurrenceType('monthly');
      useRecurringDateStore.getState().setMonthlyPatternType('nthWeekday');
      useRecurringDateStore.getState().setNthWeekdayValue('first');
      useRecurringDateStore.getState().setNthWeekdayDay('Monday');
    });

    await waitFor(() => {
      expect(screen.getByText('Monday, July 7th, 2025')).toBeInTheDocument();
      expect(screen.getByText('Monday, August 4th, 2025')).toBeInTheDocument();
      expect(screen.getByText('Monday, September 1st, 2025')).toBeInTheDocument();
      expect(screen.getByText('Monday, October 6th, 2025')).toBeInTheDocument();
      expect(screen.queryByText('Monday, November 3rd, 2025')).not.toBeInTheDocument(); // Should stop before Nov
    });
  });
});