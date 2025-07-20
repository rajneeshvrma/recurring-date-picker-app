// // src/components/RecurringDatePicker.jsx
// import React, { useEffect, useCallback } from 'react';
// import useRecurringDateStore from '../stores/useRecurringDateStore';
// import RecurrenceOptions from './RecurrenceOptions';
// import WeeklyCustomization from './WeeklyCustomization';
// import MonthlyCustomization from './MonthlyCustomization';
// import YearlyCustomization from './YearlyCustomization';
// import DateRangeSelector from './DateRangeSelector';
// import MiniCalendarPreview from './MiniCalendarPreview';
// import {
//   addDays, addWeeks, addMonths, addYears,
//   isAfter, isSameDay, setDate, getDay, getMonth, getYear, isValid,
//   startOfMonth, endOfMonth, setDay, getDate,
// } from 'date-fns';

// const RecurringDatePicker = () => {
//   const {
//     recurrenceType,
//     everyXValue,
//     selectedDaysOfWeek,
//     monthlyPatternType,
//     dayOfMonth,
//     nthWeekdayValue,
//     nthWeekdayDay,
//     yearlyPatternMonth,
//     yearlyPatternDay,
//     yearlyPatternNthWeekdayValue,
//     yearlyPatternNthWeekdayDay,
//     startDate,
//     endDate,
//     setCalculatedRecurringDates
//   } = useRecurringDateStore();

//   // Helper maps for converting string names to date-fns friendly numbers
//   const nthMap = {
//     'first': 1, 'second': 2, 'third': 3, 'fourth': 4, 'last': -1
//   };
//   const dayNameToNumber = {
//     'Sunday': 0, 'Monday': 1, 'Tuesday': 2, 'Wednesday': 3, 'Thursday': 4, 'Friday': 5, 'Saturday': 6
//   };

//   const calculateDates = useCallback(() => {
//     if (!startDate || !isValid(startDate)) {
//       setCalculatedRecurringDates([]);
//       return;
//     }

//     const dates = [];
//     const maxPreviewDates = 100; // Limit for preview to prevent performance issues with large ranges
//     let currentDate = new Date(startDate); // The date we are currently considering
//     let safetyCounter = 0; // To prevent infinite loops in complex scenarios

//     while (dates.length < maxPreviewDates && safetyCounter < maxPreviewDates * 5) { // Increased safety counter
//       if (endDate && isAfter(currentDate, endDate)) {
//         break; // Stop if we've passed the end date
//       }

//       let candidateDate = null;
//       let shouldAdd = false; // Flag to determine if current candidate should be added

//       switch (recurrenceType) {
//         case 'daily':
//           candidateDate = currentDate;
//           shouldAdd = true; // Always add for daily if within range
//           currentDate = addDays(currentDate, everyXValue);
//           break;

//         case 'weekly':
//           if (selectedDaysOfWeek.length === 0) {
//             // No days selected for weekly recurrence, stop calculation for this type
//             currentDate = addWeeks(currentDate, everyXValue); // Advance to avoid infinite loop
//             break;
//           }

//           const sortedSelectedDayNumbers = selectedDaysOfWeek
//             .map(day => dayNameToNumber[day])
//             .sort((a, b) => a - b);

//           let dateAddedInThisWeek = false;

//           for (let i = 0; i < sortedSelectedDayNumbers.length; i++) {
//             const targetDay = sortedSelectedDayNumbers[i];
//             let potentialDate = setDay(currentDate, targetDay);

//             // If potentialDate is before currentDate but in the same week, it means
//             // we've already passed this day for the current 'week cycle'.
//             // In that case, add a week to it to get the *next* occurrence.
//             if (isAfter(currentDate, potentialDate) && !isSameDay(currentDate, potentialDate)) {
//               potentialDate = addWeeks(potentialDate, 1);
//             }

//             if (isSameDay(potentialDate, startDate) || isAfter(potentialDate, startDate)) {
//                 // If this potentialDate is within the same "every X weeks" block as currentDate
//                 // AND it's not after the endDate.
//                 if (!endDate || !isAfter(potentialDate, endDate)) {
//                     // Check if it's already added to prevent duplicates from complex logic
//                     if (!dates.some(d => isSameDay(d, potentialDate))) {
//                         dates.push(potentialDate);
//                         dateAddedInThisWeek = true;
//                     }
//                     if (dates.length >= maxPreviewDates) break;
//                 } else {
//                     // Potential date is after end date, so stop processing this week/type
//                     break;
//                 }
//             }
//           }
//           // After checking all days for the current week or 'every X weeks' block,
//           // advance currentDate to the start of the next 'every X weeks' block.
//           currentDate = addWeeks(currentDate, everyXValue);
//           break; // Break from switch to go to next while loop iteration

