/**
 * This is a function.
 *
 * @param {string} n - A string param
 * @return {string} A good string
 *
 * @example
 *
 *  sanitize('Real estate')
 */

function sanitizeString(string) {
  const stringArray = string.split(' ');
  const sanitized = stringArray.map(word => `${word[0].toUpperCase()}${word.slice(1).toLowerCase()}`);
  return sanitized.join(' ');
}