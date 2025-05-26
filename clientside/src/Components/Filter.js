import React, { useEffect, useState } from "react";


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
  <h2 className="text-3xl font-semibold text-center text-teal-700 mb-4">
    Filter Your Travel Logs
  </h2>

  <div className="flex flex-wrap justify-center gap-6 bg-white p-6 shadow-lg rounded-2xl border border-teal-100">
    <div className="flex flex-col items-start">
      <label className="text-sm font-medium text-gray-600 mb-1">Year</label>
      <select
        value={selectedYear}
        onChange={(e) => setSelectedYear(e.target.value)}
        className="px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
      >
        <option value="">All Years</option>
        {years.map((year) => (
          <option key={year} value={year}>{year}</option>
        ))}
      </select>
    </div>

    <div className="flex flex-col items-start">
      <label className="text-sm font-medium text-gray-600 mb-1">Country</label>
      <select
        value={selectedCountry}
        onChange={(e) => setSelectedCountry(e.target.value)}
        className="px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
      >
        <option value="">All Countries</option>
        {countries.map((country) => (
          <option key={country} value={country}>{country}</option>
        ))}
      </select>
    </div>
  </div>
</div>

  );
};

export default Filter;