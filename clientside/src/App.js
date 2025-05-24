import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import TravelListPage from "./Components/TravelList";

function App() {
  

  return (
    <div className="App">
      <Router>
     <Routes>
      <Route path="/" element={<TravelListPage/>}></Route>
     </Routes>
     </Router>
    </div>
  );
}

export default App;
