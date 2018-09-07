import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Token helper utility class
 *
 * @export
 * @class TokenHelper
 */
export default class TokenHelper {
  /**
   * Generates jwt token
   *
   * @static
   * @param {object} user
   * @returns {string} jwt token
   * @memberof Token
   */
  static generateToken(user) {
    const { id, username, role } = user;
    const token = jwt.sign({
      id, username, role
    }, process.env.JWT_KEY, {
      expiresIn: '24h',
    });

    return token;
  }

  /**
   * Decodes jwt token
   *
   * @static
   * @param {string} token
   * @returns {number | false} decoded user id or false if invalid
   * @memberof Token
   */
  static decodeToken(token) {
    return jwt.verify(token, process.env.JWT_KEY, (err, decoded) => {
      if (err) {
        const error = new Error(err);
        error.status = 401;
        return error;
      }
      return decoded;
    });
  }
}
