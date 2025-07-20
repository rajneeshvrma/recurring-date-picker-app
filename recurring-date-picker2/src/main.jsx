// src/main.jsx (or src/index.js)
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css'; // Your stylish custom CSS
import 'bootstrap/dist/css/bootstrap.min.css'; // Bootstrap CSS
import 'react-datepicker/dist/react-datepicker.css'; // React DatePicker CSS

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);