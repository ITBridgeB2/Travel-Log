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

      {/* Travel Log Title (center) */}
      <h1 className="text-lg font-semibold text-teal-700 hidden sm:block">
        Travel Log
      </h1>

      {/* Add Destination (right) */}
      <button
        onClick={() => setIsModalOpen(true)}
        className="bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-teal-400"
        aria-label="Add Destination"
      >
        Add Destination
      </button>
    </nav>

    {/* Modal */}
    <AddDestination isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

    {/* Main Content Area */}
    <div className="px-6 py-8">
      {/* Travel List Section */}
      <div className="bg-white p-6 rounded-xl shadow-md">
        <TravelListPage />
      </div>
    </div>

    {/* Modal Duplicate */}
    <AddDestination isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
  </div>
);

};

export default HomePage;
