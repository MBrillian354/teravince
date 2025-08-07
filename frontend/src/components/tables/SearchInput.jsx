import { useState, useEffect } from 'react';

/**
 * Search input component with debouncing
 */
export default function SearchInput({ 
  value, 
  onChange, 
  placeholder = "Search...", 
  delay = 500,
  className = "px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent",
  id = "search-input",
  name = "search"
}) {
  const [searchTerm, setSearchTerm] = useState(value || '');

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      onChange(searchTerm);
    }, delay);

    return () => clearTimeout(timer);
  }, [searchTerm, onChange, delay]);

  // Update local state when external value changes
  useEffect(() => {
    setSearchTerm(value || '');
  }, [value]);

  return (
    <input
      id={id}
      name={name}
      type="text"
      placeholder={placeholder}
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      className={className}
    />
  );
}
