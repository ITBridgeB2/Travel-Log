import React, { useEffect, useState } from "react";
import '../output.css'; // Assumes Tailwind is properly configured

const Filter = () => {
  const [destinations, setDestinations] = useState([]);
  const [filteredDestinations, setFilteredDestinations] = useState([]);
  const [years, setYears] = useState([]);
  const [countries, setCountries] = useState([]);
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("http://localhost:5000/destinations");
        const data = await res.json();
        setDestinations(data);
        setFilteredDestinations(data);

        const yearSet = new Set();
        const countrySet = new Set();

        data.forEach((item) => {
          yearSet.add(new Date(item.visit_date).getFullYear());
          countrySet.add(item.country);
        });

        setYears([...yearSet].sort((a, b) => b - a));
        setCountries([...countrySet].sort());
      } catch (err) {
        console.error("Failed to fetch destinations:", err);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    let filtered = [...destinations];

    if (searchTerm) {
      filtered = filtered.filter(
        (d) =>
          d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          d.country.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedYear) {
      filtered = filtered.filter(
        (d) => new Date(d.visit_date).getFullYear().toString() === selectedYear
      );
    }

    if (selectedCountry) {
      filtered = filtered.filter((d) => d.country === selectedCountry);
    }

    setFilteredDestinations(filtered);
  }, [searchTerm, selectedYear, selectedCountry, destinations]);

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold text-center text-teal-600 mb-6">
        Travel Log Filter
      </h1>

      {/* Filter Controls */}
      <div className="flex flex-wrap justify-center gap-4 bg-teal-500 p-6 rounded-2xl shadow-md">
        

        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(e.target.value)}
          className="px-4 py-2 border border-teal-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
        >
          <option value="">All Years</option>
          {years.map((year) => (
            <option key={year} value={year}>{year}</option>
          ))}
        </select>

        <select
          value={selectedCountry}
          onChange={(e) => setSelectedCountry(e.target.value)}
          className="px-4 py-2 border border-teal-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
        >
          <option value="">All Countries</option>
          {countries.map((country) => (
            <option key={country} value={country}>{country}</option>
          ))}
        </select>
      </div>

      {/* Filtered Results */}
      <div className="mt-8 space-y-6">
        {filteredDestinations.length === 0 ? (
          <p className="text-center text-gray-500">No destinations found.</p>
        ) : (
          filteredDestinations.map((dest) => (
            <div
              key={dest.id}
              className="p-6 bg-white rounded-2xl shadow hover:shadow-lg transition duration-300"
            >
              <h2 className="text-2xl font-bold text-teal-600">{dest.name}</h2>
              <p className="text-gray-700">{dest.country}</p>
              <p className="text-gray-500 text-sm">Visited: {dest.visit_date}</p>
              <p className="text-gray-600 mt-2">{dest.notes}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Filter;
