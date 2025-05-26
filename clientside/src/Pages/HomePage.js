import React, { useState } from "react";
import { FaHome } from "react-icons/fa";
import { Link } from "react-router-dom";
import AddDestination from "../Components/AddDestination";
import TravelListPage from "../Components/TravelList";


const HomePage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false); // ✅ Declare the modal state

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <nav className="flex justify-between items-center p-4 bg-white shadow-md">
        {/* Home Icon (left) */}
        <Link
          to="/"
          className="text-teal-600 text-xl flex items-center gap-2 hover:text-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 rounded"
          aria-label="Home"
        >
          <FaHome />
          <span className="hidden sm:inline">Home</span>
        </Link>

        {/* Add Destination (right) */}
        <button
          onClick={() => setIsModalOpen(true)} // ✅ Toggle modal
          className="bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-teal-400"
          aria-label="Add Destination"
        >
          Add Destination
        </button>
      </nav>
      <AddDestination isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

<TravelListPage />


      {/* Placeholder for Integration */}
      <div className="p-6 text-center text-gray-500">
        <p className="text-lg">Welcome to Travel Log — track your destinations here.</p>

        {/* Modal Component */}
        <AddDestination isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      </div>
    </div>
  );
};

export default HomePage;
