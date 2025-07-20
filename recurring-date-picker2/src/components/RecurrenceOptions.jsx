// src/components/RecurrenceOptions.jsx
import React from 'react';
import useRecurringDateStore from '../stores/useRecurringDateStore';

const RecurrenceOptions = () => {
  const { recurrenceType, setRecurrenceType, everyXValue, setEveryXValue } = useRecurringDateStore();

  const handleEveryXChange = (e) => {
    const value = parseInt(e.target.value, 10);
    setEveryXValue(isNaN(value) || value < 1 ? 1 : value);
  };

  return (
    <div className="mb-3">
      <div className="d-flex flex-wrap gap-2 mb-3">
        {['daily', 'weekly', 'monthly', 'yearly'].map((type) => (
          <div key={type} className="form-check form-check-inline">
            <input
              className="form-check-input"
              type="radio"
              name="recurrenceType"
              id={`${type}Radio`}
              value={type}
              checked={recurrenceType === type}
              onChange={() => setRecurrenceType(type)}
            />
            <label className="form-check-label" htmlFor={`${type}Radio`}>
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </label>
          </div>
        ))}
      </div>{/* Find the input for "Every" value */}
<div className="input-group">
  <span className="input-group-text">Every</span>
  <input
    type="number"
    className="form-control"
    // Add this!
    aria-label="Every" // Or if it's tied to units: aria-label="Every number of days"
    value={everyXValue}
    onChange={(e) => setEveryXValue(Number(e.target.value))}
  />
  {/* The unit span */}
  <span className="input-group-text">
    {recurrenceType === 'daily' && 'day(s)'}
    {recurrenceType === 'weekly' && 'week(s)'}
    {recurrenceType === 'monthly' && 'month(s)'}
    {recurrenceType === 'yearly' && 'year(s)'}
  </span>
</div>
    </div>
  );
};

export default RecurrenceOptions;