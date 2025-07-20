// src/components/DateRangeSelector.jsx
import React from 'react';
import useRecurringDateStore from '../stores/useRecurringDateStore';
import DatePicker from 'react-datepicker';

const DateRangeSelector = () => {
  const { startDate, setStartDate, endDate, setEndDate } = useRecurringDateStore();

  return (
    <div className="row g-3">
      <div className="col-md-6">
        <label htmlFor="startDate" className="form-label">Start Date:</label><br/>
        <DatePicker
          id="startDate"
          selected={startDate}
          onChange={(date) => setStartDate(date)}
          className="form-control"
          dateFormat="yyyy/MM/dd"
          placeholderText="Select Start Date"
          popperPlacement="bottom-start" // Ensures good positioning
        />
      </div>
      <div className="col-md-6">
        <label htmlFor="endDate" className="form-label">End Date (Optional):</label><br/>
        <DatePicker
          id="endDate"
          selected={endDate}
          onChange={(date) => setEndDate(date)}
          className="form-control"
          dateFormat="yyyy/MM/dd"
          placeholderText="Select End Date"
          isClearable
          popperPlacement="bottom-start" // Ensures good positioning
        />
      </div>
    </div>
  );
};

export default DateRangeSelector;