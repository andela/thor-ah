/**
 * Sanitizes string before processing the request
 *
 * @param {string} string
 * @returns {number} timeToRead - time it takes to read an article
 */

const sanitizeString = (string) => {
  const stringArray = string.split(' ');
  const sanitized = stringArray.map(word => `${word[0].toUpperCase()}${word.slice(1).toLowerCase()}`);
  return sanitized.join(' ');
};

export default sanitizeString;
