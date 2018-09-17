/**
 * Sanitizes string before processing the request
 *
 * @param {string} string
 * @returns {number} changes the first letter of each word to uppercase
 */

const sanitizeString = (string) => {
  if (string === '') return '';
  const stringArray = string.split(' ');
  const sanitized = stringArray.map(word => `${word[0].toUpperCase()}${word.slice(1).toLowerCase()}`);
  return sanitized.join(' ');
};

export default sanitizeString;
