/**
 * Text utility functions for string formatting and manipulation
 */

/**
 * Capitalizes the first letter of a string and converts the rest to lowercase
 * @param {string} str - The string to capitalize
 * @param {string} fallback - The fallback value if string is falsy (default: 'Unassigned')
 * @returns {string} The capitalized string or fallback value
 */
export const capitalizeFirst = (str, fallback = 'Unassigned') => {
  if (!str || str === '') {
    return fallback;
  }
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

/**
 * Capitalizes the first letter of a string with conditional fallback
 * @param {string} str - The string to capitalize
 * @param {string} fallback - The fallback value if string is falsy (default: 'Unassigned')
 * @returns {string} The capitalized string or fallback value
 */
export const capitalizeFirstWithFallback = (str, fallback = 'Unassigned') => {
  return str ? capitalizeFirst(str, fallback) : fallback;
};
