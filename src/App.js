import React from 'react';
import {
  BrowserRouter as Router,
} from "react-router-dom";
import {YearCalculator} from './YearCalculator'

import './App.css';

function App(props) {
  return (
    <Router basename={process.env.PUBLIC_URL}>
    <div className="App">
      <YearCalculator></YearCalculator>
    </div>
    </Router>
  );
}
export default App;
