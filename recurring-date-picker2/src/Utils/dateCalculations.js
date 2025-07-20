// src/utils/dateCalculations.js
import {
  addDays, addWeeks, addMonths, addYears,
  isAfter, isSameDay, setDate, getDay, getMonth, getYear, isValid,
  startOfMonth, endOfMonth, setDay,
} from 'date-fns';

const nthMap = {
  'first': 1, 'second': 2, 'third': 3, 'fourth': 4, 'last': -1
};
const dayNameToNumber = {
  'Sunday': 0, 'Monday': 1, 'Tuesday': 2, 'Wednesday': 3, 'Thursday': 4, 'Friday': 5, 'Saturday': 6
};

export function calculateRecurringDatesLogic({
  startDate, endDate, recurrenceType, everyXValue, selectedDaysOfWeek,
  monthlyPatternType, dayOfMonth, nthWeekdayValue, nthWeekdayDay,
  yearlyPatternMonth, yearlyPatternDay, yearlyPatternNthWeekdayValue, yearlyPatternNthWeekdayDay,
}) {
  if (!startDate || !isValid(startDate)) {
    return [];
  }

  const dates = [];
  const maxPreviewDates = 100;
  let currentDate = new Date(startDate);
  let safetyCounter = 0;

  while (dates.length < maxPreviewDates && safetyCounter < maxPreviewDates * 5) {
    if (endDate && isAfter(currentDate, endDate)) {
      break;
    }

    let candidateDate = null;
    let shouldAdd = false;

    switch (recurrenceType) {
      case 'daily':
        candidateDate = currentDate;
        shouldAdd = true;
        currentDate = addDays(currentDate, everyXValue);
        break;

      case 'weekly':
        if (selectedDaysOfWeek.length === 0) {
          currentDate = addWeeks(currentDate, everyXValue);
          break;
        }

        const sortedSelectedDayNumbers = selectedDaysOfWeek
          .map(day => dayNameToNumber[day])
          .sort((a, b) => a - b);

        for (let i = 0; i < sortedSelectedDayNumbers.length; i++) {
          const targetDay = sortedSelectedDayNumbers[i];
          let potentialDate = setDay(currentDate, targetDay);

          if (isAfter(currentDate, potentialDate) && !isSameDay(currentDate, potentialDate)) {
            potentialDate = addWeeks(potentialDate, 1);
          }

          if ((isSameDay(potentialDate, startDate) || isAfter(potentialDate, startDate)) &&
              (!endDate || !isAfter(potentialDate, endDate)) &&
              !dates.some(d => isSameDay(d, potentialDate))
          ) {
            dates.push(potentialDate);
            if (dates.length >= maxPreviewDates) break;
          } else if (endDate && isAfter(potentialDate, endDate)) {
              break;
          }
        }
        currentDate = addWeeks(currentDate, everyXValue);
        break;

      case 'monthly':
        let currentMonthNumber = getMonth(currentDate);
        let currentYear = getYear(currentDate);

        if (monthlyPatternType === 'dayOfMonth') {
          candidateDate = setDate(new Date(currentYear, currentMonthNumber, 1), Math.min(dayOfMonth, new Date(currentYear, currentMonthNumber + 1, 0).getDate()));
        } else if (monthlyPatternType === 'nthWeekday') {
          const targetNth = nthMap[nthWeekdayValue];
          const targetDayNum = dayNameToNumber[nthWeekdayDay];
          if (targetNth === undefined || targetDayNum === undefined) {
              currentDate = addMonths(currentDate, everyXValue);
              break;
          }

          let foundDateInMonth = null;
          let countOfWeekday = 0;
          const daysInCurrentMonth = endOfMonth(new Date(currentYear, currentMonthNumber, 1)).getDate();

          for (let d = 1; d <= daysInCurrentMonth; d++) {
            let potential = new Date(currentYear, currentMonthNumber, d);
            if (getDay(potential) === targetDayNum) {
              countOfWeekday++;
              if (targetNth === -1) {
                foundDateInMonth = potential;
              } else if (countOfWeekday === targetNth) {
                foundDateInMonth = potential;
                break;
              }
            }
          }
          candidateDate = foundDateInMonth;
        }

        shouldAdd = true;
        currentDate = addMonths(currentDate, everyXValue);
        break;

      case 'yearly':
        let currentYearForYearly = getYear(currentDate);
        let targetMonthForYearly = yearlyPatternMonth;

        if (monthlyPatternType === 'dayOfMonth') {
          candidateDate = setDate(new Date(currentYearForYearly, targetMonthForYearly, 1), Math.min(yearlyPatternDay, new Date(currentYearForYearly, targetMonthForYearly + 1, 0).getDate()));
        } else if (monthlyPatternType === 'nthWeekday') {
          const targetNth = nthMap[yearlyPatternNthWeekdayValue];
          const targetDayNum = dayNameToNumber[yearlyPatternNthWeekdayDay];
          if (targetNth === undefined || targetDayNum === undefined) {
              currentDate = addYears(currentDate, everyXValue);
              break;
          }

          let foundDateInMonth = null;
          let countOfWeekday = 0;
          const daysInTargetMonth = endOfMonth(new Date(currentYearForYearly, targetMonthForYearly, 1)).getDate();

          for (let d = 1; d <= daysInTargetMonth; d++) {
            let potential = new Date(currentYearForYearly, targetMonthForYearly, d);
            if (getDay(potential) === targetDayNum) {
              countOfWeekday++;
              if (targetNth === -1) {
                foundDateInMonth = potential;
              } else if (countOfWeekday === targetNth) {
                foundDateInMonth = potential;
                break;
              }
            }
          }
          candidateDate = foundDateInMonth;
        }

        shouldAdd = true;
        currentDate = addYears(currentDate, everyXValue);
        break;

      default:
        break;
    }

    if (shouldAdd && candidateDate && isValid(candidateDate)) {
      if ((isSameDay(candidateDate, startDate) || isAfter(candidateDate, startDate)) &&
          (!endDate || !isAfter(candidateDate, endDate)) &&
          !dates.some(d => isSameDay(d, candidateDate))
      ) {
        dates.push(candidateDate);
      }
    }
    safetyCounter++;
  }

  return dates.sort((a, b) => a.getTime() - b.getTime());
}