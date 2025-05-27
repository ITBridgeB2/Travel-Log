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
    {/* Search + Filter Layout Container */}
    <div className="bg-teal-100 p-6 rounded-xl shadow-md max-w-6xl mx-auto mt-6 mb-8 border border-teal-300">
      <div className="flex flex-wrap md:flex-nowrap gap-4">
        {/* SearchBar - 50% width */}
        <div className="w-full md:w-1/2">
          <SearchBar query={query} onQueryChange={setQuery} />
        </div>

        {/* Country Filter - 25% width */}
        <div className="w-full md:w-1/4">
          <div className="flex flex-col">
           
            <select
              value={selectedCountry}
              onChange={(e) => setSelectedCountry(e.target.value)}
              className="px-4 py-2 border border-teal-300 bg-white rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <option value="">All Countries</option>
              {[...new Set(destinations.map(d => d.country))].sort().map(country => (
                <option key={country} value={country}>{country}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Year Filter - 25% width */}
        <div className="w-full md:w-1/4">
          <div className="flex flex-col">
            
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="px-4 py-2 border border-teal-300 bg-white rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <option value="">All Years</option>
              {[...new Set(destinations.map(d => new Date(d.visit_date).getFullYear()))]
                .sort((a, b) => b - a)
                .map(year => (
                  <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>

    {/* Destination List */}
    <div className="p-6 max-w-4xl mx-auto">
      {filteredDestinations.length === 0 ? (
        <p className="text-gray-500">No destinations found.</p>
      ) : (
        <ul className="space-y-4">
          {filteredDestinations.map((dest) => (
            <li
              key={dest.id}
              className="bg-white rounded-xl border-l-4 border-teal-500 shadow p-4 hover:shadow-lg transition flex justify-between items-start"
            >
              <Link
                to={`/destinations/${dest.id}`}
                className="flex-1 cursor-pointer"
              >
                <h2 className="text-teal-600 font-semibold text-lg hover:underline">
                  {dest.name}
                </h2>
                <p className="text-gray-700">Country: {dest.country}</p>
                <p className="text-gray-700">
                  Date: {new Date(dest.visit_date).toISOString().split("T")[0]}
                </p>
              </Link>

              <button
                className="text-red-500 hover:text-red-600 text-sm ml-4"
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
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