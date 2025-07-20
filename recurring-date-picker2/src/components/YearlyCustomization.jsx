// src/components/YearlyCustomization.jsx
import React from 'react';
import useRecurringDateStore from '../stores/useRecurringDateStore';

const YearlyCustomization = () => {
  const {
    monthlyPatternType, setMonthlyPatternType, // Reusing monthlyPatternType for consistency in pattern selection
    yearlyPatternMonth, setYearlyPatternMonth,
    yearlyPatternDay, setYearlyPatternDay,
    yearlyPatternNthWeekdayValue, setYearlyPatternNthWeekdayValue,
    yearlyPatternNthWeekdayDay, setYearlyPatternNthWeekdayDay,
  } = useRecurringDateStore();

  const months = [
    'January', 'February', 'March', 'April', 'May', 'Jue',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  const nthOptions = ['first', 'second', 'third', 'fourth', 'last'];
  const daysOfWeekOptions = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  return (
    <div className="mt-3">
      <div className="form-check">
        <input
          className="form-check-input"
          type="radio"
          name="yearlyPattern"
          id="yearlyDayOfMonthRadio"
          value="dayOfMonth"
          checked={monthlyPatternType === 'dayOfMonth'}
          onChange={() => setMonthlyPatternType('dayOfMonth')}
        />
        <label className="form-check-label" htmlFor="yearlyDayOfMonthRadio">
          On
        </label>
        {monthlyPatternType === 'dayOfMonth' && (
          <>
            <select
              className="form-select d-inline-block ms-2"
              style={{ width: '120px' }}
              value={yearlyPatternMonth}
              onChange={(e) => setYearlyPatternMonth(parseInt(e.target.value))}
            >
              {months.map((month, index) => (
                <option key={month} value={index}>{month}</option>
              ))}
            </select>
            <input
              type="number"
              className="form-control d-inline-block ms-2"
              style={{ width: '80px' }}
              value={yearlyPatternDay}
              onChange={(e) => setYearlyPatternDay(parseInt(e.target.value) || 1)}
              min="1"
              max="31"
            />
          </>
        )}
      </div>

      <div className="form-check mt-2">
        <input
          className="form-check-input"
          type="radio"
          name="yearlyPattern"
          id="yearlyNthWeekdayRadio"
          value="nthWeekday"
          checked={monthlyPatternType === 'nthWeekday'}
          onChange={() => setMonthlyPatternType('nthWeekday')}
        />
        <label className="form-check-label" htmlFor="yearlyNthWeekdayRadio">
          On the
        </label>
        {monthlyPatternType === 'nthWeekday' && (
          <>
            <select
              className="form-select d-inline-block ms-2"
              style={{ width: '120px' }}
              value={yearlyPatternNthWeekdayValue}
              onChange={(e) => setYearlyPatternNthWeekdayValue(e.target.value)}
            >
              {nthOptions.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
            <select
              className="form-select d-inline-block ms-2"
              style={{ width: '120px' }}
              value={yearlyPatternNthWeekdayDay}
              onChange={(e) => setYearlyPatternNthWeekdayDay(e.target.value)}
            >
              {daysOfWeekOptions.map((day) => (
                <option key={day} value={day}>{day}</option>
              ))}
            </select>
            <select
              className="form-select d-inline-block ms-2"
              style={{ width: '120px' }}
              value={yearlyPatternMonth}
              onChange={(e) => setYearlyPatternMonth(parseInt(e.target.value))}
            >
              {months.map((month, index) => (
                <option key={month} value={index}>{month}</option>
              ))}
            </select>
          </>
        )}
      </div>
    </div>
  );
};

export default YearlyCustomization;