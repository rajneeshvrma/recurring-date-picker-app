// src/components/MiniCalendarPreview.jsx
import React from 'react';
import useRecurringDateStore from '../stores/useRecurringDateStore';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, getDay, addMonths, isBefore, isAfter, isValid } from 'date-fns';

const MiniCalendarPreview = () => {
  const { calculatedRecurringDates, startDate, endDate } = useRecurringDateStore();
  // console.log('calculatedRecurringDates in MiniCalendarPreview:', calculatedRecurringDates);

  const monthsToDisplay = [];

  if (startDate && isValid(startDate)) {
    let currentMonth = startOfMonth(startDate);
    const endMonth = endDate && isValid(endDate) ? startOfMonth(endDate) : null;

    // Add months starting from the start date's month
    // and continue as long as we are before or in the end month (if end date exists)
    // and limit to a reasonable number of months for the preview (e.g., max 12 months)
    let safetyCounter = 0;
    const maxPreviewMonths = 12; // Prevent infinite loops or excessively long previews

    while (
      safetyCounter < maxPreviewMonths &&
      (!endMonth || !isAfter(currentMonth, endMonth))
    ) {
      monthsToDisplay.push(currentMonth);
      currentMonth = addMonths(currentMonth, 1);
      safetyCounter++;
    }

    // If no end date, or end date is far in future, still show at least 3 months for context
    if (monthsToDisplay.length < 3) {
      let lastMonthAdded = monthsToDisplay.length > 0 ? monthsToDisplay[monthsToDisplay.length - 1] : startOfMonth(startDate);
      while (monthsToDisplay.length < 3 && safetyCounter < maxPreviewMonths) {
        lastMonthAdded = addMonths(lastMonthAdded, 1);
        monthsToDisplay.push(lastMonthAdded);
        safetyCounter++;
      }
    }

  } else {
    // If no start date selected, show current month and next two months
    const today = new Date();
    monthsToDisplay.push(startOfMonth(today));
    monthsToDisplay.push(addMonths(startOfMonth(today), 1));
    monthsToDisplay.push(addMonths(startOfMonth(today), 2));
  }


  const renderMonth = (month) => {
    const daysInMonth = eachDayOfInterval({ start: startOfMonth(month), end: endOfMonth(month) });
    const firstDayOfWeek = getDay(startOfMonth(month)); // 0 = Sunday, 1 = Monday

    const leadingEmptyCells = Array(firstDayOfWeek).fill(null);
    const allCells = [...leadingEmptyCells, ...daysInMonth];

    return (
      <div key={format(month, 'yyyy-MM')} className="col-md-4 mb-3 mini-calendar-grid">
        <div className="card h-100">
          <div className="card-header text-center">
            <strong>{format(month, 'MMMM yyyy')}</strong>
          </div>
          <div className="card-body p-1">
            <div className="d-flex text-center small fw-bold">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} style={{ flex: '1 0 14.28%', maxWidth: '14.28%' }}>{day}</div>
              ))}
            </div>
            <div className="d-flex flex-wrap text-center small">
              {allCells.map((day, index) => (
                <div
                  key={index}
                  style={{ flex: '1 0 14.28%', maxWidth: '14.28%', height: '35px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  className={`border ${day && calculatedRecurringDates.some(d => isSameDay(new Date(d), day)) ? 'bg-primary text-white rounded-circle' : ''}`}
                >
                  {day ? format(day, 'd') : ''}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="mb-4">
      <div className="row">
        {monthsToDisplay.map(renderMonth)}
      </div>
      {(!startDate || calculatedRecurringDates.length === 0) && (
        <p className="text-muted mt-3">Select a start date and recurrence options to see the preview.</p>
      )}
      {calculatedRecurringDates.length > 0 && (
        <div className="mt-3">
          <h5>Upcoming Dates:</h5>
          <ul className="list-group">
            {calculatedRecurringDates.slice(0, 10).map((dateString, index) => ( // Show first 10 upcoming
              <li key={index} className="list-group-item">
                {format(new Date(dateString), 'EEEE, MMMM do, yyyy')}
              </li>
            ))}
            {calculatedRecurringDates.length > 10 && (
              <li className="list-group-item text-muted">...and {calculatedRecurringDates.length - 10} more dates</li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default MiniCalendarPreview;