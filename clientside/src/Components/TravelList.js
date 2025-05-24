import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function TravelListPage() {
  const [destinations, setDestinations] = useState([]);

  useEffect(() => {
    fetchDestinations();
  }, []);

  const fetchDestinations = async () => {
    try {
      const res = await axios.get('http://localhost:5000/destinations');
      setDestinations(res.data);
    } catch (err) {
      console.error('Error fetching destinations:', err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this destination?")) return;

    try {
      await axios.delete(`http://localhost:5000/destinations/${id}`);
      setDestinations(destinations.filter(dest => dest.id !== id));
    } catch (err) {
      console.error('Error deleting destination:', err);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">

      {destinations.length === 0 ? (
        <p className="text-gray-500">No destinations found.</p>
      ) : (
        <ul className="space-y-4">
          {destinations.map((dest) => (
            <li
              key={dest.id}
              className="bg-white rounded-xl shadow p-4 flex justify-between items-start hover:shadow-md transition"
            >
              <div>
                <h2 className="text-teal-600 font-semibold text-lg hover:underline cursor-pointer">
                  {dest.name}
                </h2>
                <p className="text-gray-600">Country: {dest.country}</p>
                <p className="text-gray-600">
                  Date: {new Date(dest.visit_date).toISOString().split("T")[0]}
                </p>
                
              </div>
              <button
                className="text-red-500 hover:underline text-sm"
                onClick={() => handleDelete(dest.id)}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
