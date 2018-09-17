/**
 * Get the highest occuring value
 *
 * @param {string} words
 * @returns {number} returns the value that occurs most
*/

const mode = (string) => {
  const modeObj = {};
  let greatestFreq = 0;
  let modeValue;
  string.forEach((word) => {
    modeObj[word] = (modeObj[word] || 0) + 1;

    if (greatestFreq < modeObj[word]) {
      greatestFreq = modeObj[word];
      modeValue = word;
    }
  });
  return modeValue;
};

export default mode;
