import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SchemePage from './schemePage';
import './App.css'
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SchemePage />} />
      </Routes>
    </Router>
  );
}

export default App;
