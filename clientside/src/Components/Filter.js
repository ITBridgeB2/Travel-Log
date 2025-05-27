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
    <div className="w-full bg-teal-500 py-6 px-4">
      <div className="max-w-7xl mx-auto flex flex-wrap md:flex-nowrap gap-4">
        {/* Filter by Country (25%) */}
        <div className="w-full md:w-1/4">
         
          <select
            value={selectedCountry}
            onChange={(e) => setSelectedCountry(e.target.value)}
            className="w-full px-4 py-2 rounded-xl border border-teal-300 focus:outline-none focus:ring-2 focus:ring-white"
          >
            <option value="">All Countries</option>
            {countries.map((country) => (
              <option key={country} value={country}>{country}</option>
            ))}
          </select>
        </div>

        {/* Filter by Year (25%) */}
        <div className="w-full md:w-1/4">
          
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="w-full px-4 py-2 rounded-xl border border-teal-300 focus:outline-none focus:ring-2 focus:ring-white"
          >
            <option value="">All Years</option>
            {years.map((year) => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default Filter;
