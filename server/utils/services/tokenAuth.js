import jwt from 'jsonwebtoken';

const tokenAuth = {
  /**
   * Make a new token
   * @param {Object} payload - object to be encoded into a token
   * @param {Number} expiresIn - time for token to expire
   * @returns {String} token
   */

  makeToken({ payload, expiresIn }) {
    return jwt.sign(payload, process.env.SECRET_KEY, { expiresIn });
  },

  /**
   * Verfiy a token
   * @param {Object} token - object to be encoded into a token
   * @param {Number} expiresIn - time for token to expire
   * @returns {String} token
   */
  verifyToken(token) {
    try {
      jwt.verify(token, process.env.SECRET_KEY);
    } catch (error) {
      return error;
    }
  }
};

export default tokenAuth;
