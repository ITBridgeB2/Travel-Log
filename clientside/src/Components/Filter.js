import React, { useEffect, useState } from "react";
import '../output.css';

const Filter = ({
  destinations,
  selectedYear,
  setSelectedYear,
  selectedCountry,
  setSelectedCountry,
}) => {
  const [years, setYears] = useState([]);
  const [countries, setCountries] = useState([]);

  useEffect(() => {
    const yearSet = new Set();
    const countrySet = new Set();

    destinations.forEach((item) => {
      yearSet.add(new Date(item.visit_date).getFullYear());
      countrySet.add(item.country);
    });

    setYears([...yearSet].sort((a, b) => b - a));
    setCountries([...countrySet].sort());
  }, [destinations]);

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold text-center text-teal-600 mb-6">
        Filter by Year and Country
      </h1>

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
    </div>
  );
};

export default Filter;
