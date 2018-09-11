/**
 * calculates time to read an article
 *
 * @param {string} article
 * @returns {number} timeToRead - time it takes to read an article
 */
const calculateTimeToRead = (article) => {
  const averageReadSpeed = 265; // words per minute

  // get article word count
  const articleWordCount = article.body.split(' ').length;
  const timeToRead = articleWordCount / averageReadSpeed;

  return Math.ceil(timeToRead);
};

export default calculateTimeToRead;
