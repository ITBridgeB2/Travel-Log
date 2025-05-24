import { Routes, Route } from 'react-router-dom';
import EditDeleteForm from './Components/EditDeleteForm';

function App() {
  return (
    <Routes>
      <Route path="/" element={<EditDeleteForm />} />
    </Routes>
  );
}

export default App;
