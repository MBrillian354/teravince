/**
 * Filter select component
 */
export default function FilterSelect({
  value,
  onChange,
  options,
  placeholder = "All",
  className = "px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent",
  id,
  name
}) {
  return (
    <select
      id={id}
      name={name}
      value={value || ''}
      onChange={(e) => onChange(e.target.value)}
      className={className}
    >
      <option value="">{placeholder}</option>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}
