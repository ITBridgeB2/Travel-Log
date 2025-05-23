import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Filter from './Components/Filter';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/filter" element={<Filter />} />
     

      </Routes>
    </Router>
  );
}

export default App;