//         case 'monthly':
//           let currentMonthNumber = getMonth(currentDate);
//           let currentYear = getYear(currentDate);

//           if (monthlyPatternType === 'dayOfMonth') {
//             candidateDate = setDate(new Date(currentYear, currentMonthNumber, 1), Math.min(dayOfMonth, new Date(currentYear, currentMonthNumber + 1, 0).getDate()));
//           } else if (monthlyPatternType === 'nthWeekday') {
//             const targetNth = nthMap[nthWeekdayValue];
//             const targetDayNum = dayNameToNumber[nthWeekdayDay];
//             if (targetNth === undefined || targetDayNum === undefined) {
//                 // Invalid selection, advance and skip
//                 currentDate = addMonths(currentDate, everyXValue);
//                 break;
//             }

//             let foundDateInMonth = null;
//             let countOfWeekday = 0;
//             const daysInCurrentMonth = endOfMonth(new Date(currentYear, currentMonthNumber, 1)).getDate();

//             for (let d = 1; d <= daysInCurrentMonth; d++) {
//               let potential = new Date(currentYear, currentMonthNumber, d);
//               if (getDay(potential) === targetDayNum) {
//                 countOfWeekday++;
//                 if (targetNth === -1) { // 'last'
//                   foundDateInMonth = potential;
//                 } else if (countOfWeekday === targetNth) {
//                   foundDateInMonth = potential;
//                   break;
//                 }
//               }
//             }
//             candidateDate = foundDateInMonth;
//           }

//           shouldAdd = true; // Set to true to add outside the switch
//           currentDate = addMonths(currentDate, everyXValue);
//           break;

//         case 'yearly':
//           let currentYearForYearly = getYear(currentDate);
//           let targetMonthForYearly = yearlyPatternMonth;

//           if (monthlyPatternType === 'dayOfMonth') { // Reusing monthlyPatternType from store for yearly
//             candidateDate = setDate(new Date(currentYearForYearly, targetMonthForYearly, 1), Math.min(yearlyPatternDay, new Date(currentYearForYearly, targetMonthForYearly + 1, 0).getDate()));
//           } else if (monthlyPatternType === 'nthWeekday') {
//             const targetNth = nthMap[yearlyPatternNthWeekdayValue];
//             const targetDayNum = dayNameToNumber[yearlyPatternNthWeekdayDay];
//             if (targetNth === undefined || targetDayNum === undefined) {
//                 // Invalid selection, advance and skip
//                 currentDate = addYears(currentDate, everyXValue);
//                 break;
//             }

//             let foundDateInMonth = null;
//             let countOfWeekday = 0;
//             const daysInTargetMonth = endOfMonth(new Date(currentYearForYearly, targetMonthForYearly, 1)).getDate();

//             for (let d = 1; d <= daysInTargetMonth; d++) {
//               let potential = new Date(currentYearForYearly, targetMonthForYearly, d);
//               if (getDay(potential) === targetDayNum) {
//                 countOfWeekday++;
//                 if (targetNth === -1) {
//                   foundDateInMonth = potential;
//                 } else if (countOfWeekday === targetNth) {
//                   foundDateInMonth = potential;
//                   break;
//                 }
//               }
//             }
//             candidateDate = foundDateInMonth;
//           }

//           shouldAdd = true; // Set to true to add outside the switch
//           currentDate = addYears(currentDate, everyXValue);
//           break;

//         default:
//           break;
//       }

//       // Final check before adding candidateDate (for daily, monthly, yearly)
//       if (shouldAdd && candidateDate && isValid(candidateDate)) {
//         // Only add if it's the start date or after the start date
//         // and not already present (important for edge cases where logic might re-calculate same date)
//         if ((isSameDay(candidateDate, startDate) || isAfter(candidateDate, startDate)) &&
//             (!endDate || !isAfter(candidateDate, endDate)) &&
//             !dates.some(d => isSameDay(d, candidateDate))
//         ) {
//           dates.push(candidateDate);
//         }
//       }
//       safetyCounter++;
//     }

//     setCalculatedRecurringDates(dates.sort((a, b) => a.getTime() - b.getTime()));
//   }, [
//     startDate, endDate, recurrenceType, everyXValue, selectedDaysOfWeek,
//     monthlyPatternType, dayOfMonth, nthWeekdayValue, nthWeekdayDay,
//     yearlyPatternMonth, yearlyPatternDay, yearlyPatternNthWeekdayValue, yearlyPatternNthWeekdayDay,
//     setCalculatedRecurringDates
//   ]);

