import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import DestinationDetail from './Pages/DetailPage';
import EditDeleteForm from './Components/EditDeleteForm';
import { Toaster } from 'react-hot-toast';

export default function App() {
  return (
    <Router>
      {/* Toaster needs to be here once at root */}
      <Toaster position="top-right" reverseOrder={false} />
      
      <Routes>
        <Route path="/" element={<DestinationDetail />} />
        <Route path="/edit/:id" element={<EditDeleteForm />} />
      </Routes>
    </Router>
  );
}
