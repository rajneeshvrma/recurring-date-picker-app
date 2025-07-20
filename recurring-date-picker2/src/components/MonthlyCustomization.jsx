// src/components/MonthlyCustomization.jsx
import React from 'react';
import useRecurringDateStore from '../stores/useRecurringDateStore';

const MonthlyCustomization = () => {
  const {
    monthlyPatternType, setMonthlyPatternType,
    dayOfMonth, setDayOfMonth,
    nthWeekdayValue, setNthWeekdayValue,
    nthWeekdayDay, setNthWeekdayDay,
  } = useRecurringDateStore();

  const nthOptions = ['first', 'second', 'third', 'fourth', 'last'];
  const daysOfWeekOptions = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  return (
    <div className="mt-3">
      <div className="form-check">
        <input
          className="form-check-input"
          type="radio"
          name="monthlyPattern"
          id="monthlyDayOfMonthRadio"
          value="dayOfMonth"
          checked={monthlyPatternType === 'dayOfMonth'}
          onChange={() => setMonthlyPatternType('dayOfMonth')}
        />
        <label className="form-check-label" htmlFor="monthlyDayOfMonthRadio">
          On day
        </label>
        {monthlyPatternType === 'dayOfMonth' && (
          <input
            type="number"
            className="form-control d-inline-block ms-2"
            style={{ width: '80px' }}
            value={dayOfMonth}
            onChange={(e) => setDayOfMonth(parseInt(e.target.value) || 1)}
            min="1"
            max="31"
          />
        )}
      </div>

      <div className="form-check mt-2">
        <input
          className="form-check-input"
          type="radio"
          name="monthlyPattern"
          id="monthlyNthWeekdayRadio"
          value="nthWeekday"
          checked={monthlyPatternType === 'nthWeekday'}
          onChange={() => setMonthlyPatternType('nthWeekday')}
        />
        <label className="form-check-label" htmlFor="monthlyNthWeekdayRadio">
          On the
        </label>
        {monthlyPatternType === 'nthWeekday' && (
          <>
            <select
              className="form-select d-inline-block ms-2"
              style={{ width: '120px' }}
              value={nthWeekdayValue}
              onChange={(e) => setNthWeekdayValue(e.target.value)}
            >
              {nthOptions.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
            <select
              className="form-select d-inline-block ms-2"
              style={{ width: '120px' }}
              value={nthWeekdayDay}
              onChange={(e) => setNthWeekdayDay(e.target.value)}
            >
              {daysOfWeekOptions.map((day) => (
                <option key={day} value={day}>{day}</option>
              ))}
            </select>
          </>
        )}
      </div>
    </div>
  );
};

export default MonthlyCustomization;