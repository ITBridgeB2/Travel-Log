import AddDestination from '../Components/AddDestination';
import { useState } from 'react';








function HomePage() {
  
  // --------------------------------START OF ADDDESTINATION MODAL --------------------------------
  const [modalOpen, setModalOpen] = useState(false);
  
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Home Page</h1>
      <button
        onClick={() => setModalOpen(true)}
        className="px-4 py-2 bg-teal-500 text-white rounded hover:bg-teal-600"
      >
        + Add Destination
      </button>

      <AddDestination isOpen={modalOpen} onClose={() => setModalOpen(false)} />
      {/* Other homepage content here */}
    </div>
  );
}


// --------------------------------END OF ADDDESTINATION MODAL --------------------------------






export default HomePage;
