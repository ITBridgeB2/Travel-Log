import React, { useEffect, useState} from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';


import SearchBar from './Search';
import Filter from './Filter';
import toast from 'react-hot-toast';

export default function TravelListPage() {
  const [destinations, setDestinations] = useState([]);
  const [query, setQuery] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('');
  

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
      toast.success('deleted successfully')
      setDestinations(destinations.filter(dest => dest.id !== id));
    } catch (err) {
      console.error('Error deleting destination:', err);
    }
  };

  // Final filtering logic
  const filteredDestinations = destinations.filter(dest => {
    const matchesQuery =
      dest.name.toLowerCase().includes(query.toLowerCase()) ||
      dest.country.toLowerCase().includes(query.toLowerCase());

    const matchesYear = selectedYear
      ? new Date(dest.visit_date).getFullYear().toString() === selectedYear
      : true;

    const matchesCountry = selectedCountry
      ? dest.country === selectedCountry
      : true;

    return matchesQuery && matchesYear && matchesCountry;
  });

  return (
    <div>
      <SearchBar query={query} onQueryChange={setQuery} />
      <Filter
        destinations={destinations}
        selectedYear={selectedYear}
        setSelectedYear={setSelectedYear}
        selectedCountry={selectedCountry}
        setSelectedCountry={setSelectedCountry}
      />
      <div className="p-6 max-w-4xl mx-auto">
        {filteredDestinations.length === 0 ? (
          <p className="text-gray-500">No destinations found.</p>
        ) : (
        <ul className="space-y-4">
  {filteredDestinations.map((dest) => (
    <li
      key={dest.id}
      className="bg-white rounded-xl shadow p-4 hover:shadow-md transition flex justify-between items-start"
    >
      <Link
        to={`/destinations/${dest.id}`}
        className="flex-1 cursor-pointer"
      >
        <h2 className="text-teal-600 font-semibold text-lg hover:underline">
          {dest.name}
        </h2>
        <p className="text-gray-600">Country: {dest.country}</p>
        <p className="text-gray-600">
          Date: {new Date(dest.visit_date).toISOString().split("T")[0]}
        </p>
      </Link>

      <button
        className="text-red-500 hover:underline text-sm ml-4"
        onClick={(e) => {
          e.stopPropagation(); // prevent navigation
          e.preventDefault(); // prevent Link default
          handleDelete(dest.id);
        }}
      >
        Delete
      </button>
    </li>
  ))}
</ul>


        )}
      </div>
    </div>
  );
}