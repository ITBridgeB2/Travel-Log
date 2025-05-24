import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { debounce } from 'lodash';

export default function SearchBar({ query, onQueryChange }) {
  const [suggestions, setSuggestions] = useState([]);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const listRef = useRef(null);

  const fetchSuggestions = debounce(async (searchTerm) => {
    if (!searchTerm) {
      setSuggestions([]);
      return;
    }

    try {
      const res = await axios.get(`http://localhost:5000/api/search?q=${searchTerm}`);
      setSuggestions(res.data);
    } catch (error) {
      console.error('Search failed', error);
    }
  }, 500);

  useEffect(() => {
    fetchSuggestions(query);
    return () => fetchSuggestions.cancel();
  }, [query]);

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      setFocusedIndex((prev) => (prev + 1) % suggestions.length);
    } else if (e.key === 'ArrowUp') {
      setFocusedIndex((prev) => (prev - 1 + suggestions.length) % suggestions.length);
    } else if (e.key === 'Enter' && focusedIndex >= 0) {
      const selected = suggestions[focusedIndex];
      onQueryChange(`${selected.name}, ${selected.country}`);
      setSuggestions([]);
      setFocusedIndex(-1);
    }
  };

  const handleSuggestionClick = (item) => {
    onQueryChange(`${item.name}, ${item.country}`);
    setSuggestions([]);
    setFocusedIndex(-1);
  };

  return (
    <div className="relative w-full max-w-md mx-auto mt-6">
      <input
        type="text"
        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
        placeholder="Search by name or country..."
        value={query}
        onChange={(e) => {
          onQueryChange(e.target.value);
          setFocusedIndex(-1);
        }}
        onKeyDown={handleKeyDown}
        aria-autocomplete="list"
        aria-controls="suggestions-list"
        aria-activedescendant={focusedIndex >= 0 ? `suggestion-${focusedIndex}` : undefined}
      />
      {suggestions.length > 0 && (
        <ul
          id="suggestions-list"
          className="absolute z-10 w-full bg-white border border-gray-200 mt-1 rounded-lg shadow-md max-h-60 overflow-y-auto"
          role="listbox"
          ref={listRef}
        >
          {suggestions.map((item, index) => (
            <li
              key={item.id}
              id={`suggestion-${index}`}
              role="option"
              aria-selected={focusedIndex === index}
              className={`px-4 py-2 cursor-pointer rounded-md ${
                focusedIndex === index ? 'bg-teal-500 text-white' : 'hover:bg-teal-100'
              }`}
              onMouseDown={() => handleSuggestionClick(item)}
            >
              {item.name}, {item.country}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
