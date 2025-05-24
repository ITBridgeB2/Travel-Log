import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import TravelListPage from './Components/TravelList';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<TravelListPage />} />
        {/* You can add other routes here */}
      </Routes>
    </Router>
  );
}

export default App;
