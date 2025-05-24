import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AddDestination from '../src/Components/AddDestination';
import HomePage from '../src/Pages/HomePage';
import "./input.css";


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/adding" element={<AddDestination />} />
      </Routes>
    </Router>
  );
}

export default App;
