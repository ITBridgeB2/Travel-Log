import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import DestinationDetail from './Pages/DetailPage'
export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<DestinationDetail />} />
      </Routes>
    </Router>
  );
}