//   // Recalculate dates whenever relevant state changes
//   useEffect(() => {
//     calculateDates();
//   }, [calculateDates]); // Dependency array includes useCallback to prevent infinite loop

//   return (
//     <div className="container mt-4">
//       <h2 className="mb-4 text-center">Recurring Date Picker</h2>

//       <div className="card mb-4">
//         <div className="card-header">
//           <h5 className="mb-0">Date Range</h5>
//         </div>
//         <div className="card-body">
//           <DateRangeSelector />
//         </div>
//       </div>

//       <div className="card mb-4">
//         <div className="card-header">
//           <h5 className="mb-0">Recurrence Options</h5>
//         </div>
//         <div className="card-body">
//           <RecurrenceOptions />
//           {recurrenceType === 'weekly' && <WeeklyCustomization />}
//           {recurrenceType === 'monthly' && <MonthlyCustomization />}
//           {recurrenceType === 'yearly' && <YearlyCustomization />}
//         </div>
//       </div>

//       <div className="card">
//         <div className="card-header">
//           <h5 className="mb-0">Selected Dates Preview</h5>
//         </div>
//         <div className="card-body">
//           <MiniCalendarPreview />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default RecurringDatePicker;


// src/components/RecurringDatePicker.jsx
import React, { useEffect, useCallback } from 'react';
import useRecurringDateStore from '../stores/useRecurringDateStore';
import RecurrenceOptions from './RecurrenceOptions';
import WeeklyCustomization from './WeeklyCustomization';
import MonthlyCustomization from './MonthlyCustomization';
import YearlyCustomization from './YearlyCustomization';
import DateRangeSelector from './DateRangeSelector';
import MiniCalendarPreview from './MiniCalendarPreview';
import { calculateRecurringDatesLogic } from '../utils/dateCalculations'; // Import the utility

const RecurringDatePicker = () => {
  const {
    recurrenceType,
    everyXValue,
    selectedDaysOfWeek,
    monthlyPatternType,
    dayOfMonth,
    nthWeekdayValue,
    nthWeekdayDay,
    yearlyPatternMonth,
    yearlyPatternDay,
    yearlyPatternNthWeekdayValue,
    yearlyPatternNthWeekdayDay,
    startDate,
    endDate,
    setCalculatedRecurringDates // Destructure the setter directly
  } = useRecurringDateStore(); // Destructure all needed state variables here

  const calculateDates = useCallback(() => {
    const calculated = calculateRecurringDatesLogic({
      startDate,
      endDate,
      recurrenceType,
      everyXValue,
      selectedDaysOfWeek,
      monthlyPatternType,
      dayOfMonth,
      nthWeekdayValue,
      nthWeekdayDay,
      yearlyPatternMonth,
      yearlyPatternDay,
      yearlyPatternNthWeekdayValue,
      yearlyPatternNthWeekdayDay,
    });
    setCalculatedRecurringDates(calculated);
  }, [
    startDate,
    endDate,
    recurrenceType,
    everyXValue,
    selectedDaysOfWeek,
    monthlyPatternType,
    dayOfMonth,
    nthWeekdayValue,
    nthWeekdayDay,
    yearlyPatternMonth,
    yearlyPatternDay,
    yearlyPatternNthWeekdayValue,
    yearlyPatternNthWeekdayDay,
    setCalculatedRecurringDates // This setter itself is stable from Zustand, so it's fine.
  ]);

  useEffect(() => {
    calculateDates();
  }, [calculateDates]); // This dependency is now stable

  return (
    <div className="container mt-4">
      <h2 className="mb-4 text-center">Recurring Date Picker</h2>

      <div className="card mb-4">
        <div className="card-header">
          <h5 className="mb-0">Date Range</h5>
        </div>
        <div className="card-body">
          <DateRangeSelector />
        </div>
      </div>

      <div className="card mb-4">
        <div className="card-header">
          <h5 className="mb-0">Recurrence Options</h5>
        </div>
        <div className="card-body">
          <RecurrenceOptions />
          {recurrenceType === 'weekly' && <WeeklyCustomization />}
          {recurrenceType === 'monthly' && <MonthlyCustomization />}
          {recurrenceType === 'yearly' && <YearlyCustomization />}
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h5 className="mb-0">Selected Dates Preview</h5>
        </div>
        <div className="card-body">
          <MiniCalendarPreview />
        </div>
      </div>
    </div>
  );
};

export default RecurringDatePicker;