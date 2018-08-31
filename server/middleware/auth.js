import TokenHelper from '../utils/TokenHelper';
/**
 *
 *
 * @class auth
 */
export default class auth {
  /**
   * authenticate a user using provided token
   *
   * @static
   * @param {*} req
   * @param {*} res
   * @param {*} next
   * @returns {next} next middleware
   * @memberof auth
   */
  static authenticateUser(req, res, next) {
    const { authorization } = req.headers;
    if (!authorization) {
      const error = new Error('no token provided');
      error.status = 403;
      return next(error);
    }
    if (authorization.split(' ')[0] !== 'Bearer') {
      // invalid auth format
      const error = new Error('Invalid authorization format');
      error.status = 401;
      return next(error);
    }
    const token = authorization.split(' ')[1];
    const decoded = TokenHelper.decodeToken(token);
    if (typeof decoded.id === 'undefined') {
      return next(decoded);
    }
    // set user ID in request object for next middlewares use
    req.userId = decoded.id;
    // user authorised to access resource
    return next();
  }
}
