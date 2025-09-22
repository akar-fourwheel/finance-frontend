import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SchemePage from './schemePage';

function App() {
  return (
    <Router>
      <Routes>
        {/* Default route to render SchemePage on load */}
        <Route path="/" element={<SchemePage />} />
      </Routes>
    </Router>
  );
}

export default App;
