import TokenHelper from '../utils/TokenHelper';
import { isAdmin, isAuthor, isSuperAdmin } from '../utils/verifyRoles';

/**
 *
 *
 * @class auth
 */
export default class auth {
  /**
   * authenticate a user using provided token
   * Sets userId, userRole, userName as properties on req object
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
    // extract payload from decoded jwt
    const { id, username, role } = decoded;
    req.userId = id;
    req.userRole = role;
    req.userName = username;
    // user authorised to access resource
    return next();
  }

  /**
   * authorizes a user whose role is set to "admin"
   *
   * @static
   * @param {*} req
   * @param {*} res
   * @param {*} next
   * @returns {next} next middleware
   * @memberof auth
   */
  static authorizeAdmin(req, res, next) {
    // before code got here user is clearly 'authed' with token
    // obtain userRole as previously set in req object
    const { userRole } = req;

    if (!isAdmin(userRole)) {
      const error = new Error('You are not an Admin');
      error.status = 401;
      return next(error);
    }
    return next();
  }

  /**
   * authorizes a user whose role is set to "author"
   *
   * @static
   * @param {*} req
   * @param {*} res
   * @param {*} next
   * @returns {next} next middleware
   * @memberof auth
   */
  static authorizeAuthor(req, res, next) {
    // before code got here user is clearly authed with token
    // obtain userRole as previously set in req object
    const { userRole } = req;

    if (!isAuthor(userRole)) {
      const error = new Error('You are not an Author');
      error.status = 401;
      return next(error);
    }
    return next();
  }

  /**
   * authorizes a user whose role is set to "superAdmin"
   *
   * @static
   * @param {*} req
   * @param {*} res
   * @param {*} next
   * @returns {next} next middleware
   * @memberof auth
   */
  static authorizeSuperAdmin(req, res, next) {
    // before code got here user is clearly authed with token
    // obtain userRole as previously set in req object
    const { userRole } = req;

    if (!isSuperAdmin(userRole)) {
      const error = new Error('you are not a Super Admin');
      error.status = 401;
      return next(error);
    }
    return next();
  }
}
