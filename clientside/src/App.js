import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./Pages/HomePage";
import DestinationDetail from "./Pages/DetailPage";
import EditDeleteForm from "./Components/EditDeleteForm";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <Router>
      <Toaster position="top-center" reverseOrder={false}/>
      <Routes>
        
        <Route path="/" element={<HomePage />} />
        
        <Route path="/destinations/:id" element={<DestinationDetail />} />
        <Route path="/edit/:id" element={<EditDeleteForm/>} />
        

      </Routes>
    </Router>
  );
}

export default App;
