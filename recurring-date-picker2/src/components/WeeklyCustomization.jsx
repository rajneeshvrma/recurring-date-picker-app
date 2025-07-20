// src/components/WeeklyCustomization.jsx
import React from 'react';
import useRecurringDateStore from '../stores/useRecurringDateStore';

const WeeklyCustomization = () => {
  const { selectedDaysOfWeek, setSelectedDaysOfWeek } = useRecurringDateStore();
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  const handleDayToggle = (day) => {
    if (selectedDaysOfWeek.includes(day)) {
      setSelectedDaysOfWeek(selectedDaysOfWeek.filter((d) => d !== day));
    } else {
      setSelectedDaysOfWeek([...selectedDaysOfWeek, day].sort((a, b) => days.indexOf(a) - days.indexOf(b)));
    }
  };

  return (
    <div className="mt-3">
      <label className="form-label">Select specific days of the week:</label>
      <div className="d-flex flex-wrap gap-2">
        {days.map((day) => (
          <div key={day} className="form-check form-check-inline">
            <input
              className="form-check-input"
              type="checkbox"
              id={`day-${day}`}
              checked={selectedDaysOfWeek.includes(day)}
              onChange={() => handleDayToggle(day)}
            />
            <label className="form-check-label" htmlFor={`day-${day}`}>
              {day.substring(0, 3)}
            </label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WeeklyCustomization;